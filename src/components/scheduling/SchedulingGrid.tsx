import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import NextLink from "next/link";
import styles from "@/components/scheduling/SchedulingWorkspace.module.css";
import { scheduleGroups, scheduleRows, scheduleYears } from "@/components/scheduling/mockData";
import type { ScheduleStatus } from "@/components/scheduling/types";

const timelineStartYear = scheduleYears[0];
const timelineEndYear = scheduleYears[scheduleYears.length - 1] + 1;
const timelineRange = timelineEndYear - timelineStartYear;
const todayMarkerYear = 2026.0;
const defaultTablePaneWidth = 468;
const minTablePaneWidth = 340;
const minTimelinePaneWidth = 360;

type SchedulingGridProps = {
  collapsedGroups: Set<string>;
  onToggleGroup: (groupId: string) => void;
};

const statusLabelMap: Record<ScheduleStatus, string> = {
  verify: "VERIFY",
  "on-track": "ON TRACK",
  "late-to-start": "LATE TO START",
};

const statusClassMap: Record<ScheduleStatus, string> = {
  verify: styles.statusVerify,
  "on-track": styles.statusOnTrack,
  "late-to-start": styles.statusLateToStart,
};
const actualVsPlanOverrides: Record<string, number> = {
  "block-brick": 70,
};
const additionalOverPlanActivityIds = new Set(["doors-slabs", "grouting"]);
const payWorkflowActivityIds = new Set(["doors-slabs", "new-activity"]);
const interiorViewerHref = "/viewer?captureId=interior-detail-2026&panel=progress";

function getActualVsPlannedValue(activityId: string) {
  if (actualVsPlanOverrides[activityId] !== undefined) {
    return actualVsPlanOverrides[activityId];
  }

  const hash = activityId.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
  if (hash % 7 === 0 || additionalOverPlanActivityIds.has(activityId)) {
    return 101 + (hash % 18);
  }
  return 50 + (hash % 41);
}

function getGroupAggregatePercent(activityPercents: number[]) {
  if (!activityPercents.length) {
    return 0;
  }

  const total = activityPercents.reduce((sum, percent) => sum + percent, 0);
  return Math.round(total / activityPercents.length);
}

function ViewerLinkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.22559 6.16667L12.0146 1.5L20.8037 6.16667L12.0146 11.4167L3.22559 6.16667Z" fill="#232729" />
      <path d="M2.63965 7.33333V17.8333L11.3896 22.5L11.4287 12.5833L2.63965 7.33333Z" fill="#232729" />
      <path d="M12.6396 22.5L21.3896 17.8333V7.33333L12.6006 12.5833L12.6396 22.5Z" fill="#232729" />
    </svg>
  );
}

export function SchedulingGrid({ collapsedGroups, onToggleGroup }: SchedulingGridProps) {
  const [tablePaneWidth, setTablePaneWidth] = useState(defaultTablePaneWidth);
  const [isResizing, setIsResizing] = useState(false);
  const gridWrapRef = useRef<HTMLElement | null>(null);
  const dragStateRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const maxTablePaneWidth = Math.max(
    minTablePaneWidth,
    (gridWrapRef.current?.clientWidth ?? defaultTablePaneWidth + minTimelinePaneWidth) - minTimelinePaneWidth
  );

  const clampTablePaneWidth = useMemo(
    () => (nextWidth: number) => {
      const containerWidth = gridWrapRef.current?.clientWidth ?? defaultTablePaneWidth + minTimelinePaneWidth;
      const maxTablePaneWidth = Math.max(minTablePaneWidth, containerWidth - minTimelinePaneWidth);
      return Math.min(Math.max(nextWidth, minTablePaneWidth), maxTablePaneWidth);
    },
    []
  );

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!dragStateRef.current) {
        return;
      }

      const nextWidth = dragStateRef.current.startWidth + (event.clientX - dragStateRef.current.startX);
      setTablePaneWidth(clampTablePaneWidth(nextWidth));
    };

    const stopResizing = () => {
      setIsResizing(false);
      dragStateRef.current = null;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopResizing);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [clampTablePaneWidth, isResizing]);

  const handleResizeStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    dragStateRef.current = {
      startX: event.clientX,
      startWidth: tablePaneWidth,
    };
    setIsResizing(true);
  };

  const handleResizeKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowLeft" ? -1 : 1;
    const step = event.shiftKey ? 24 : 12;
    setTablePaneWidth((previousWidth) => clampTablePaneWidth(previousWidth + direction * step));
  };

  const handleInitiatePay = (itemLabel: string) => {
    window.alert(`Initiate Pay workflow started for ${itemLabel}.`);
  };

  return (
    <section
      ref={gridWrapRef}
      className={styles.gridWrap}
      style={
        {
          "--table-pane-width": `${tablePaneWidth}px`,
        } as CSSProperties
      }
    >
      <div className={styles.gridHeader}>
        <div className={styles.tableHeader}>
          <span>Name</span>
          <span>% Complete</span>
          <span>Actual vs Planned</span>
          <span>Status</span>
        </div>
        <div className={styles.timelineHeader}>
          {scheduleYears.map((year) => (
            <span key={year} className={styles.timelineHeaderYear}>
              {year}
            </span>
          ))}
        </div>
      </div>
      <div
        aria-label="Resize table columns"
        aria-orientation="vertical"
        aria-valuemax={Math.round(maxTablePaneWidth)}
        aria-valuemin={minTablePaneWidth}
        aria-valuenow={Math.round(tablePaneWidth)}
        className={`${styles.columnResizeHandle} ${isResizing ? styles.columnResizeHandleActive : ""}`}
        onKeyDown={handleResizeKeyDown}
        onPointerDown={handleResizeStart}
        role="separator"
        tabIndex={0}
      />

      <div className={styles.gridBody}>
        {scheduleGroups.map((group) => {
          const isCollapsed = collapsedGroups.has(group.id);
          const groupRows = scheduleRows.filter((row) => row.groupId === group.id).sort((a, b) => a.order - b.order);
          const visibleRows = isCollapsed ? [] : groupRows;
          const groupPercentComplete = getGroupAggregatePercent(groupRows.map((row) => row.percentComplete));
          const canInitiateGroupPay = groupPercentComplete >= 100;
          const isGroupComplete = groupPercentComplete >= 100;
          const calculatedGroupActualVsPlan = getGroupAggregatePercent(
            groupRows.map((row) => getActualVsPlannedValue(row.id))
          );
          const groupActualVsPlan = group.id === "masonry" ? 73 : calculatedGroupActualVsPlan;

          return (
            <div key={group.id} className={styles.groupSection}>
              <div className={styles.gridRow}>
                <div className={`${styles.tableRow} ${styles.tableRowGroup}`}>
                  <div className={styles.groupNameCell}>
                    <button className={styles.expandButton} type="button" onClick={() => onToggleGroup(group.id)}>
                      {isCollapsed ? "▸" : "▾"}
                    </button>
                    <span className={styles.groupLabel}>{group.label}</span>
                    <span className={styles.groupCount}>{groupRows.length}</span>
                  </div>
                  <span className={styles.percentCell}>
                    <span className={`${styles.percentText} ${isGroupComplete ? styles.percentTextComplete : ""}`}>
                      {groupPercentComplete}%
                    </span>
                    {canInitiateGroupPay ? (
                      <button
                        type="button"
                        className={styles.initiatePayButton}
                        onClick={() => {
                          handleInitiatePay(group.label);
                        }}
                      >
                        Initiate Pay
                      </button>
                    ) : null}
                  </span>
                  <span className={styles.actualVsPlanCell}>
                    <span className={styles.actualVsPlanMainRow}>
                      <span
                        className={`${styles.actualVsPlanText} ${groupActualVsPlan >= 100 ? styles.actualVsPlanOverPlan : ""}`}
                      >
                        {groupActualVsPlan}% to plan
                      </span>
                      <NextLink
                        href={interiorViewerHref}
                        className={styles.actualVsPlanViewerLink}
                        aria-label="Open interior 360 capture"
                      >
                        <ViewerLinkIcon />
                      </NextLink>
                    </span>
                  </span>
                  <span aria-hidden="true" />
                </div>
                <div className={`${styles.timelineRow} ${styles.timelineRowGroup}`} />
              </div>

              {visibleRows.map((row) => {
                const actualVsPlanned = getActualVsPlannedValue(row.id);
                const canInitiateRowPay = row.percentComplete >= 100;
                const isRowComplete = row.percentComplete >= 100;
                const isPayWorkflowRow = payWorkflowActivityIds.has(row.id);

                return (
                  <div className={styles.gridRow} key={row.id}>
                    <div className={styles.tableRow}>
                      <div className={styles.activityNameCell}>
                        <span className={styles.activityBullet}>•</span>
                        <span className={styles.activityName}>{row.label}</span>
                      </div>
                      <span className={styles.percentCell}>
                        <span className={`${styles.percentText} ${isRowComplete ? styles.percentTextComplete : ""}`}>
                          {row.percentComplete}%
                        </span>
                        {canInitiateRowPay && !isPayWorkflowRow ? (
                          <button
                            type="button"
                            className={styles.initiatePayButton}
                            onClick={() => {
                              handleInitiatePay(row.label);
                            }}
                          >
                            Initiate Pay
                          </button>
                        ) : null}
                      </span>
                      <span className={styles.actualVsPlanCell}>
                        <span className={styles.actualVsPlanMainRow}>
                          {isPayWorkflowRow ? (
                            <span className={styles.actualVsPlanCheckIcon} aria-label="Ahead of plan">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M21 6.04008L9.80083 20L3 14.22L4.94265 11.7536L9.39042 15.5338L18.6433 4L21 6.04008Z"
                                  fill="currentColor"
                                />
                              </svg>
                            </span>
                          ) : (
                            <span
                              className={`${styles.actualVsPlanText} ${actualVsPlanned >= 100 ? styles.actualVsPlanOverPlan : ""}`}
                            >
                              {actualVsPlanned}% to plan
                            </span>
                          )}
                          <NextLink
                            href={interiorViewerHref}
                            className={styles.actualVsPlanViewerLink}
                            aria-label="Open interior 360 capture"
                          >
                            <ViewerLinkIcon />
                          </NextLink>
                        </span>
                      </span>
                      {isPayWorkflowRow ? (
                        <button
                          type="button"
                          className={`${styles.initiatePayButton} ${styles.statusInitiatePayButton}`}
                          onClick={() => {
                            handleInitiatePay(row.label);
                          }}
                        >
                          Initiate Pay
                        </button>
                      ) : (
                        <span className={`${styles.statusPill} ${statusClassMap[row.status!]}`}>
                          {statusLabelMap[row.status!]}
                        </span>
                      )}
                    </div>
                    <div className={styles.timelineRow}>
                      {row.bars.map((bar) => {
                        const left = ((bar.startYear - timelineStartYear) / timelineRange) * 100;
                        const width = ((bar.endYear - bar.startYear) / timelineRange) * 100;
                        return (
                          <div
                            key={bar.id}
                            className={`${styles.timelineBar} ${styles[`timelineBar${bar.color}`]}`}
                            style={{ left: `${left}%`, width: `${width}%` }}
                            title={row.label}
                          >
                            {bar.label ? <span className={styles.timelineBarLabel}>{bar.label}</span> : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        <div
          className={styles.todayMarker}
          style={
            {
              "--today-offset": ((todayMarkerYear - timelineStartYear) / timelineRange).toString(),
            } as CSSProperties
          }
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
