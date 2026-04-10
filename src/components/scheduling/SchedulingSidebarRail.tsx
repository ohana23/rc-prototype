import styles from "@/components/scheduling/SchedulingWorkspace.module.css";

const railIcons = ["☰", "⚖", "⌂", "⚑", "⇵"];

export function SchedulingSidebarRail() {
  return (
    <aside className={styles.sidebarRail} aria-label="Scheduling tools">
      {railIcons.map((icon, index) => (
        <button className={styles.railButton} type="button" key={`${icon}-${index}`} aria-label={`Tool ${index + 1}`}>
          {icon}
        </button>
      ))}
    </aside>
  );
}
