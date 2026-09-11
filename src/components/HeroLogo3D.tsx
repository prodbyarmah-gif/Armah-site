import { useEffect, useRef, useState } from 'react';
import type { HeroTheme } from '../lib/hero3d';
import { HERO_ROTATION_AXIS, heroSwingAngle, getHero3dPolicy, getHero3dTheme, WAVEFORM_SECTION_COLORS, waveformSection } from '../lib/hero3d';

type Props = { reducedMotion: boolean | null };
type Connection = Navigator & { connection?: { saveData?: boolean } };

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function currentTheme(): HeroTheme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function applyGhanaWaveformColors(THREE: typeof import('three'), mesh: import('three').Mesh): void {
  // The waveform is 135 evenly spaced bars: indices 0–44 RED, 45–89 YELLOW,
  // 90–134 GREEN. Assign per-bar (not per-vertex thirds) so no bar straddles
  // a section boundary.
  const positions = mesh.geometry.getAttribute('position') as import('three').BufferAttribute;
  let minimum = Infinity;
  let maximum = -Infinity;
  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    minimum = Math.min(minimum, x);
    maximum = Math.max(maximum, x);
  }
  const colors = new Float32Array(positions.count * 3);
  const sections = WAVEFORM_SECTION_COLORS.map((color) => new THREE.Color(color));
  for (let index = 0; index < positions.count; index += 1) {
    const normalized = (positions.getX(index) - minimum) / (maximum - minimum);
    sections[waveformSection(normalized)].toArray(colors, index * 3);
  }
  mesh.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
}

// High-contrast studio environment for polished chrome: near-black room with
// bright strip softboxes (clean highlights), dark zones (depth), and one
// controlled red strip (club reflection). No geometry is added to the render.
function buildChromeEnvironment(THREE: typeof import('three')): import('three').Scene {
  const environment = new THREE.Scene();
  const room = new THREE.Mesh(
    new THREE.BoxGeometry(24, 14, 24),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.012, 0.012, 0.016), side: THREE.BackSide }),
  );
  environment.add(room);
  const strip = (
    width: number,
    height: number,
    color: [number, number, number],
    position: [number, number, number],
  ): void => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ color: new THREE.Color(...color), side: THREE.DoubleSide }),
    );
    mesh.position.set(...position);
    mesh.lookAt(0, 0, 0);
    environment.add(mesh);
  };
  // Overhead is split bright-left / dim-right so flat faces read bright
  // silver on one side and fall into darker reflected zones on the other
  // (chrome contrast), plus a thin hot strip for edge sparkle.
  strip(9, 3.5, [9, 9, 9.5], [-4.5, 6, 1.5]);
  strip(9, 3.5, [3.4, 3.5, 4], [4.5, 6, 1.5]);
  strip(1.2, 4, [16, 16, 17], [-2, 6, 1.5]);
  strip(2.2, 7, [7, 7, 7.5], [-8, 1.5, 2]);
  strip(2.2, 7, [6, 6, 6.5], [8, 1.5, 2]);
  strip(10, 1.6, [3, 3.2, 3.6], [0, -3.5, 8]);
  strip(5, 1.1, [7, 0.55, 0.6], [4.5, -1, 6.5]);
  strip(6, 1.2, [1.2, 1.8, 2.6], [-3, 2.5, -7]);
  return environment;
}

function disposeObject(object: import('three').Object3D): void {
  object.traverse((child) => {
    const mesh = child as import('three').Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        const texture = value as { isTexture?: boolean; dispose?: () => void } | null;
        if (texture?.isTexture) texture.dispose?.();
      });
      material.dispose();
    });
  });
}

export default function HeroLogo3D({ reducedMotion }: Props): JSX.Element {
  const hostRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<HeroTheme>(() => currentTheme());
  // True only when WebGL/GLB enhancement definitively failed: the flat
  // fallback image is then the intentional visual. During a normal boot the
  // fallback is NOT shown — it reads as an unfinished 3D logo next to the
  // poster, so the boot visual stays the live poster/video until the first
  // correct chrome frame crossfades in. Static (reduced-motion/Save-Data/
  // no-WebGL) mode always renders the fallback.
  const [failed, setFailed] = useState(false);
  const saveData = Boolean((navigator as Connection).connection?.saveData);
  const staticOnly = Boolean(reducedMotion) || saveData || !supportsWebGL();

  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(currentTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (staticOnly) {
      return;
    }

    setFailed(false);

    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let running = false;
    let frame = 0;
    let lastFrame = 0;
    let elapsed = 0;
    let model: import('three').Object3D | undefined;
    let renderer: import('three').WebGLRenderer | undefined;
    let environment: import('three').Texture | undefined;
    let environmentScene: import('three').Scene | undefined;
    let pmrem: import('three').PMREMGenerator | undefined;
    let resizeObserver: ResizeObserver | undefined;
    let intersectionObserver: IntersectionObserver | undefined;
    let visibilityListener: (() => void) | undefined;

    const fail = () => {
      if (disposed) return;
      running = false;
      host.style.opacity = '0';
      setFailed(true);
    };

    void Promise.all([
      import('three'),
      import('three/examples/jsm/loaders/GLTFLoader.js'),
    ]).then(([THREE, { GLTFLoader }]) => {
      if (disposed) return;
      const policy = getHero3dPolicy({
        reducedMotion: false,
        saveData: false,
        webglAvailable: true,
        width: host.clientWidth,
        dpr: window.devicePixelRatio || 1,
      });
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(policy.mobile ? 38 : 32, 1, 0.1, 100);
      // Edge-on the sign keeps its 1-unit height (Z rotation preserves Z), so
      // no extra headroom is needed; 6.1 restores the approved framing.
      camera.position.set(0, policy.mobile ? 6.9 : 6.1, 0);
      camera.lookAt(0, 0, 0);
      const key = new THREE.DirectionalLight(0xf7f9ff, 4.5);
      key.position.set(-2.2, 4.5, 3);
      const rim = new THREE.DirectionalLight(0xa31621, 2.2);
      rim.position.set(2.8, -1.2, 2.6);
      const fill = new THREE.HemisphereLight(0xb7c5dd, 0x101014, 0.5);
      const ambient = new THREE.AmbientLight(0xe9efff, 0.12);
      scene.add(key, rim, fill, ambient);

      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      } catch {
        fail();
        return;
      }
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      renderer.domElement.className = 'h-full w-full';
      // Progressive enhancement: the canvas stays invisible while WebGL
      // initializes. It is only revealed after the GLB is loaded, final
      // materials are assigned, environment/lights are ready, camera/model
      // transforms are set, and a correct final frame has been rendered —
      // so no raw GLB, default material, wrong scale/orientation, or
      // unfinished lighting state is ever visible. No timeouts involved.
      host.replaceChildren(renderer.domElement);
      pmrem = new THREE.PMREMGenerator(renderer);
      environmentScene = buildChromeEnvironment(THREE);
      environment = pmrem.fromScene(environmentScene, 0.04).texture;
      scene.environment = environment;

      const applyTheme = (nextTheme: HeroTheme) => {
        if (!model) return;
        const settings = getHero3dTheme(nextTheme);
        key.intensity = 4.5 * settings.intensity;
        rim.color.setHex(settings.rimColor);
        rim.intensity = 2.2 * settings.intensity;
        if (renderer) renderer.toneMappingExposure = settings.exposure;
        model.traverse((child) => {
          const mesh = child as import('three').Mesh;
          if (!mesh.isMesh) return;
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => {
            const standard = material as import('three').MeshStandardMaterial;
            if (!standard.isMeshStandardMaterial) return;
            const waveform = mesh.name.includes('Waveform');
            if (waveform) applyGhanaWaveformColors(THREE, mesh);
            standard.color.setHex(waveform ? 0xffffff : settings.metalColor);
            standard.vertexColors = waveform;
            standard.metalness = waveform ? 0.75 : 1;
            standard.roughness = waveform ? 0.28 : settings.roughness;
            standard.envMapIntensity = waveform ? 0.55 : settings.envMapIntensity;
            standard.emissive.setHex(0x000000);
            standard.emissiveIntensity = 0;
            standard.needsUpdate = true;
          });
        });
      };

      const resize = () => {
        if (!renderer) return;
        const next = getHero3dPolicy({
          reducedMotion: false,
          saveData: false,
          webglAvailable: true,
          width: host.clientWidth,
          dpr: window.devicePixelRatio || 1,
        });
        camera.fov = next.mobile ? 38 : 32;
        camera.position.y = next.mobile ? 6.9 : 6.1;
        camera.lookAt(0, 0, 0);
        camera.aspect = Math.max(host.clientWidth, 1) / Math.max(host.clientHeight, 1);
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(next.dpr);
        renderer.setSize(host.clientWidth, host.clientHeight, false);
      };

      const render = (time: number) => {
        if (!running || !renderer) return;
        frame = window.requestAnimationFrame(render);
        if (time - lastFrame < 1000 / 30) return;
        const delta = lastFrame === 0 ? 0 : Math.min(time - lastFrame, 100);
        lastFrame = time;
        if (model) {
          // Owner-approved swing about world Z (see HERO_ROTATION_AXIS): Z
          // is the physical line the letter tops stand along, so the
          // wordmark yaws LEFT <-> RIGHT (±90°, 180° total) while staying
          // upright. Absolute function of elapsed time — pausing the loop
          // (offscreen/hidden tab) freezes the swing without jumps.
          elapsed += delta;
          model.rotation[HERO_ROTATION_AXIS] = heroSwingAngle(elapsed);
        }
        renderer.render(scene, camera);
      };
      const syncRunning = () => {
        const eligible = document.visibilityState === 'visible' && host.dataset.visible === 'true';
        if (eligible && !running) {
          running = true;
          lastFrame = 0;
          frame = window.requestAnimationFrame(render);
        } else if (!eligible && running) {
          running = false;
          window.cancelAnimationFrame(frame);
        }
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      intersectionObserver = new IntersectionObserver(([entry]) => {
        host.dataset.visible = entry.isIntersecting && entry.intersectionRatio > 0.05 ? 'true' : 'false';
        syncRunning();
      }, { threshold: [0, 0.05] });
      intersectionObserver.observe(host);
      visibilityListener = syncRunning;
      document.addEventListener('visibilitychange', visibilityListener);
      renderer.domElement.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        fail();
      }, { once: true });

      new GLTFLoader().load('/assets/hero/armah-logo.glb', (gltf) => {
        if (disposed) {
          disposeObject(gltf.scene);
          return;
        }
        model = gltf.scene;
        model.rotation.set(0, 0, 0);
        scene.add(model);
        applyTheme(currentTheme());
        resize();
        // Render the final frame while still invisible, then reveal.
        renderer?.render(scene, camera);
        if (!disposed) {
          host.style.opacity = '1';
          syncRunning();
        }
      }, undefined, fail);
    }).catch(fail);

    return () => {
      disposed = true;
      running = false;
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      if (visibilityListener) document.removeEventListener('visibilitychange', visibilityListener);
      if (model) disposeObject(model);
      if (environmentScene) disposeObject(environmentScene);
      environment?.dispose();
      pmrem?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
      host.replaceChildren();
    };
  }, [staticOnly, theme]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[clamp(4.5rem,15vh,8.5rem)] z-10 mx-auto h-[min(32vh,330px)] min-h-[200px] w-[min(94vw,900px)]">
      {(staticOnly || failed) && (
        <img
          src={theme === 'light' ? '/assets/hero/armah-logo-fallback-light.png' : '/assets/hero/armah-logo-fallback-dark.png'}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
      {!staticOnly && <div ref={hostRef} data-visible="true" className="absolute inset-0 opacity-0 transition-opacity duration-300" />}
    </div>
  );
}
