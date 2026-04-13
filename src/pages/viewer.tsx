import { type ReactNode, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
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

type TaskDiscipline = "Mechanical" | "Electrical" | "Plumbing";

type CaptureTask = {
  id: string;
  number: number;
  title: string;
  discipline: TaskDiscipline;
  assignees: string;
  dueDate: string;
  category: TaskDiscipline;
  distributionList: string;
  createdBy: string;
  createdAt: string;
  private: "Yes" | "No";
  origin: string;
  description: string;
  location: string;
  status: "In Progress";
  viewSpot: {
    yaw: number;
    pitch: number;
  };
};

type PanAnimationState = {
  active: boolean;
  startTime: number;
  durationMs: number;
  fromYaw: number;
  deltaYaw: number;
  fromPitch: number;
  toPitch: number;
};

type TaskPinScreenPosition = {
  taskId: string;
  x: number;
  y: number;
};

type SideTool = {
  id: string;
  label: string;
  icon: ReactNode;
};

type ProgressCategory = {
  id: string;
  title: string;
  installed: number;
  total: number;
  unit?: string;
};

type ProgressSubItem = {
  id: string;
  title: string;
  installed: number;
  total: number;
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
  {
    id: "may-2026",
    label: "May 2026",
    captureDate: "May 7, 2026",
    imagePath: "/panoramas/con-pano-1.jpg",
  },
  {
    id: "jun-2026",
    label: "Jun 2026",
    captureDate: "Jun 10, 2026",
    imagePath: "/panoramas/con-pano-2.jpg",
  },
  {
    id: "jul-2026",
    label: "Jul 2026",
    captureDate: "Jul 15, 2026",
    imagePath: "/panoramas/con-pano-3.jpg",
  },
  {
    id: "interior-detail-2026",
    label: "Interior Detail",
    captureDate: "Aug 4, 2026",
    imagePath: "/panoramas/con-pano-interior.jpg",
  },
  {
    id: "aug-2026",
    label: "Aug 2026",
    captureDate: "Aug 5, 2026",
    imagePath: "/panoramas/project-map-preview-360-v2.png",
  },
];

const TASK_SCOPE_BY_CAPTURE_ID: Record<string, string> = {
  "jan-2026": "North core shell",
  "feb-2026": "West office corridor",
  "mar-2026": "Roof mechanical zone",
  "apr-2026": "South utility chase",
  "may-2026": "Podium level MEP rack",
  "jun-2026": "Level 2 distribution run",
  "jul-2026": "Tenant fit-out wing",
  "interior-detail-2026": "Interior detail room",
  "aug-2026": "Main entry ceiling plenum",
};

const hashSeed = (value: string) => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const buildTaskViewSpot = (seed: string) => {
  const yawHash = hashSeed(`${seed}-yaw`);
  const pitchHash = hashSeed(`${seed}-pitch`);
  const yawUnit = yawHash / 4294967295;
  const pitchUnit = pitchHash / 4294967295;
  return {
    yaw: yawUnit * Math.PI * 2 - Math.PI,
    pitch: pitchUnit * (Math.PI / 1.5) - Math.PI / 3,
  };
};

const TASK_ASSIGNEES = ["Avery Chen", "Jordan Lee", "Riley Patel", "Morgan Diaz", "Taylor Nguyen", "Cameron Smith"];
const TASK_CREATORS = ["Sam Rivera", "Jamie Kim", "Drew Thompson", "Casey Robinson"];
const TASK_DUE_DATES = ["Sep 02, 2026", "Sep 06, 2026", "Sep 09, 2026", "Sep 13, 2026", "Sep 17, 2026", "Sep 21, 2026"];
const TASK_CREATED_DATES = [
  "Aug 11, 2026",
  "Aug 12, 2026",
  "Aug 13, 2026",
  "Aug 14, 2026",
  "Aug 15, 2026",
  "Aug 16, 2026",
];
const TASK_DETAIL_PHOTO_PATHS = [
  "/task-detail-photos/detail-photo-1.png",
  "/task-detail-photos/detail-photo-2.png",
  "/task-detail-photos/detail-photo-3.png",
];

const buildTasksForCapture = (captureId: string, captureLabel: string): CaptureTask[] => {
  const scope = TASK_SCOPE_BY_CAPTURE_ID[captureId] ?? captureLabel;
  const baseTasks: Array<
    Pick<CaptureTask, "id" | "title" | "discipline" | "location" | "status" | "viewSpot">
  > = [
    {
      id: `${captureId}-m-ahu-startup`,
      title: `Finalize AHU startup checklist in ${scope}`,
      discipline: "Mechanical",
      location: "Air handling zone",
      status: "In Progress",
      viewSpot: buildTaskViewSpot(`${captureId}-m-ahu-startup`),
    },
    {
      id: `${captureId}-m-vav-balance`,
      title: `Balance VAV airflow setpoints for ${captureLabel}`,
      discipline: "Mechanical",
      location: "Supply duct branch",
      status: "In Progress",
      viewSpot: buildTaskViewSpot(`${captureId}-m-vav-balance`),
    },
    {
      id: `${captureId}-e-panel-terminate`,
      title: `Complete panelboard terminations at ${scope}`,
      discipline: "Electrical",
      location: "Electrical room",
      status: "In Progress",
      viewSpot: buildTaskViewSpot(`${captureId}-e-panel-terminate`),
    },
    {
      id: `${captureId}-e-lighting-verify`,
      title: `Verify lighting control circuits and occupancy sensors`,
      discipline: "Electrical",
      location: "Lighting branch circuits",
      status: "In Progress",
      viewSpot: buildTaskViewSpot(`${captureId}-e-lighting-verify`),
    },
    {
      id: `${captureId}-p-pressure-test`,
      title: `Run domestic water pressure test for ${captureLabel}`,
      discipline: "Plumbing",
      location: "Vertical riser segment",
      status: "In Progress",
      viewSpot: buildTaskViewSpot(`${captureId}-p-pressure-test`),
    },
    {
      id: `${captureId}-p-fixture-punch`,
      title: `Close fixture rough-in punch items near ${scope}`,
      discipline: "Plumbing",
      location: "Restroom group",
      status: "In Progress",
      viewSpot: buildTaskViewSpot(`${captureId}-p-fixture-punch`),
    },
  ];

  return baseTasks.map((task, index) => ({
    ...task,
    number: index + 1,
    assignees: TASK_ASSIGNEES[index % TASK_ASSIGNEES.length],
    dueDate: TASK_DUE_DATES[index % TASK_DUE_DATES.length],
    category: task.discipline,
    distributionList: "--",
    createdBy: TASK_CREATORS[index % TASK_CREATORS.length],
    createdAt: TASK_CREATED_DATES[index % TASK_CREATED_DATES.length],
    private: index % 2 === 0 ? "Yes" : "No",
    origin: "--",
    description: "--",
  }));
};

const TASKS_BY_CAPTURE_ID: Record<string, CaptureTask[]> = CAPTURE_POINTS.reduce<Record<string, CaptureTask[]>>(
  (tasksByCaptureId, capture) => {
    tasksByCaptureId[capture.id] = buildTasksForCapture(capture.id, capture.label);
    return tasksByCaptureId;
  },
  {}
);

const PROGRESS_CATEGORIES: ProgressCategory[] = [
  { id: "doors", title: "Doors", installed: 51, total: 71 },
  { id: "masonry", title: "Masonry", installed: 6400, total: 7900, unit: "ft²" },
  { id: "drywall-framing", title: "Drywall + Framing", installed: 14320, total: 19100, unit: "ft²" },
  { id: "mechanical", title: "Mechanical", installed: 114, total: 160 },
  { id: "plumbing", title: "Plumbing", installed: 128, total: 172 },
  { id: "fire-protection", title: "Fire Protection", installed: 95, total: 130 },
  { id: "mechanical-piping", title: "Mechanical Piping", installed: 4220, total: 5480, unit: "ft²" },
  { id: "diffusers", title: "Diffusers", installed: 76, total: 109 },
  { id: "flooring", title: "Flooring", installed: 8814, total: 10391, unit: "ft²" },
  { id: "ceilings", title: "Ceilings (ACT / gypsum)", installed: 9030, total: 12200, unit: "ft²" },
  { id: "millwork", title: "Millwork / Casework", installed: 44, total: 68 },
  { id: "painting", title: "Painting & Wall Finishes", installed: 12400, total: 17350, unit: "ft²" },
  { id: "specialties", title: "Specialties (toilet accessories, lockers, etc.)", installed: 31, total: 57 },
  { id: "glazing", title: "Glazing & Storefront", installed: 3120, total: 4320, unit: "ft²" },
  { id: "electrical-rough-in", title: "Electrical Rough-In", installed: 182, total: 244 },
  { id: "lighting-devices", title: "Lighting & Devices", installed: 139, total: 220 },
  { id: "low-voltage-data", title: "Low Voltage / Data", installed: 88, total: 145 },
  { id: "tile", title: "Tile (walls & floors, if separate from general flooring)", installed: 2570, total: 4030, unit: "ft²" },
  { id: "hardware-installation", title: "Hardware Installation", installed: 59, total: 96 },
  { id: "fixtures-equipment", title: "Fixtures & Equipment Set", installed: 63, total: 102 },
];

const PROGRESS_SUB_ITEMS_BY_CATEGORY_ID: Record<string, string[]> = {
  doors: ["Door frames", "Door slabs", "Seals & weatherstripping", "Door adjustments"],
  masonry: ["Block/brick laid", "Reinforcement", "Grouting", "Joint tooling & cleaning"],
  "drywall-framing": ["Framing layout", "Stud framing", "Board installation", "Taping & finishing"],
  mechanical: ["Equipment set", "Duct rough-in", "Insulation", "Startup & balancing"],
  plumbing: ["Underground rough", "In-wall rough", "Fixtures set", "Testing"],
  "fire-protection": ["Main piping run", "Branch lines", "Heads installed", "Testing & certification"],
  "mechanical-piping": ["Main piping", "Branch piping", "Insulation & labeling", "Flushing & testing"],
  diffusers: ["Box installation", "Duct connections", "Diffusers & grilles", "Airflow verification"],
  flooring: ["Substrate prep", "Underlayments", "Finish install", "Transitions & base"],
  ceilings: ["Grid framing", "Ceiling board/framing", "Tile install", "Access panels & trims"],
  millwork: ["Cabinet boxes", "Counters", "Trim & panels", "Hardware & adjustments"],
  painting: ["Surface prep", "Prime coats", "Finish coats", "Wallcoverings"],
  specialties: ["Backing in walls", "Toilet accessories", "Misc. specialties", "Final alignment"],
  glazing: ["Frames set", "Glazing installed", "Sealants", "Hardware & swing"],
  "electrical-rough-in": ["Conduit rough", "Box installation", "Panelboards set", "Rough inspection"],
  "lighting-devices": ["Lighting layout", "Fixture install", "Device install", "Circuit verification"],
  "low-voltage-data": ["Pathways", "Cable pulls", "Termination", "Testing & labeling"],
  tile: ["Substrate prep", "Layout & setting", "Grouting", "Sealing & cleaning"],
  "hardware-installation": ["Hinges & pivots", "Locksets & latches", "Closers & stops", "Final check"],
  "fixtures-equipment": ["Equipment set", "Anchorage", "Connections", "Startup verification"],
};

const buildProgressSubItems = (category: ProgressCategory): ProgressSubItem[] => {
  const subItemTitles = PROGRESS_SUB_ITEMS_BY_CATEGORY_ID[category.id] ?? [];
  if (subItemTitles.length === 0) {
    return [];
  }

  const totalBase = Math.floor(category.total / subItemTitles.length);
  const totalRemainder = category.total % subItemTitles.length;
  const totalBySubItem = subItemTitles.map((_, index) => totalBase + (index < totalRemainder ? 1 : 0));

  const progressRatio = category.total > 0 ? category.installed / category.total : 0;
  const weightedRaw = subItemTitles.map((title, index) => {
    const seed = hashSeed(`${category.id}-${title}-${index}`);
    const jitter = ((seed % 11) - 5) / 100;
    const itemRatio = Math.min(0.98, Math.max(0.05, progressRatio + jitter));
    return totalBySubItem[index] * itemRatio;
  });
  const rawTotal = weightedRaw.reduce((sum, value) => sum + value, 0);
  const scaleFactor = rawTotal > 0 ? category.installed / rawTotal : 0;
  const installedBySubItem = weightedRaw.map((value, index) => {
    const scaled = Math.round(value * scaleFactor);
    return Math.min(totalBySubItem[index], Math.max(0, scaled));
  });

  const installedCurrentTotal = installedBySubItem.reduce((sum, value) => sum + value, 0);
  let installedDifference = category.installed - installedCurrentTotal;
  if (installedDifference !== 0) {
    for (let index = 0; index < installedBySubItem.length && installedDifference !== 0; index += 1) {
      if (installedDifference > 0 && installedBySubItem[index] < totalBySubItem[index]) {
        installedBySubItem[index] += 1;
        installedDifference -= 1;
      } else if (installedDifference < 0 && installedBySubItem[index] > 0) {
        installedBySubItem[index] -= 1;
        installedDifference += 1;
      }
      if (index === installedBySubItem.length - 1 && installedDifference !== 0) {
        index = -1;
      }
    }
  }

  return subItemTitles.map((title, index) => ({
    id: `${category.id}-${index}`,
    title,
    installed: installedBySubItem[index],
    total: totalBySubItem[index],
  }));
};

const SIDE_TOOLS: SideTool[] = [
  {
    id: "tasks",
    label: "Tasks",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M5 4H18V6H5V4Z" fill="#232729" />
        <path d="M5 9H18V11H5V9Z" fill="#232729" />
        <path d="M5 14H12V16H5V14Z" fill="#232729" />
        <path d="M15.59 13.58L13.5 15.67L12.41 14.58L11 16L13.5 18.5L17 15L15.59 13.58Z" fill="#232729" />
      </svg>
    ),
  },
  {
    id: "progress",
    label: "Progress",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <rect x="4" y="13" width="3" height="7" fill="#232729" />
        <rect x="10.5" y="9" width="3" height="11" fill="#232729" />
        <rect x="17" y="5" width="3" height="15" fill="#232729" />
        <path d="M3 20H21V22H3V20Z" fill="#232729" />
      </svg>
    ),
  },
  {
    id: "snapshot",
    label: "Snapshot",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M6 6H9V4H4V9H6V6Z" fill="#232729" />
        <path d="M18 6H15V4H20V9H18V6Z" fill="#232729" />
        <path d="M18 18H15V20H20V15H18V18Z" fill="#232729" />
        <path d="M6 18H9V20H4V15H6V18Z" fill="#232729" />
        <path d="M15.5 13V11H13V8.5H11V11H8.5V13H11V15.5H13V13H15.5Z" fill="#232729" />
      </svg>
    ),
  },
  {
    id: "pin",
    label: "Pin",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19 10.3636C19 6.29645 15.8663 3 12 3C8.13367 3 5 6.29645 5 10.3636C5 13.0743 7.33333 16.6203 12 21C16.6667 16.6203 19 13.0743 19 10.3636ZM12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
          fill="#232729"
        />
      </svg>
    ),
  },
  {
    id: "object-tree",
    label: "Object Tree",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M3 2H11V8H3V2Z" fill="#232729" />
        <path d="M13 8H21V14H13V8Z" fill="#232729" />
        <path d="M13 16H21V22H13V16Z" fill="#232729" />
        <path d="M6 7H8V20H6V7Z" fill="#232729" />
        <path d="M7 12V10L16 10V12H7Z" fill="#232729" />
        <path d="M7 20V18H16V20H7Z" fill="#232729" />
      </svg>
    ),
  },
  {
    id: "properties",
    label: "View Properties",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <path d="M8.5 4H19V6H8.5V4Z" fill="#232729" />
        <rect x="14" y="11" width="5" height="2" fill="#232729" />
        <rect x="9" y="18" width="10" height="2" fill="#232729" />
        <circle cx="21" cy="5" r="3" fill="#232729" />
        <circle cx="21" cy="12" r="3" fill="#232729" />
        <circle cx="21" cy="19" r="3" fill="#232729" />
        <path d="M8.5 11.5L2 7L8.5 3L15 7L8.5 11.5Z" fill="#232729" />
        <path d="M1 16V8L8 12.5V21L1 16Z" fill="#232729" />
        <path d="M9 21V12.5L16 8V16L9 21Z" fill="#232729" />
      </svg>
    ),
  },
  {
    id: "measure",
    label: "Measure",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <rect
          x="-1"
          y="1"
          width="13"
          height="13"
          transform="matrix(-1 0 0 1 20 7)"
          stroke="#232729"
          strokeWidth="2"
        />
        <rect
          x="-1"
          y="1"
          width="13"
          height="13"
          transform="matrix(-1 0 0 1 15 2)"
          stroke="#232729"
          strokeWidth="2"
        />
        <rect width="6" height="6" transform="matrix(-1 0 0 1 15 9)" fill="#232729" />
      </svg>
    ),
  },
];

export default function ViewerPage() {
  const router = useRouter();
  const latestCapture = CAPTURE_POINTS[CAPTURE_POINTS.length - 1];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const minimapFrameRef = useRef<HTMLDivElement | null>(null);
  const controlsRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<{ fov: number; updateProjectionMatrix: () => void } | null>(null);
  const updatePanoramaRef = useRef<((imagePath: string) => Promise<void>) | null>(null);
  const minimapHeadingRef = useRef(0);
  const activeCaptureImagePathRef = useRef(latestCapture.imagePath);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const panAnimationRef = useRef<PanAnimationState>({
    active: false,
    startTime: 0,
    durationMs: 700,
    fromYaw: 0,
    deltaYaw: 0,
    fromPitch: 0,
    toPitch: 0,
  });
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
  const [activeCaptureId, setActiveCaptureId] = useState(latestCapture.id);
  const [minimapHeadingDeg, setMinimapHeadingDeg] = useState(0);
  const [isMinimapFullscreen, setIsMinimapFullscreen] = useState(false);
  const [isToolbarNearBottom, setIsToolbarNearBottom] = useState(false);
  const [isToolbarHovered, setIsToolbarHovered] = useState(false);
  const [isBimCompareActive, setIsBimCompareActive] = useState(false);
  const [openPanel, setOpenPanel] = useState<"tasks" | "progress" | null>(null);
  const [selectedTask, setSelectedTask] = useState<CaptureTask | null>(null);
  const [progressSearchTerm, setProgressSearchTerm] = useState("");
  const [progressCaptureId, setProgressCaptureId] = useState(latestCapture.id);
  const [expandedProgressCategoryId, setExpandedProgressCategoryId] = useState<string | null>(
    PROGRESS_CATEGORIES[0]?.id ?? null
  );
  const [bimComparePose, setBimComparePose] = useState({
    headingDeg: 0,
    pitchDeg: 0,
    zoomPercent: Math.round(((95 - fovRef.current) / 60) * 100),
  });
  const activeCapture = CAPTURE_POINTS.find((point) => point.id === activeCaptureId) ?? latestCapture;
  const activeCaptureTasks = TASKS_BY_CAPTURE_ID[activeCapture.id] ?? TASKS_BY_CAPTURE_ID[latestCapture.id] ?? [];
  const activeCaptureTasksRef = useRef(activeCaptureTasks);
  const normalizedProgressSearchTerm = progressSearchTerm.trim().toLowerCase();
  const filteredProgressCategories = PROGRESS_CATEGORIES.filter((category) =>
    category.title.toLowerCase().includes(normalizedProgressSearchTerm)
  );
  const [taskPinPositions, setTaskPinPositions] = useState<TaskPinScreenPosition[]>([]);
  const activeCaptureIndex = CAPTURE_POINTS.findIndex((point) => point.id === activeCapture.id);
  const isFirstCapture = activeCaptureIndex <= 0;
  const isLastCapture = activeCaptureIndex >= CAPTURE_POINTS.length - 1;
  const isQuickToolbarOpen = isToolbarNearBottom || isToolbarHovered;
  const { headingDeg: bimHeadingDeg, pitchDeg: bimPitchDeg, zoomPercent: bimZoomPercent } = bimComparePose;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const rawCaptureId = router.query.captureId;
    const captureId = Array.isArray(rawCaptureId) ? rawCaptureId[0] : rawCaptureId;
    const rawPanel = router.query.panel;
    const panel = Array.isArray(rawPanel) ? rawPanel[0] : rawPanel;

    if (captureId) {
      const matchingCapture = CAPTURE_POINTS.find((point) => point.id === captureId);
      if (matchingCapture) {
        setActiveCaptureId(matchingCapture.id);
        setProgressCaptureId(matchingCapture.id);
      }
    }

    if (panel === "tasks" || panel === "progress") {
      setOpenPanel(panel);
    }
  }, [router.isReady, router.query.captureId, router.query.panel]);

  const normalizeAngle = (angle: number) => {
    const twoPi = Math.PI * 2;
    return ((((angle % twoPi) + twoPi) % twoPi) + Math.PI) % twoPi - Math.PI;
  };

  const getShortestAngleDelta = (fromAngle: number, toAngle: number) => {
    return normalizeAngle(toAngle - fromAngle);
  };

  const handleTaskPan = (task: CaptureTask) => {
    const fromYaw = yawRef.current;
    const fromPitch = pitchRef.current;
    // Align task pan target with the projected task-pin direction so
    // clicking a task (or its pin) brings that pin to the center.
    const toYaw = normalizeAngle(task.viewSpot.yaw + Math.PI);
    const toPitch = task.viewSpot.pitch;

    panAnimationRef.current = {
      active: true,
      startTime: performance.now(),
      durationMs: 700,
      fromYaw,
      deltaYaw: getShortestAngleDelta(fromYaw, toYaw),
      fromPitch,
      toPitch,
    };
    setIsPlaying(false);
    setIsToolbarNearBottom(false);
    setNavIndicator((previous) => (previous.visible ? { ...previous, visible: false } : previous));
  };

  const handleTaskSelect = (task: CaptureTask) => {
    setSelectedTask(task);
    handleTaskPan(task);
  };

  const handleTaskPinSelect = (task: CaptureTask) => {
    setOpenPanel("tasks");
    handleTaskSelect(task);
  };

  const handleTaskBackToList = () => {
    setSelectedTask(null);
  };

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    activeCaptureTasksRef.current = activeCaptureTasks;
  }, [activeCaptureTasks]);

  useEffect(() => {
    setTaskPinPositions([]);
    setSelectedTask(null);
  }, [activeCapture.id]);

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
      // Use the latest requested capture image to avoid stale initial loads
      // when route query params apply before Three.js finishes initializing.
      await loadPanoramaTexture(activeCaptureImagePathRef.current);
      if (disposed) {
        return;
      }

      const raycaster = new THREE.Raycaster();
      const pointerNdc = new THREE.Vector2();
      const taskDirection = new THREE.Vector3();
      const projectedPoint = new THREE.Vector3();
      const cameraForward = new THREE.Vector3();

      let isDragging = false;
      let lastX = 0;
      let lastY = 0;
      let yaw = yawRef.current;
      let pitch = pitchRef.current;

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
        panAnimationRef.current.active = false;
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
          yawRef.current = yaw;
          pitchRef.current = pitch;
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

      const getTaskPinPosition = (task: CaptureTask) => {
        const { yaw: taskYaw, pitch: taskPitch } = task.viewSpot;
        const cosPitch = Math.cos(taskPitch);
        taskDirection.set(Math.sin(taskYaw) * cosPitch, Math.sin(taskPitch), Math.cos(taskYaw) * cosPitch);

        if (cameraForward.dot(taskDirection) <= 0) {
          return null;
        }

        projectedPoint.copy(taskDirection).multiplyScalar(500).project(camera);
        if (projectedPoint.z < -1 || projectedPoint.z > 1) {
          return null;
        }

        const canvasWidth = renderer.domElement.clientWidth;
        const canvasHeight = renderer.domElement.clientHeight;
        const x = (projectedPoint.x * 0.5 + 0.5) * canvasWidth;
        const y = (-projectedPoint.y * 0.5 + 0.5) * canvasHeight;
        if (x < 0 || x > canvasWidth || y < 0 || y > canvasHeight) {
          return null;
        }

        return { x, y };
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

        const panAnimation = panAnimationRef.current;
        if (panAnimation.active) {
          const elapsedMs = performance.now() - panAnimation.startTime;
          const progress = Math.min(1, elapsedMs / panAnimation.durationMs);
          const easedProgress = 1 - Math.pow(1 - progress, 3);
          yaw = panAnimation.fromYaw + panAnimation.deltaYaw * easedProgress;
          pitch = panAnimation.fromPitch + (panAnimation.toPitch - panAnimation.fromPitch) * easedProgress;
          if (progress >= 1) {
            panAnimationRef.current.active = false;
          }
        } else if (isPlayingRef.current) {
          yaw += 0.0009;
        }

        pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, pitch));
        yawRef.current = yaw;
        pitchRef.current = pitch;

        camera.rotation.order = "YXZ";
        camera.rotation.y = yaw;
        camera.rotation.x = pitch;
        camera.getWorldDirection(cameraForward);

        const normalizedHeadingDeg = ((((yaw * 180) / Math.PI) % 360) + 360) % 360;
        if (Math.abs(normalizedHeadingDeg - minimapHeadingRef.current) > 0.35) {
          minimapHeadingRef.current = normalizedHeadingDeg;
          setMinimapHeadingDeg(normalizedHeadingDeg);
        }
        const nextPitchDeg = (pitch * 180) / Math.PI;
        const nextZoomPercent = Math.round(((95 - fovRef.current) / 60) * 100);
        setBimComparePose((previousPose) => {
          const headingChanged = Math.abs(previousPose.headingDeg - normalizedHeadingDeg) > 0.35;
          const pitchChanged = Math.abs(previousPose.pitchDeg - nextPitchDeg) > 0.35;
          const zoomChanged = previousPose.zoomPercent !== nextZoomPercent;
          if (!headingChanged && !pitchChanged && !zoomChanged) {
            return previousPose;
          }
          return {
            headingDeg: normalizedHeadingDeg,
            pitchDeg: nextPitchDeg,
            zoomPercent: nextZoomPercent,
          };
        });

        const nextPinPositions: TaskPinScreenPosition[] = [];
        for (const task of activeCaptureTasksRef.current) {
          const projectedPosition = getTaskPinPosition(task);
          if (!projectedPosition) {
            continue;
          }
          nextPinPositions.push({
            taskId: task.id,
            x: projectedPosition.x,
            y: projectedPosition.y,
          });
        }
        setTaskPinPositions((previousPinPositions) => {
          if (previousPinPositions.length !== nextPinPositions.length) {
            return nextPinPositions;
          }

          const hasChanged = previousPinPositions.some((previousPin, index) => {
            const nextPin = nextPinPositions[index];
            if (!nextPin || previousPin.taskId !== nextPin.taskId) {
              return true;
            }
            return Math.abs(previousPin.x - nextPin.x) > 0.75 || Math.abs(previousPin.y - nextPin.y) > 0.75;
          });

          return hasChanged ? nextPinPositions : previousPinPositions;
        });

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
    activeCaptureImagePathRef.current = activeCapture.imagePath;
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

  const handlePinNavigate = (targetCaptureId: string) => {
    setActiveCaptureId(targetCaptureId);
    setIsPlaying(false);
  };

  return (
    <>
      <TopNav />
      <main className="immersive-viewer" aria-label="Immersive jobsite viewer">
        <section className="immersive-viewer__stage" aria-label="3D viewer stage">
          <div
            className={`immersive-viewer__viewport${isBimCompareActive ? " immersive-viewer__viewport--compare" : ""}`}
          >
            <div className="immersive-viewer__viewport-pane immersive-viewer__viewport-pane--reality" ref={containerRef}>
              <span className="immersive-viewer__compare-pane-label">Reality Capture</span>
            <div className="immersive-viewer__top-row">
              <NextLink href="/" className="immersive-viewer__back-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.15686 12.8441L13.0018 16.824L11.7965 18L6 12L11.7965 6L13.0018 7.17598L9.15686 11.1559L18 11.1559V12.8441L9.15686 12.8441Z"
                    fill="#232729"
                  />
                </svg>
                <span>Back</span>
              </NextLink>
            </div>
            <aside className="immersive-viewer__side-tools" aria-label="Viewer side tools">
              {SIDE_TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  className={`immersive-viewer__side-tool-button${
                    (tool.id === "tasks" && openPanel === "tasks") || (tool.id === "progress" && openPanel === "progress")
                      ? " immersive-viewer__side-tool-button--active"
                      : ""
                  }`}
                  aria-label={tool.label}
                  data-tooltip={tool.label}
                  aria-expanded={tool.id === "tasks" || tool.id === "progress" ? openPanel === tool.id : undefined}
                  aria-controls={
                    tool.id === "tasks"
                      ? "immersive-viewer-tasks-panel"
                      : tool.id === "progress"
                        ? "immersive-viewer-progress-panel"
                        : undefined
                  }
                  onClick={() => {
                    const panelId: "tasks" | "progress" | null =
                      tool.id === "tasks" || tool.id === "progress" ? tool.id : null;
                    if (!panelId) {
                      return;
                    }
                    setOpenPanel((currentState) => {
                      const nextState: "tasks" | "progress" | null = currentState === panelId ? null : panelId;
                      if (nextState !== "tasks") {
                        setSelectedTask(null);
                      }
                      return nextState;
                    });
                  }}
                >
                  {tool.icon}
                </button>
              ))}
            </aside>
            {openPanel === "tasks" ? (
              <section
                id="immersive-viewer-tasks-panel"
                className="immersive-viewer__tasks-panel"
                aria-label={`In-progress tasks for ${activeCapture.label}`}
              >
                <header className="immersive-viewer__tasks-panel-header">
                  {selectedTask ? (
                    <div className="immersive-viewer__tasks-panel-action-row">
                      <button
                        type="button"
                        className="immersive-viewer__tasks-menu-button"
                        aria-label="Open task options"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                          <path
                            d="M7 12C7 13.1046 6.10457 14 5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12Z"
                            fill="#232729"
                          />
                          <path
                            d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                            fill="#232729"
                          />
                          <path
                            d="M21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z"
                            fill="#232729"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="immersive-viewer__tasks-done-button"
                        onClick={handleTaskBackToList}
                        aria-label="Close task detail"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                          <path
                            d="M14.3686 12.0003L21.0003 5.36856L18.6317 3L12 9.63169L5.36856 3.00025L3 5.36881L9.63144 12.0003L3 18.6317L5.36856 21.0003L12 14.3688L18.6317 21.0005L21.0003 18.6319L14.3686 12.0003Z"
                            fill="#232729"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : null}
                  <p className="immersive-viewer__tasks-panel-title">
                    {selectedTask ? selectedTask.title : "Tasks"}
                  </p>
                  <p className="immersive-viewer__tasks-panel-subtitle">
                    {activeCapture.label} | {activeCapture.captureDate}
                  </p>
                </header>
                {selectedTask ? (
                  <div className="immersive-viewer__task-detail">
                    <div className="immersive-viewer__task-detail-photos" aria-label="Task detail photos">
                      {TASK_DETAIL_PHOTO_PATHS.map((photoPath, photoIndex) => (
                        <div key={photoPath} className="immersive-viewer__task-detail-photo">
                          <img
                            src={photoPath}
                            alt={`${selectedTask.title} detail photo ${photoIndex + 1}`}
                            draggable={false}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Status</span>
                      <span className="immersive-viewer__task-status-pill">{selectedTask.status}</span>
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Number</span>
                      <p className="immersive-viewer__task-detail-value">{selectedTask.number}</p>
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Assignees</span>
                      <p className="immersive-viewer__task-detail-value">{selectedTask.assignees}</p>
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Due date</span>
                      <p className="immersive-viewer__task-detail-value">{selectedTask.dueDate}</p>
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Category</span>
                      <p className="immersive-viewer__task-detail-value">{selectedTask.category}</p>
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Distribution list</span>
                      <p className="immersive-viewer__task-detail-value">{selectedTask.distributionList}</p>
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Created by</span>
                      <p className="immersive-viewer__task-detail-value">{selectedTask.createdBy}</p>
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Created at</span>
                      <p className="immersive-viewer__task-detail-value">{selectedTask.createdAt}</p>
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Private</span>
                      <p className="immersive-viewer__task-detail-value">{selectedTask.private}</p>
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Origin</span>
                      <p className="immersive-viewer__task-detail-value">{selectedTask.origin}</p>
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Description</span>
                      <p className="immersive-viewer__task-detail-value">{selectedTask.description}</p>
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Discipline</span>
                      <p className="immersive-viewer__task-detail-value">{selectedTask.discipline}</p>
                    </div>
                    <div className="immersive-viewer__task-detail-row">
                      <span className="immersive-viewer__task-detail-label">Location</span>
                      <p className="immersive-viewer__task-detail-value">{selectedTask.location}</p>
                    </div>
                  </div>
                ) : (
                  <ul className="immersive-viewer__tasks-list">
                    {activeCaptureTasks.map((task) => (
                      <li key={task.id} className="immersive-viewer__tasks-list-item">
                        <button
                          type="button"
                          className="immersive-viewer__task-button"
                          onClick={() => {
                            handleTaskSelect(task);
                          }}
                        >
                          <div className="immersive-viewer__task-content">
                            <div className="immersive-viewer__task-top-row">
                              <p className="immersive-viewer__task-title">{task.title}</p>
                              <span className="immersive-viewer__task-status-pill">{task.status}</span>
                            </div>
                            <div className="immersive-viewer__task-bottom-row">
                              <p className="immersive-viewer__task-meta">
                                {task.discipline} | {task.location}
                              </p>
                              <span className="immersive-viewer__task-view-indicator" aria-hidden="true">
                                View
                              </span>
                            </div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ) : null}
            {openPanel === "progress" ? (
              <section id="immersive-viewer-progress-panel" className="immersive-viewer__progress-panel" aria-label="Trade progress">
                <header className="immersive-viewer__progress-panel-header">
                  <p className="immersive-viewer__tasks-panel-title">Progress</p>
                  <div className="immersive-viewer__progress-filter-row">
                    <label className="immersive-viewer__progress-search" htmlFor="progress-search-input">
                      <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M16.2554 14.1341C17.0406 12.9483 17.498 11.526 17.498 9.99805C17.498 5.85591 14.1402 2.49805 9.99805 2.49805C5.85591 2.49805 2.49805 5.85591 2.49805 9.99805C2.49805 14.1402 5.85591 17.498 9.99805 17.498C11.526 17.498 12.9483 17.0406 14.1341 16.2554L19.5878 21.7091L21.7091 19.5878L16.2554 14.1341ZM9.99805 14.498C12.4833 14.498 14.498 12.4833 14.498 9.99805C14.498 7.51277 12.4833 5.49805 9.99805 5.49805C7.51277 5.49805 5.49805 7.51277 5.49805 9.99805C5.49805 12.4833 7.51277 14.498 9.99805 14.498Z"
                          fill="#232729"
                        />
                      </svg>
                      <input
                        id="progress-search-input"
                        type="search"
                        value={progressSearchTerm}
                        onChange={(event) => {
                          setProgressSearchTerm(event.target.value);
                        }}
                        placeholder="Search trades"
                        aria-label="Search progress categories"
                      />
                    </label>
                    <div className="immersive-viewer__progress-date">
                      <select
                        id="progress-date-select"
                        value={progressCaptureId}
                        onChange={(event) => {
                          setProgressCaptureId(event.target.value);
                        }}
                      >
                        {CAPTURE_POINTS.map((capture) => (
                          <option key={capture.id} value={capture.id}>
                            {capture.label}
                          </option>
                        ))}
                      </select>
                      <span className="immersive-viewer__progress-date-chevron" aria-hidden="true">
                        <svg viewBox="0 0 24 24" focusable="false">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 17L5 9.83894L6.79759 8L12 13.3221L17.2024 8L19 9.83895L12 17Z"
                            fill="#232729"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </header>
                <ul className="immersive-viewer__progress-accordion-list">
                  {filteredProgressCategories.map((category) => {
                    const percentComplete = Math.round((category.installed / category.total) * 100);
                    const isProgressOnTrack = percentComplete >= 75;
                    const remaining = Math.max(category.total - category.installed, 0);
                    const installedText = category.unit
                      ? `${category.installed.toLocaleString()} ${category.unit}`
                      : category.installed.toLocaleString();
                    const totalText = category.unit
                      ? `${category.total.toLocaleString()} ${category.unit}`
                      : category.total.toLocaleString();
                    const remainingText = category.unit
                      ? `${remaining.toLocaleString()} ${category.unit} remaining`
                      : `${remaining.toLocaleString()} remaining`;
                    const isExpanded = expandedProgressCategoryId === category.id;
                    const subItems = buildProgressSubItems(category);

                    return (
                      <li key={category.id} className="immersive-viewer__progress-accordion-item">
                        <div className="immersive-viewer__progress-accordion-summary">
                          <button
                            type="button"
                            className="immersive-viewer__progress-accordion-trigger"
                            aria-expanded={isExpanded}
                            onClick={() => {
                              setExpandedProgressCategoryId((current) => (current === category.id ? null : category.id));
                            }}
                          >
                            <div className="immersive-viewer__progress-accordion-header">
                              <p className="immersive-viewer__progress-title">{category.title}</p>
                              <span
                                className={`immersive-viewer__progress-chevron${
                                  isExpanded ? " immersive-viewer__progress-chevron--expanded" : ""
                                }`}
                                aria-hidden="true"
                              >
                                <svg viewBox="0 0 24 24" focusable="false">
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M12 17L5 9.83894L6.79759 8L12 13.3221L17.2024 8L19 9.83895L12 17Z"
                                    fill="#232729"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div className="immersive-viewer__progress-bar-track" aria-hidden="true">
                              <span
                                className={`immersive-viewer__progress-bar-fill${
                                  isProgressOnTrack ? " immersive-viewer__progress-bar-fill--on-track" : ""
                                }`}
                                style={{ width: `${percentComplete}%` }}
                              />
                            </div>
                            <div className="immersive-viewer__progress-accordion-meta">
                              <div className="immersive-viewer__progress-meta-copy">
                                <span
                                  className={`immersive-viewer__progress-percent${
                                    isProgressOnTrack ? " immersive-viewer__progress-percent--on-track" : ""
                                  }`}
                                >
                                  {percentComplete}%
                                </span>
                                <p className="immersive-viewer__progress-quantity">
                                  <span>{installedText}</span> /{" "}
                                  <span className="immersive-viewer__progress-quantity-total">{totalText}</span>
                                </p>
                                <span className="immersive-viewer__progress-remaining-inline">{remainingText}</span>
                              </div>
                            </div>
                          </button>
                          <NextLink href="/scheduling" className="immersive-viewer__progress-schedule-link">
                            <span>View Schedule</span>
                            <span aria-hidden="true" className="immersive-viewer__progress-schedule-link-icon">
                              <svg viewBox="0 0 20 20" focusable="false">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M4 10C4 9.44772 4.44772 9 5 9H12.5858L10.2929 6.70711C9.90237 6.31658 9.90237 5.68342 10.2929 5.29289C10.6834 4.90237 11.3166 4.90237 11.7071 5.29289L15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071L11.7071 14.7071C11.3166 15.0976 10.6834 15.0976 10.2929 14.7071C9.90237 14.3166 9.90237 13.6834 10.2929 13.2929L12.5858 11H5C4.44772 11 4 10.5523 4 10Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                          </NextLink>
                        </div>
                        {isExpanded ? (
                          <div className="immersive-viewer__progress-accordion-body">
                            <ul className="immersive-viewer__progress-subitem-list">
                              {subItems.map((subItem) => {
                                const subItemPercentComplete = Math.round((subItem.installed / subItem.total) * 100);
                                const isSubItemOnTrack = subItemPercentComplete >= 75;
                                const subItemInstalledText = category.unit
                                  ? `${subItem.installed.toLocaleString()} ${category.unit}`
                                  : subItem.installed.toLocaleString();
                                const subItemTotalText = category.unit
                                  ? `${subItem.total.toLocaleString()} ${category.unit}`
                                  : subItem.total.toLocaleString();

                                return (
                                  <li key={subItem.id} className="immersive-viewer__progress-subitem">
                                    <div className="immersive-viewer__progress-subitem-header">
                                      <p className="immersive-viewer__progress-subitem-title">{subItem.title}</p>
                                    </div>
                                    <div className="immersive-viewer__progress-bar-track" aria-hidden="true">
                                      <span
                                        className={`immersive-viewer__progress-bar-fill${
                                          isSubItemOnTrack ? " immersive-viewer__progress-bar-fill--on-track" : ""
                                        }`}
                                        style={{ width: `${subItemPercentComplete}%` }}
                                      />
                                    </div>
                                    <div className="immersive-viewer__progress-meta-copy">
                                      <span
                                        className={`immersive-viewer__progress-percent${
                                          isSubItemOnTrack ? " immersive-viewer__progress-percent--on-track" : ""
                                        }`}
                                      >
                                        {subItemPercentComplete}%
                                      </span>
                                      <p className="immersive-viewer__progress-quantity">
                                        <span>{subItemInstalledText}</span> /{" "}
                                        <span className="immersive-viewer__progress-quantity-total">{subItemTotalText}</span>
                                      </p>
                                    </div>
                                    <NextLink href="/scheduling" className="immersive-viewer__progress-schedule-link">
                                      <span>View Schedule</span>
                                      <span aria-hidden="true" className="immersive-viewer__progress-schedule-link-icon">
                                        <svg viewBox="0 0 20 20" focusable="false">
                                          <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M4 10C4 9.44772 4.44772 9 5 9H12.5858L10.2929 6.70711C9.90237 6.31658 9.90237 5.68342 10.2929 5.29289C10.6834 4.90237 11.3166 4.90237 11.7071 5.29289L15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071L11.7071 14.7071C11.3166 15.0976 10.6834 15.0976 10.2929 14.7071C9.90237 14.3166 9.90237 13.6834 10.2929 13.2929L12.5858 11H5C4.44772 11 4 10.5523 4 10Z"
                                            fill="currentColor"
                                          />
                                        </svg>
                                      </span>
                                    </NextLink>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                  {filteredProgressCategories.length === 0 ? (
                    <li className="immersive-viewer__progress-empty-state">No progress categories match that search.</li>
                  ) : null}
                </ul>
              </section>
            ) : null}
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
                {activeCapture.id === latestCapture.id ? (
                  <button
                    type="button"
                    className="immersive-viewer__minimap-hotspot-pin"
                    aria-label="Open interior panorama"
                    onClick={() => {
                      handlePinNavigate("interior-detail-2026");
                    }}
                  >
                    <span className="immersive-viewer__minimap-hotspot-pin-dot" aria-hidden="true" />
                  </button>
                ) : null}
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
            <div className="immersive-viewer__task-pins-layer" aria-label="Task spot pins">
              {taskPinPositions.map((pin) => {
                const task = activeCaptureTasks.find((taskEntry) => taskEntry.id === pin.taskId);
                if (!task) {
                  return null;
                }
                return (
                  <button
                    key={pin.taskId}
                    type="button"
                    className="immersive-viewer__task-pin"
                    style={{ left: `${pin.x}px`, top: `${pin.y}px` }}
                    onClick={() => {
                      handleTaskPinSelect(task);
                    }}
                    aria-label={`View task spot: ${task.title}`}
                  >
                    <span className="immersive-viewer__task-pin-dot" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
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
                Layers
              </button>
              <button
                type="button"
                className={`immersive-viewer__quick-toolbar-button${
                  isBimCompareActive ? " immersive-viewer__quick-toolbar-button--active" : ""
                }`}
                onClick={() => {
                  setIsBimCompareActive((previous) => !previous);
                }}
                aria-pressed={isBimCompareActive}
              >
                BIM Compare
              </button>
            </div>
            {!isQuickToolbarOpen ? <div className="immersive-viewer__quick-toolbar-capsule" aria-hidden="true" /> : null}
            <div className="immersive-viewer__controls" aria-label="Viewer controls" ref={controlsRef}>
              <div className="immersive-viewer__control-buttons">
                <button
                  type="button"
                  className="immersive-viewer__control-button immersive-viewer__control-button--icon"
                  onClick={() => {
                    setIsPlaying((prev) => !prev);
                  }}
                  aria-pressed={isPlaying}
                  aria-label={isPlaying ? "Pause playback" : "Play playback"}
                >
                  {isPlaying ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
                      <rect x="3" y="2.5" width="3.5" height="11" rx="1" fill="currentColor" />
                      <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                      <path d="M7 20V4L19 12.5333L7 20Z" fill="currentColor" />
                    </svg>
                  )}
                </button>
                <button
                  type="button"
                  className="immersive-viewer__control-button immersive-viewer__control-button--icon"
                  onClick={() => {
                    handleZoom(-4);
                  }}
                  aria-label="Zoom in"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                    <path
                      d="M9.25842 6.99976H10.7584V9.23938H12.998V10.7394H10.7584V12.979H9.25842V10.7394H7.0188V9.23938H9.25842V6.99976Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.99805 16.998C11.5704 16.998 13.0216 16.4796 14.1902 15.6044L19.5878 21.002L21.002 19.5878L15.6044 14.1902C16.4796 13.0216 16.998 11.5704 16.998 9.99805C16.998 6.13205 13.864 2.99805 9.99805 2.99805C6.13205 2.99805 2.99805 6.13205 2.99805 9.99805C2.99805 13.864 6.13205 16.998 9.99805 16.998ZM9.99805 14.998C12.7595 14.998 14.998 12.7595 14.998 9.99805C14.998 7.23662 12.7595 4.99805 9.99805 4.99805C7.23662 4.99805 4.99805 7.23662 4.99805 9.99805C4.99805 12.7595 7.23662 14.998 9.99805 14.998Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="immersive-viewer__control-button immersive-viewer__control-button--icon"
                  onClick={() => {
                    handleZoom(4);
                  }}
                  aria-label="Zoom out"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                    <path d="M7.0188 9.23938V10.7394H12.998V9.23938H7.0188Z" fill="currentColor" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.99805 16.998C11.5704 16.998 13.0216 16.4796 14.1902 15.6044L19.5878 21.002L21.002 19.5878L15.6044 14.1902C16.4796 13.0216 16.998 11.5704 16.998 9.99805C16.998 6.13205 13.864 2.99805 9.99805 2.99805C6.13205 2.99805 2.99805 6.13205 2.99805 9.99805C2.99805 13.864 6.13205 16.998 9.99805 16.998ZM9.99805 14.998C12.7595 14.998 14.998 12.7595 14.998 9.99805C14.998 7.23662 12.7595 4.99805 9.99805 4.99805C7.23662 4.99805 4.99805 7.23662 4.99805 9.99805C4.99805 12.7595 7.23662 14.998 9.99805 14.998Z"
                      fill="currentColor"
                    />
                  </svg>
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
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <rect width="24" height="24" rx="4" fill="#D6DADC" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9.15686 12.8441L13.0018 16.824L11.7965 18L6 12L11.7965 6L13.0018 7.17598L9.15686 11.1559L18 11.1559V12.8441L9.15686 12.8441Z"
                        fill="#232729"
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
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <rect width="24" height="24" rx="4" fill="#D6DADC" />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.8431 11.1559L10.9982 7.17598L12.2035 6L18 12L12.2035 18L10.9982 16.824L14.8431 12.8441L6 12.8441V11.1559L14.8431 11.1559Z"
                        fill="#232729"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            </div>
            {isBimCompareActive ? (
              <aside className="immersive-viewer__viewport-pane immersive-viewer__viewport-pane--bim" aria-label="BIM compare view">
                <span className="immersive-viewer__compare-pane-label immersive-viewer__compare-pane-label--bim">BIM Model</span>
                <div className="immersive-viewer__bim-mock-stage" aria-hidden="true">
                  <div
                    className="immersive-viewer__bim-mock-grid"
                    style={{
                      transform: `rotate(${bimHeadingDeg}deg) scale(${1 + (bimZoomPercent / 100) * 0.22})`,
                    }}
                  />
                  <div
                    className="immersive-viewer__bim-mock-model"
                    style={{
                      transform: `translate(-50%, -50%) rotateY(${bimHeadingDeg}deg) rotateX(${bimPitchDeg * 0.25}deg)`,
                    }}
                  >
                    <span className="immersive-viewer__bim-mock-pipe immersive-viewer__bim-mock-pipe--green" />
                    <span className="immersive-viewer__bim-mock-pipe immersive-viewer__bim-mock-pipe--yellow" />
                    <span className="immersive-viewer__bim-mock-pipe immersive-viewer__bim-mock-pipe--blue" />
                  </div>
                  <div className="immersive-viewer__bim-mock-hud">
                    <span>{`Heading ${Math.round(bimHeadingDeg)}°`}</span>
                    <span>{`Pitch ${Math.round(bimPitchDeg)}°`}</span>
                    <span>{`Zoom ${bimZoomPercent}%`}</span>
                  </div>
                  <div className="immersive-viewer__bim-mock-tie-indicator">Linked to Reality Capture</div>
                </div>
              </aside>
            ) : null}
          </div>
        </section>
      </main>
    </>
  );
}
