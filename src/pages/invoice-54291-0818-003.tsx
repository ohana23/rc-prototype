import TopNav from "@/components/TopNav";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const scheduleRows = [
  {
    itemNumber: "1",
    budgetCode: "04-050.L",
    description: "Brickwork",
    lineItemType: "SOV",
    scheduledValue: "$120,000.00",
    completedFromPrevious: "$60,000.00",
    completedFromPreviousPercent: "50.0%",
    thisPeriod: "$0.00",
    comparison: "60%",
  },
  {
    itemNumber: "2",
    budgetCode: "04-400.L",
    description: "Stonework",
    lineItemType: "SOV",
    scheduledValue: "$180,000.00",
    completedFromPrevious: "$36,000.00",
    completedFromPreviousPercent: "20.0%",
    thisPeriod: "$0.00",
    comparison: "42%",
  },
];

export default function Invoice542910818003Page() {
  const [isScheduleTearSheetOpen, setIsScheduleTearSheetOpen] = useState(false);
  const [floorVisualView, setFloorVisualView] = useState<"drawing" | "map">("drawing");
  const [selectedLevel, setSelectedLevel] = useState("third-floor");
  const [selectedLocation, setSelectedLocation] = useState("main-concourse");
  const router = useRouter();
  const isLockerRoomThirdFloor =
    selectedLevel === "third-floor" && selectedLocation === "main-locker-room";

  useEffect(() => {
    if (!isScheduleTearSheetOpen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsScheduleTearSheetOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isScheduleTearSheetOpen]);

  return (
    <>
      <TopNav />
      <main className="invoice-detail-page">
        <header className="invoice-detail-header">
          <div className="invoice-detail-header__crumbs">
            <span>Invoicing</span>
            <span aria-hidden="true">›</span>
            <span>Invoice #54291-0818-003</span>
          </div>
          <div className="invoice-detail-header__title-row">
            <h1>Invoice #54291-0818-003</h1>
            <div className="invoice-detail-header__actions">
              <button className="invoicing-btn invoicing-btn--secondary">Export</button>
              <button className="invoicing-btn invoicing-btn--secondary">Create Invoice</button>
              <button className="invoice-detail-header__kebab-button" aria-label="More actions">
                ⋮
              </button>
            </div>
          </div>
          <nav className="invoice-detail-tabs" aria-label="Invoice detail sections">
            <button className="invoice-detail-tabs__tab invoice-detail-tabs__tab--active">General</button>
            <button className="invoice-detail-tabs__tab">Payment Requirements</button>
            <button className="invoice-detail-tabs__tab">Holds</button>
            <button className="invoice-detail-tabs__tab">Lien Rights</button>
            <button className="invoice-detail-tabs__tab">Compliance</button>
            <button className="invoice-detail-tabs__tab">Change History</button>
            <button className="invoice-detail-tabs__tab">Emails</button>
          </nav>
        </header>

        <section className="invoice-detail-summary">
          <article className="invoice-detail-card">
            <div className="invoice-detail-card__heading-row">
              <h2>General Information</h2>
              <button className="invoice-detail-card__edit">Edit</button>
            </div>
            <p className="invoice-detail-card__meta">Created by Manu Phatak (Manu Masonry) on June 19, 2020 at 3:22 PM PT</p>
            <div className="invoice-detail-grid">
              <div>
                <p className="invoice-detail-grid__label">Contract Company</p>
                <p className="invoice-detail-grid__value">Manu Masonry</p>
              </div>
              <div>
                <p className="invoice-detail-grid__label">Invoice #</p>
                <p className="invoice-detail-grid__value">54291-0818-003</p>
              </div>
              <div>
                <p className="invoice-detail-grid__label">Status</p>
                <p className="invoice-detail-grid__value">
                  <span className="invoicing-row-pill invoicing-row-pill--review">In Review</span>
                </p>
              </div>
              <div>
                <p className="invoice-detail-grid__label">Invoice Type</p>
                <p className="invoice-detail-grid__value">Work and Materials</p>
              </div>
              <div>
                <p className="invoice-detail-grid__label">Billing Period</p>
                <p className="invoice-detail-grid__value">3/1/26 - 3/31/26</p>
              </div>
              <div>
                <p className="invoice-detail-grid__label">Billing Date</p>
                <p className="invoice-detail-grid__value">3/25/2026</p>
              </div>
              <div>
                <p className="invoice-detail-grid__label">Period Start</p>
                <p className="invoice-detail-grid__value">3/1/2026</p>
              </div>
              <div>
                <p className="invoice-detail-grid__label">Period End</p>
                <p className="invoice-detail-grid__value">3/31/2026</p>
              </div>
            </div>
          </article>

          <article className="invoice-detail-card invoice-detail-card--right">
            <div className="invoice-detail-card__heading-row">
              <h2>Payment Details</h2>
              <button className="invoice-detail-card__edit">Edit</button>
            </div>
            <div className="invoice-detail-grid invoice-detail-grid--payment">
              <div>
                <p className="invoice-detail-grid__label">Payment Due Date</p>
                <p className="invoice-detail-grid__value">--</p>
              </div>
              <div>
                <p className="invoice-detail-grid__label">Payment Status</p>
                <p className="invoice-detail-grid__value">
                  <span className="invoicing-row-pill invoicing-row-pill--muted">Unpaid</span>
                </p>
              </div>
              <div>
                <p className="invoice-detail-grid__label">Payment Date</p>
                <p className="invoice-detail-grid__value">--</p>
              </div>
            </div>
          </article>
        </section>

        <section className="invoice-detail-sov">
          <div className="invoice-detail-sov__header">
            <h2>Schedule of Values</h2>
          </div>
          <div className="invoice-detail-sov__toolbar">
            <label className="invoicing-search">
              <input type="search" placeholder="Search" />
            </label>
            <div className="invoicing-grid__toolbar-right">
              <button className="invoicing-select-btn">Select a column to group</button>
              <button className="invoicing-toolbar-btn">Configure</button>
            </div>
          </div>
          <div className="invoice-detail-sov__table-wrap">
            <table className="invoice-detail-sov__table">
              <thead>
                <tr>
                  <th>Item Number</th>
                  <th>Budget Code</th>
                  <th>Description of Work</th>
                  <th>Line Item Type</th>
                  <th>Scheduled Value</th>
                  <th>Work Completed From Previous Application ($)</th>
                  <th>Work Completed From Previous Application (%)</th>
                  <th>This Period</th>
                  <th className="invoice-detail-sov__sticky-comparison">Schedule Comparison</th>
                  <th className="invoice-detail-sov__sticky-response">Response</th>
                </tr>
              </thead>
              <tbody>
                {scheduleRows.map((row) => (
                  <tr key={row.itemNumber}>
                    <td>{row.itemNumber}</td>
                    <td>{row.budgetCode}</td>
                    <td>{row.description}</td>
                    <td>{row.lineItemType}</td>
                    <td>{row.scheduledValue}</td>
                    <td>{row.completedFromPrevious}</td>
                    <td>{row.completedFromPreviousPercent}</td>
                    <td>{row.thisPeriod}</td>
                    <td className="invoice-detail-sov__comparison invoice-detail-sov__sticky-comparison">
                      <span className="invoice-detail-sov__comparison-content">
                        {(() => {
                          const isTearSheetTrigger = row.comparison === "60%";

                          return (
                            <>
                              <span
                                className={`invoice-detail-sov__comparison-dot ${
                                  isTearSheetTrigger
                                    ? "invoice-detail-sov__comparison-dot--warning"
                                    : "invoice-detail-sov__comparison-dot--success"
                                }`}
                                aria-hidden="true"
                              />
                              <span
                                className={`invoice-detail-sov__comparison-link${
                                  isTearSheetTrigger ? "" : " invoice-detail-sov__comparison-link--static"
                                }`}
                                onClick={() => {
                                  if (isTearSheetTrigger) {
                                    setIsScheduleTearSheetOpen(true);
                                  }
                                }}
                                role={isTearSheetTrigger ? "button" : undefined}
                                tabIndex={isTearSheetTrigger ? 0 : undefined}
                                onKeyDown={(event) => {
                                  if (
                                    isTearSheetTrigger &&
                                    (event.key === "Enter" || event.key === " ")
                                  ) {
                                    event.preventDefault();
                                    setIsScheduleTearSheetOpen(true);
                                  }
                                }}
                              >
                                {row.comparison}
                              </span>
                            </>
                          );
                        })()}
                        {row.comparison === "60%" ? (
                          <svg
                            className="invoice-detail-sov__comparison-warning"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.00183 1.54642C7.46411 0.817859 8.60915 0.817861 9.07143 1.54642L15.335 13.3437C15.8009 14.0779 15.2248 15 14.3002 15H1.6998C0.775197 15 0.199117 14.0779 0.664996 13.3437L7.00183 1.54642ZM9.25 12.25C9.25 12.9404 8.69036 13.5 8 13.5C7.30964 13.5 6.75 12.9404 6.75 12.25C6.75 11.5596 7.30964 11 8 11C8.69036 11 9.25 11.5596 9.25 12.25ZM9 5H7V9.5H9V5Z"
                              fill="#BD910F"
                            />
                          </svg>
                        ) : null}
                      </span>
                    </td>
                    <td className="invoice-detail-sov__response invoice-detail-sov__sticky-response">
                      <span className="invoice-detail-sov__response-content">
                        <button className="invoice-detail-sov__response-action" aria-label="Approve line item">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="4" fill="#E8F7E9" />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M18 8.02674L10.5339 17.3334L6 13.48L7.2951 11.8358L10.2603 14.3559L16.4288 6.66669L18 8.02674Z"
                              fill="#26732D"
                            />
                          </svg>
                        </button>
                        <button className="invoice-detail-sov__response-action" aria-label="Reject line item">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="4" fill="#FAE5E5" />
                            <path
                              d="M13.579 12.0002L18.0002 7.57904L16.4211 6L12 10.4211L7.57904 6.00017L6 7.57921L10.421 12.0002L6 16.4211L7.57904 18.0002L12 13.5792L16.4211 18.0003L18.0002 16.4213L13.579 12.0002Z"
                              fill="#D92626"
                            />
                          </svg>
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      {isScheduleTearSheetOpen ? (
        <div className="schedule-tear-sheet" role="dialog" aria-modal="true" aria-label="Schedule completion details">
          <button
            className="schedule-tear-sheet__backdrop"
            type="button"
            aria-label="Close schedule completion details"
            onClick={() => setIsScheduleTearSheetOpen(false)}
          />
          <aside className="schedule-tear-sheet__panel">
            <button
              className="schedule-tear-sheet__close"
              type="button"
              aria-label="Close tear sheet"
              onClick={() => setIsScheduleTearSheetOpen(false)}
            >
              ×
            </button>
            <div className="schedule-tear-sheet__content">
              <header className="schedule-tear-sheet__header">
                <h2>Schedule Completion</h2>
                <button
                  className="schedule-tear-sheet__full-schedule-btn"
                  type="button"
                  onClick={() => router.push("/scheduling")}
                >
                  See Full Schedule
                </button>
              </header>

              <section className="schedule-tear-sheet__card">
                <h3>Brickwork</h3>
                <p className="schedule-tear-sheet__completion">60% Complete</p>
                <p className="schedule-tear-sheet__warning">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.00183 1.54642C7.46411 0.817859 8.60915 0.817861 9.07143 1.54642L15.335 13.3437C15.8009 14.0779 15.2248 15 14.3002 15H1.6998C0.775197 15 0.199117 14.0779 0.664996 13.3437L7.00183 1.54642ZM9.25 12.25C9.25 12.9404 8.69036 13.5 8 13.5C7.30964 13.5 6.75 12.9404 6.75 12.25C6.75 11.5596 7.30964 11 8 11C8.69036 11 9.25 11.5596 9.25 12.25ZM9 5H7V9.5H9V5Z"
                      fill="#BD910F"
                    />
                  </svg>{" "}
                  70% completed and stored to date on invoice
                </p>

                <div className="schedule-tear-sheet__meta">
                  <div>
                    <span className="schedule-tear-sheet__meta-label">Scheduling Status</span>
                    <span className="schedule-tear-sheet__status">Underway</span>
                  </div>
                  <div>
                    <span className="schedule-tear-sheet__meta-label">Start</span>
                    <span className="schedule-tear-sheet__meta-value">02 / 05 / 2026</span>
                  </div>
                  <div>
                    <span className="schedule-tear-sheet__meta-label">Finish</span>
                    <span className="schedule-tear-sheet__meta-value">05 / 30 / 2026</span>
                  </div>
                </div>

                <div className="schedule-tear-sheet__timeline">
                  <div className="schedule-tear-sheet__timeline-header">
                    <span />
                    <span>Feb 2026</span>
                    <span>Mar 2026</span>
                  </div>
                  <div className="schedule-tear-sheet__timeline-row">
                    <span>Brickwork</span>
                    <div className="schedule-tear-sheet__bar schedule-tear-sheet__bar--brickwork">
                      <span className="schedule-tear-sheet__today-marker" />
                    </div>
                  </div>
                  <div className="schedule-tear-sheet__timeline-row">
                    <span>Stonework</span>
                    <div className="schedule-tear-sheet__bar schedule-tear-sheet__bar--stonework" />
                  </div>
                </div>
              </section>

              <section className="schedule-tear-sheet__card schedule-tear-sheet__visual-card">
                <div className="schedule-tear-sheet__visual-top-row">
                  <div className="schedule-tear-sheet__visual-selectors">
                    <label className="schedule-tear-sheet__field">
                      <span>Level</span>
                      <select value={selectedLevel} onChange={(event) => setSelectedLevel(event.target.value)}>
                        <option value="third-floor">Third Floor</option>
                        <option value="second-floor">Second Floor</option>
                        <option value="first-floor">First Floor</option>
                      </select>
                    </label>
                    <label className="schedule-tear-sheet__field">
                      <span>Location</span>
                      <select value={selectedLocation} onChange={(event) => setSelectedLocation(event.target.value)}>
                        <option value="main-concourse">Main Concourse</option>
                        <option value="north-stands">North Stands</option>
                        <option value="south-stands">South Stands</option>
                        <option value="east-gate-plaza">East Gate Plaza</option>
                        <option value="west-gate-plaza">West Gate Plaza</option>
                        <option value="field-level">Field Level</option>
                        <option value="press-box">Press Box</option>
                        <option value="main-locker-room">Main Locker Room</option>
                        <option value="visitors-locker-room">Visitors Locker Room</option>
                        <option value="equipment-storage">Equipment Storage</option>
                        <option value="loading-dock">Loading Dock</option>
                        <option value="concession-zone-a">Concession Zone A</option>
                        <option value="concession-zone-b">Concession Zone B</option>
                        <option value="mechanical-room">Mechanical Room</option>
                        <option value="roof-truss-section">Roof Truss Section</option>
                      </select>
                    </label>
                  </div>
                  <div
                    className="schedule-tear-sheet__view-toggle"
                    role="group"
                    aria-label="Floor visual mode"
                    data-view={floorVisualView}
                  >
                    <button
                      className={`schedule-tear-sheet__view-toggle-btn${
                        floorVisualView === "drawing" ? " schedule-tear-sheet__view-toggle-btn--active" : ""
                      }`}
                      type="button"
                      onClick={() => setFloorVisualView("drawing")}
                    >
                      Drawing
                    </button>
                    <button
                      className={`schedule-tear-sheet__view-toggle-btn${
                        floorVisualView === "map" ? " schedule-tear-sheet__view-toggle-btn--active" : ""
                      }`}
                      type="button"
                      onClick={() => setFloorVisualView("map")}
                    >
                      Map
                    </button>
                  </div>
                </div>

                <div className="schedule-tear-sheet__visual-canvas-wrap">
                  {selectedLocation === "main-locker-room" ? (
                    <button
                      type="button"
                      className="schedule-tear-sheet__capture-button"
                      onClick={() => {
                        void router.push({
                          pathname: "/viewer",
                          query: {
                            captureId: "sep-2026-locker-room",
                            panel: "progress",
                            progressCategory: "masonry",
                            progressSearch: "brickwork",
                          },
                        });
                      }}
                    >
                      View Last Reality Capture
                    </button>
                  ) : null}
                  <img
                    className={`schedule-tear-sheet__visual-image schedule-tear-sheet__visual-image--drawing${
                      floorVisualView === "drawing" && !isLockerRoomThirdFloor
                        ? " schedule-tear-sheet__visual-image--active"
                        : ""
                    }`}
                    src="/invoicing%20photos/third-floor-vortex.png"
                    alt="Third floor completion heatmap with annotated progress values by area."
                  />
                  <img
                    className={`schedule-tear-sheet__visual-image schedule-tear-sheet__visual-image--drawing${
                      floorVisualView === "drawing" && isLockerRoomThirdFloor
                        ? " schedule-tear-sheet__visual-image--active"
                        : ""
                    }`}
                    src="/invoicing%20photos/third-floor-vortex-locker-room.png"
                    alt="Third floor completion heatmap focused on the main locker room."
                  />
                  <img
                    className={`schedule-tear-sheet__visual-image schedule-tear-sheet__visual-image--map${
                      floorVisualView === "map" ? " schedule-tear-sheet__visual-image--active" : ""
                    }`}
                    src="/invoicing%20photos/third-floor-vortex-map.png"
                    alt="Third floor completion overlay mapped onto the jobsite aerial image."
                  />
                </div>
              </section>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
