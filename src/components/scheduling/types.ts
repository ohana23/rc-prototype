export type ScheduleStatus = "verify" | "on-track" | "late-to-start";

export type ScheduleBar = {
  id: string;
  label?: string;
  startYear: number;
  endYear: number;
  color: "blue" | "green" | "brown" | "slate";
};

export type ScheduleRow = {
  id: string;
  label: string;
  percentComplete: number;
  status?: ScheduleStatus;
  groupId: string;
  level: 0 | 1;
  order: number;
  bars: ScheduleBar[];
};

export type ScheduleGroup = {
  id: string;
  label: string;
};
