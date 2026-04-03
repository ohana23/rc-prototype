import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import TopNav from "@/components/TopNav";

type NavIndicatorState = {
  visible: boolean;
  x: number;
  y: number;
  isHotspot: boolean;
};

type Hotspot = {
  id: string;
  yaw: number;
  pitch: number;
  radius: number;
};

type CapturePoint = {
  id: string;
  label: string;
  captureDate: string;
  imagePath: string;
};

const CAPTURE_POINTS: CapturePoint[] = [
  {
    id: "jan-2026",
    label: "Jan 2026",
    captureDate: "Jan 18, 2026",
    imagePath: "/panoramas/office-interior-pano.jpeg",
  },
  {
    id: "feb-2026",
    label: "Feb 2026",
    captureDate: "Feb 11, 2026",
    imagePath: "/panoramas/citycase-pano.jpg",
  },
  {
    id: "mar-2026",
    label: "Mar 2026",
    captureDate: "Mar 24, 2026",
    imagePath: "/panoramas/sky-landscape-pano.jpg",
  },
  {
    id: "apr-2026",
    label: "Apr 2026",
    captureDate: "Apr 3, 2026",
    imagePath: "/panoramas/darren-backyard-pano.jpg",
  },
];

export default function ViewerPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const minimapFrameRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<{ fov: number; updateProjectionMatrix: () => void } | null>(null);
  const updatePanoramaRef = useRef<((imagePath: string) => Promise<void>) | null>(null);
  const minimapHeadingRef = useRef(0);
  const fovRef = useRef(75);
  const isPlayingRef = useRef(false);
  const hotspotsRef = useRef<Hotspot[]>([
    { id: "northwest-core", yaw: -0.4, pitch: -0.28, radius: 0.2 },
    { id: "field-entry", yaw: 0.45, pitch: -0.22, radius: 0.2 },
  ]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [navIndicator, setNavIndicator] = useState<NavIndicatorState>({
    visible: false,
    x: 0,
    y: 0,
    isHotspot: false,
  });
  const [activeCaptureId, setActiveCaptureId] = useState(CAPTURE_POINTS[0].id);
  const [minimapHeadingDeg, setMinimapHeadingDeg] = useState(0);
  const [isMinimapFullscreen, setIsMinimapFullscreen] = useState(false);
  const [isToolbarNearBottom, setIsToolbarNearBottom] = useState(false);
  const [isToolbarHovered, setIsToolbarHovered] = useState(false);
  const activeCapture = CAPTURE_POINTS.find((point) => point.id === activeCaptureId) ?? CAPTURE_POINTS[0];
  const activeCaptureIndex = CAPTURE_POINTS.findIndex((point) => point.id === activeCapture.id);
  const isFirstCapture = activeCaptureIndex <= 0;
  const isLastCapture = activeCaptureIndex >= CAPTURE_POINTS.length - 1;
  const isQuickToolbarOpen = isToolbarNearBottom || isToolbarHovered;

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    let disposed = false;
    let frameId = 0;
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const init = async () => {
      const THREE = await import("three");
      if (disposed || !containerRef.current) {
        return;
      }

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.domElement.className = "immersive-viewer__canvas";
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        fovRef.current,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, 0.1);
      cameraRef.current = camera;

      const geometry = new THREE.SphereGeometry(500, 64, 40);
      geometry.scale(-1, 1, 1);
      const material = new THREE.MeshBasicMaterial();
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      const textureLoader = new THREE.TextureLoader();

      let loadVersion = 0;
      let activeTexture: { dispose: () => void } | null = null;
      const loadPanoramaTexture = async (imagePath: string) => {
        const currentLoadVersion = ++loadVersion;
        const loadedTexture = await textureLoader.loadAsync(imagePath);

        if (disposed || currentLoadVersion !== loadVersion) {
          loadedTexture.dispose();
          return;
        }

        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        const previousTexture = activeTexture;
        activeTexture = loadedTexture;
        material.map = loadedTexture;
        material.needsUpdate = true;
        if (previousTexture) {
          previousTexture.dispose();
        }
      };

      updatePanoramaRef.current = loadPanoramaTexture;
      await loadPanoramaTexture(activeCapture.imagePath);
      if (disposed) {
        return;
      }

      const raycaster = new THREE.Raycaster();
      const pointerNdc = new THREE.Vector2();

      let isDragging = false;
      let lastX = 0;
      let lastY = 0;
      let yaw = 0;
      let pitch = 0;

      const hideIndicator = () => {
        setNavIndicator((previous) => {
          if (!previous.visible) {
            return previous;
          }
          return { ...previous, visible: false };
        });
      };

      const updateIndicator = (x: number, y: number, isHotspot: boolean) => {
        setNavIndicator((previous) => {
          const changed =
            !previous.visible ||
            Math.abs(previous.x - x) > 0.5 ||
            Math.abs(previous.y - y) > 0.5 ||
            previous.isHotspot !== isHotspot;

          if (!changed) {
            return previous;
          }

          return {
            visible: true,
            x,
            y,
            isHotspot,
          };
        });
      };

      const toAngles = (direction: { x: number; y: number; z: number }) => {
        return {
          yaw: Math.atan2(direction.x, direction.z),
          pitch: Math.asin(Math.max(-1, Math.min(1, direction.y))),
        };
      };

      const getHotspotMatch = (direction: { x: number; y: number; z: number }) => {
        const angles = toAngles(direction);
        return hotspotsRef.current.find((hotspot) => {
          const distance = Math.hypot(angles.yaw - hotspot.yaw, angles.pitch - hotspot.pitch);
          return distance <= hotspot.radius;
        });
      };

      const onPointerDown = (event: PointerEvent) => {
        isDragging = true;
        lastX = event.clientX;
        lastY = event.clientY;
        setIsToolbarNearBottom(false);
        hideIndicator();
      };

      const onPointerMove = (event: PointerEvent) => {
        if (isDragging) {
          const deltaX = event.clientX - lastX;
          const deltaY = event.clientY - lastY;
          lastX = event.clientX;
          lastY = event.clientY;
          yaw += deltaX * 0.003;
          pitch += deltaY * 0.003;
          pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch));
          setIsToolbarNearBottom(false);
          hideIndicator();
          return;
        }

        const rect = renderer.domElement.getBoundingClientRect();
        const localX = event.clientX - rect.left;
        const localY = event.clientY - rect.top;
        const inside = localX >= 0 && localX <= rect.width && localY >= 0 && localY <= rect.height;

        if (!inside) {
          setIsToolbarNearBottom(false);
          hideIndicator();
          return;
        }

        const controlsTop = controlsRef.current
          ? controlsRef.current.getBoundingClientRect().top - rect.top
          : rect.height - 90;
        const toolbarTriggerTop = Math.max(0, controlsTop - 60);
        const toolbarTriggerBottom = controlsTop + 10;
        const shouldOpenToolbar = localY >= toolbarTriggerTop && localY <= toolbarTriggerBottom;
        setIsToolbarNearBottom((previous) => (previous === shouldOpenToolbar ? previous : shouldOpenToolbar));

        pointerNdc.x = (localX / rect.width) * 2 - 1;
        pointerNdc.y = -(localY / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointerNdc, camera);

        const intersections = raycaster.intersectObject(sphere, false);
        if (intersections.length === 0) {
          hideIndicator();
          return;
        }

        const direction = intersections[0].point.clone().normalize();
        const hotspotMatch = getHotspotMatch(direction);
        if (!hotspotMatch) {
          hideIndicator();
          return;
        }

        updateIndicator(localX, localY, true);
      };

      const onPointerUp = () => {
        isDragging = false;
      };

      const onPointerLeave = () => {
        setIsToolbarNearBottom(false);
        hideIndicator();
      };

      const onWheel = (event: WheelEvent) => {
        event.preventDefault();
        fovRef.current = Math.max(35, Math.min(95, fovRef.current + event.deltaY * 0.03));
        camera.fov = fovRef.current;
        camera.updateProjectionMatrix();
      };

      const onResize = () => {
        if (!containerRef.current) {
          return;
        }
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };

      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      renderer.domElement.addEventListener("pointermove", onPointerMove);
      renderer.domElement.addEventListener("pointerleave", onPointerLeave);
      window.addEventListener("pointerup", onPointerUp);
      renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("resize", onResize);

      const tick = () => {
        if (disposed) {
          return;
        }

        if (isPlayingRef.current) {
          yaw += 0.0009;
        }

        camera.rotation.order = "YXZ";
        camera.rotation.y = yaw;
        camera.rotation.x = pitch;

        const normalizedHeadingDeg = ((((yaw * 180) / Math.PI) % 360) + 360) % 360;
        if (Math.abs(normalizedHeadingDeg - minimapHeadingRef.current) > 0.35) {
          minimapHeadingRef.current = normalizedHeadingDeg;
          setMinimapHeadingDeg(normalizedHeadingDeg);
        }

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(tick);
      };
      tick();

      const cleanup = () => {
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        renderer.domElement.removeEventListener("pointermove", onPointerMove);
        renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
        window.removeEventListener("pointerup", onPointerUp);
        renderer.domElement.removeEventListener("wheel", onWheel);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(frameId);
        geometry.dispose();
        material.dispose();
        if (activeTexture) {
          activeTexture.dispose();
        }
        updatePanoramaRef.current = null;
        renderer.dispose();
        cameraRef.current = null;
        if (renderer.domElement.parentElement) {
          renderer.domElement.parentElement.removeChild(renderer.domElement);
        }
      };

      (container as unknown as { __cleanup?: () => void }).__cleanup = cleanup;
    };

    void init();

    return () => {
      disposed = true;
      const element = container as unknown as { __cleanup?: () => void };
      if (element.__cleanup) {
        element.__cleanup();
      }
    };
  }, []);

  useEffect(() => {
    if (updatePanoramaRef.current) {
      void updatePanoramaRef.current(activeCapture.imagePath);
    }
  }, [activeCapture.imagePath]);

  const handleZoom = (delta: number) => {
    fovRef.current = Math.max(35, Math.min(95, fovRef.current + delta));
    if (cameraRef.current) {
      cameraRef.current.fov = fovRef.current;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsMinimapFullscreen(document.fullscreenElement === minimapFrameRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const handleToggleMinimapFullscreen = async () => {
    const frame = minimapFrameRef.current;
    if (!frame) {
      return;
    }

    if (document.fullscreenElement === frame) {
      await document.exitFullscreen();
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }

    await frame.requestFullscreen();
  };

  const handlePreviousCapture = () => {
    if (isFirstCapture) {
      return;
    }

    const previousCapture = CAPTURE_POINTS[activeCaptureIndex - 1];
    if (previousCapture) {
      setActiveCaptureId(previousCapture.id);
    }
  };

  const handleNextCapture = () => {
    if (isLastCapture) {
      return;
    }

    const nextCapture = CAPTURE_POINTS[activeCaptureIndex + 1];
    if (nextCapture) {
      setActiveCaptureId(nextCapture.id);
    }
  };

  return (
    <>
      <TopNav />
      <main className="immersive-viewer" aria-label="Immersive jobsite viewer">
        <section className="immersive-viewer__stage" aria-label="3D viewer stage">
          <div className="immersive-viewer__viewport" ref={containerRef}>
            <div className="immersive-viewer__top-row">
              <NextLink href="/" className="immersive-viewer__back-link">
                ← Back to Overview
              </NextLink>
            </div>
            <aside className="immersive-viewer__minimap" aria-label="Job site mini-map">
              <div className="immersive-viewer__minimap-frame" ref={minimapFrameRef}>
                <button
                  type="button"
                  className="immersive-viewer__minimap-fullscreen-button"
                  onClick={() => {
                    void handleToggleMinimapFullscreen();
                  }}
                  aria-label={isMinimapFullscreen ? "Exit drawing fullscreen" : "Open drawing fullscreen"}
                  aria-pressed={isMinimapFullscreen}
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                    <path
                      d={
                        isMinimapFullscreen
                          ? "M3 8h1.75V5.75H7V4H3v4zm12.25 0H17V4h-4v1.75h2.25V8zM7 12H4.75v2.25H3V18h4v-1.75H4.75V12H7zm8 0v4.25H13V18h4v-4.25h-1.75V12H15z"
                          : "M7 3H3v4h1.75V4.75H7V3zm10 0h-4v1.75h2.25V7H17V3zM3 13v4h4v-1.75H4.75V13H3zm12.25 0v2.25H13V17h4v-4h-1.75z"
                      }
                    />
                  </svg>
                </button>
                <img
                  className="immersive-viewer__minimap-image"
                  src="/minimap/jobsite-floorplan.png"
                  alt="Job site floor plan drawing"
                  draggable={false}
                />
                <span className="immersive-viewer__minimap-indicator" aria-hidden="true">
                  <span
                    className="immersive-viewer__minimap-fov"
                    style={{ transform: `translateY(-50%) rotate(${minimapHeadingDeg}deg)` }}
                  />
                  <span className="immersive-viewer__minimap-you" />
                </span>
              </div>
            </aside>
            <div className="immersive-viewer__hud">
              {/* <p className="immersive-viewer__viewport-label">Drag to look around. Scroll to zoom.</p> */}
            </div>
            {navIndicator.visible ? (
              <div
                className={`immersive-viewer__nav-indicator${
                  navIndicator.isHotspot ? " immersive-viewer__nav-indicator--hotspot" : ""
                }`}
                style={{ left: `${navIndicator.x}px`, top: `${navIndicator.y}px` }}
                aria-hidden="true"
              />
            ) : null}
            <div
              className={`immersive-viewer__quick-toolbar${
                isQuickToolbarOpen ? " immersive-viewer__quick-toolbar--open" : ""
              }`}
              aria-hidden={!isQuickToolbarOpen}
              onMouseEnter={() => {
                setIsToolbarHovered(true);
              }}
              onMouseLeave={() => {
                setIsToolbarHovered(false);
              }}
            >
              <button
                type="button"
                className="immersive-viewer__quick-toolbar-button"
              >
                Measure
              </button>
              <button
                type="button"
                className="immersive-viewer__quick-toolbar-button"
              >
                Markup
              </button>
              <button
                type="button"
                className="immersive-viewer__quick-toolbar-button"
              >
                Snapshot
              </button>
              <button
                type="button"
                className="immersive-viewer__quick-toolbar-button"
              >
                Layers
              </button>
            </div>
            {!isQuickToolbarOpen ? <div className="immersive-viewer__quick-toolbar-capsule" aria-hidden="true" /> : null}
            <div className="immersive-viewer__controls" aria-label="Viewer controls" ref={controlsRef}>
              <div className="immersive-viewer__control-buttons">
                <button
                  type="button"
                  className="immersive-viewer__control-button"
                  onClick={() => {
                    setIsPlaying((prev) => !prev);
                  }}
                  aria-pressed={isPlaying}
                  aria-label={isPlaying ? "Pause playback" : "Play playback"}
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  type="button"
                  className="immersive-viewer__control-button"
                  onClick={() => {
                    handleZoom(-4);
                  }}
                >
                  Zoom +
                </button>
                <button
                  type="button"
                  className="immersive-viewer__control-button"
                  onClick={() => {
                    handleZoom(4);
                  }}
                >
                  Zoom -
                </button>
              </div>

              <div className="immersive-viewer__capture-nav" aria-label="Capture navigator">
                <span className="immersive-viewer__capture-nav-date">{activeCapture.captureDate}</span>
                <div className="immersive-viewer__capture-nav-arrows">
                  <button
                    type="button"
                    className="immersive-viewer__capture-nav-button"
                    onClick={handlePreviousCapture}
                    aria-label="Show previous capture"
                    disabled={isFirstCapture}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.73529 10.2662L10.5026 16.236L8.69468 18L0 9L8.69468 0L10.5026 1.76397L4.73529 7.73383L18 7.73383V10.2662L4.73529 10.2662Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="immersive-viewer__capture-nav-button"
                    onClick={handleNextCapture}
                    aria-label="Show next capture"
                    disabled={isLastCapture}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.2647 7.73383L7.49737 1.76397L9.30532 0L18 9L9.30532 18L7.49737 16.236L13.2647 10.2662L0 10.2662L0 7.73383L13.2647 7.73383Z"
                        fill="#FFFFFF"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
