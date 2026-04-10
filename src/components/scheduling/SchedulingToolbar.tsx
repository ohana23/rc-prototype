import styles from "@/components/scheduling/SchedulingWorkspace.module.css";

export function SchedulingToolbar() {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <input className={styles.searchInput} value="Search" readOnly aria-label="Search" />
        <button className={`${styles.toolButton} ${styles.toolButtonIconOnly}`} type="button" aria-label="Find">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.2554 14.1341C17.0406 12.9483 17.498 11.526 17.498 9.99805C17.498 5.85591 14.1402 2.49805 9.99805 2.49805C5.85591 2.49805 2.49805 5.85591 2.49805 9.99805C2.49805 14.1402 5.85591 17.498 9.99805 17.498C11.526 17.498 12.9483 17.0406 14.1341 16.2554L19.5878 21.7091L21.7091 19.5878L16.2554 14.1341ZM9.99805 14.498C12.4833 14.498 14.498 12.4833 14.498 9.99805C14.498 7.51277 12.4833 5.49805 9.99805 5.49805C7.51277 5.49805 5.49805 7.51277 5.49805 9.99805C5.49805 12.4833 7.51277 14.498 9.99805 14.498Z"
              fill="#232729"
            />
          </svg>
        </button>
        <button className={`${styles.toolButton} ${styles.toolButtonIconOnly}`} type="button" aria-label="Sort up">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.7338 7.73529L4.76397 13.5026L3 11.6947L12 3L21 11.6947L19.236 13.5026L13.2662 7.73529L13.2662 21L10.7338 21L10.7338 7.73529Z"
              fill="#232729"
            />
          </svg>
        </button>
        <button className={`${styles.toolButton} ${styles.toolButtonIconOnly}`} type="button" aria-label="Sort down">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.2662 16.2647L19.236 10.4974L21 12.3053L12 21L3 12.3053L4.76397 10.4974L10.7338 16.2647L10.7338 3L13.2662 3L13.2662 16.2647Z"
              fill="#232729"
            />
          </svg>
        </button>
      </div>
      <div className={styles.toolbarRight}>
        <button className={`${styles.toolButton} ${styles.toolButtonZoom}`} type="button" aria-label="Zoom in">
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
        <button className={`${styles.toolButton} ${styles.toolButtonZoom}`} type="button" aria-label="Zoom out">
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
        <button className={styles.todayButton} type="button">
          Today
        </button>
        <button className={`${styles.toolButton} ${styles.toolButtonIconOnly}`} type="button" aria-label="Calendar">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M5.89429 11H8.72727V13.75H5.89429V11Z" fill="#232729" />
            <path d="M8.72727 15H6V17.75H8.72727V15Z" fill="#232729" />
            <path d="M13.3636 11H10.5307V13.75H13.3636V11Z" fill="#232729" />
            <path d="M13.3636 15H10.5307V17.75H13.3636V15Z" fill="#232729" />
            <path d="M18 11H15.167V13.75H18V11Z" fill="#232729" />
            <path d="M18 15H15.167V17.75H18V15Z" fill="#232729" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 2.5C6 2.22386 6.22386 2 6.5 2H9C9.27614 2 9.5 2.22386 9.5 2.5V4H14.5V2.5C14.5 2.22386 14.7239 2 15 2H17.5C17.7761 2 18 2.22386 18 2.5V4H21C21.5523 4 22 4.44772 22 5V21C22 21.5523 21.5523 22 21 22H3C2.44772 22 2 21.5523 2 21V5C2 4.44772 2.44772 4 3 4H6V2.5ZM19.5 9.25H4.5V19.5H19.5V9.25Z"
              fill="#232729"
            />
          </svg>
        </button>
        <button className={styles.actionButton} type="button">
          Import
        </button>
        <button className={styles.actionButton} type="button">
          Export
        </button>
      </div>
    </div>
  );
}
