import { useMemo, useState } from "react";
import { SchedulingGrid } from "@/components/scheduling/SchedulingGrid";
import { SchedulingHeader } from "@/components/scheduling/SchedulingHeader";
import { SchedulingToolbar } from "@/components/scheduling/SchedulingToolbar";
import styles from "@/components/scheduling/SchedulingWorkspace.module.css";

const defaultExpandedGroups = ["doors", "masonry", "drywall", "mechanical"];

export function SchedulingWorkspace() {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const expandedGroups = useMemo(
    () => defaultExpandedGroups.filter((group) => !collapsedGroups.has(group)),
    [collapsedGroups]
  );

  const handleToggleGroup = (groupId: string) => {
    setCollapsedGroups((previous) => {
      const next = new Set(previous);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  return (
    <main className={styles.workspace}>
      <SchedulingHeader />
      <div className={styles.mainFrame}>
        <section className={styles.canvas}>
          <SchedulingToolbar />
          <SchedulingGrid collapsedGroups={collapsedGroups} onToggleGroup={handleToggleGroup} />
          <footer className={styles.footer}>
            <button className={styles.addActivityButton} type="button">
              + Add Activity Below
            </button>
            <span className={styles.footerCount}>{expandedGroups.length} groups visible</span>
          </footer>
        </section>
      </div>
    </main>
  );
}
