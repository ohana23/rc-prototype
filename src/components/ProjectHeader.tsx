import { Button } from "@procore/core-react";

export default function ProjectHeader() {
  return (
    <section className="project-header" aria-label="Project header">
      <div className="project-header__top-row">
        <h1 className="project-header__title">
          <span className="project-header__title-icon" aria-hidden="true">
            <svg viewBox="0 0 20 20" role="img" focusable="false">
              <path d="M2 18V5.2C2 4.54 2.54 4 3.2 4H11v14H2Zm10 0V2.2c0-.66.54-1.2 1.2-1.2h3.6c.66 0 1.2.54 1.2 1.2V18h-6Z" />
              <path d="M5 7h2v2H5V7Zm0 4h2v2H5v-2Zm3-4h2v2H8V7Zm0 4h2v2H8v-2Zm6-6h2v2h-2V5Zm0 4h2v2h-2V9Zm0 4h2v2h-2v-2Z" />
            </svg>
          </span>
          Seattle Corridor Railway
        </h1>

        <div className="project-header__quick-create-control">
          <Button variant="primary" className="project-header__quick-create-trigger" type="button">
            Quick Create
            <span className="project-header__quick-create-caret" aria-hidden="true">
              &#9662;
            </span>
          </Button>
          <select className="project-header__quick-create-native" aria-label="Quick create options" defaultValue="quick-create">
            <option value="quick-create">Quick Create</option>
            <option value="inspection">Inspection</option>
            <option value="observation">Observation</option>
            <option value="rfi">RFI</option>
          </select>
        </div>
      </div>

      <div className="project-header__tabs" role="tablist" aria-label="Project sections">
        <button type="button" className="project-header__tab project-header__tab--active" role="tab" aria-selected="true">
          Overview
        </button>
      </div>
    </section>
  );
}
