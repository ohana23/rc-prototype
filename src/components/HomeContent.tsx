import NextLink from "next/link";
import { Button, Card, Link as ProcoreLink, Typography } from "@procore/core-react";

export default function HomeContent() {
  return (
    <main className="overview-cards" aria-label="Project overview cards">
      <section className="overview-cards__row overview-cards__row--hero" aria-label="3D jobsite experience">
        <Card className="overview-card overview-card--jobsite-experience">
          <header className="overview-card__header">
            <Typography as="h2" intent="h3" weight="semibold" className="overview-card__title">
              3D Jobsite Experience
            </Typography>
          </header>
          <div className="overview-card__body overview-card__body--jobsite-experience">
            <div className="jobsite-experience__copy">
              <Typography as="p" intent="h2" weight="semibold" className="jobsite-experience__headline">
                Explore a photo-realistic 360 capture of the jobsite
              </Typography>
              <Typography as="p" intent="body" className="jobsite-experience__description">
                Move beyond BIM-only views with immersive 3D walkthroughs, a timeline to compare site progress over time, and
                field-ready context to review what changed across each capture.
              </Typography>
            </div>
            <div className="jobsite-experience__actions">
              <NextLink href="/viewer" className="jobsite-experience__cta">
                Open 3D Jobsite Experience
              </NextLink>
            </div>
          </div>
        </Card>
      </section>

      <section className="overview-cards__row overview-cards__row--top" aria-label="Top overview row">
        <Card className="overview-card overview-card--project-info">
          <header className="overview-card__header">
            <Typography as="h2" intent="h3" weight="semibold" className="overview-card__title">
              Project Information
            </Typography>
            <div className="overview-card__header-actions">
              <button type="button" className="overview-action overview-action--notes">
                + Notes
              </button>
              <button type="button" className="overview-action overview-action--icon" aria-label="More actions">
                <span aria-hidden="true">&#8942;</span>
              </button>
            </div>
          </header>

          <div className="overview-card__body">
            <div className="project-identity">
              <div className="project-identity__icon" aria-hidden="true">
                <svg viewBox="0 0 20 20" role="img" focusable="false">
                  <path d="M2 18V5.2C2 4.54 2.54 4 3.2 4H11v14H2Zm10 0V2.2c0-.66.54-1.2 1.2-1.2h3.6c.66 0 1.2.54 1.2 1.2V18h-6Z" />
                  <path d="M5 7h2v2H5V7Zm0 4h2v2H5v-2Zm3-4h2v2H8V7Zm0 4h2v2H8v-2Zm6-6h2v2h-2V5Zm0 4h2v2h-2V9Zm0 4h2v2h-2v-2Z" />
                </svg>
              </div>
              <div className="project-identity__copy">
                <Typography as="p" intent="h3" weight="semibold" className="project-identity__title">
                  Seattle Corridor Railway
                </Typography>
                <ProcoreLink href="https://www.example.com" target="_blank" rel="noreferrer">
                  US
                </ProcoreLink>
              </div>
            </div>

            <div className="project-identity__divider" />

            <div className="project-metadata">
              <div className="project-metadata__item">
                <Typography as="p" intent="small" className="project-metadata__label">
                  Stage
                </Typography>
                <Typography as="p" intent="body" weight="semibold" className="project-metadata__value">
                  Course of Construction
                </Typography>
              </div>
              <div className="project-metadata__item">
                <Typography as="p" intent="small" className="project-metadata__label">
                  Type
                </Typography>
                <Typography as="p" intent="body" weight="semibold" className="project-metadata__value">
                  --
                </Typography>
              </div>
              <div className="project-metadata__item">
                <Typography as="p" intent="small" className="project-metadata__label">
                  Region
                </Typography>
                <Typography as="p" intent="body" weight="semibold" className="project-metadata__value">
                  --
                </Typography>
              </div>
              <div className="project-metadata__item">
                <Typography as="p" intent="small" className="project-metadata__label">
                  Square Footage
                </Typography>
                <Typography as="p" intent="body" weight="semibold" className="project-metadata__value">
                  --
                </Typography>
              </div>
            </div>
          </div>
        </Card>

        <Card className="overview-card overview-card--project-links">
          <header className="overview-card__header">
            <Typography as="h2" intent="h3" weight="semibold" className="overview-card__title">
              Project Links
            </Typography>
            <div className="overview-card__header-actions">
              <button type="button" className="overview-action overview-action--icon" aria-label="Add link">
                <span aria-hidden="true">+</span>
              </button>
              <button type="button" className="overview-action overview-action--view-all">
                View all
              </button>
              <button type="button" className="overview-action overview-action--icon" aria-label="More project links actions">
                <span aria-hidden="true">&#8942;</span>
              </button>
            </div>
          </header>

          <div className="overview-card__body overview-card__body--links">
            {["New Relic", "googler", "test", "abc", "mmmmm"].map((item) => (
              <div className="project-links__row" key={item}>
                <ProcoreLink href="https://www.example.com" target="_blank" rel="noreferrer">
                  {item}
                </ProcoreLink>
                <span className="project-links__external" aria-hidden="true">
                  &#8599;
                </span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="overview-cards__row overview-cards__row--bottom" aria-label="Bottom overview row">
        <Card className="overview-card overview-card--project-message">
          <header className="overview-card__header">
            <Typography as="h2" intent="h3" weight="semibold" className="overview-card__title">
              Project Message
            </Typography>
          </header>
          <div className="overview-card__body">
            <Typography as="p" intent="body" weight="semibold" className="project-message__text">
              It&apos;s tempting to do it all. But &quot;doing it all&quot; is as
              impossible as it is impractical, particularly when you&apos;re building products. It&apos;s not just people who
              can lose focus - products can too.
            </Typography>
          </div>
        </Card>

        <Card className="overview-card overview-card--project-dates">
          <header className="overview-card__header">
            <Typography as="h2" intent="h3" weight="semibold" className="overview-card__title">
              Project Dates
            </Typography>
            <button type="button" className="overview-action overview-action--icon" aria-label="Project dates info">
              <span aria-hidden="true">i</span>
            </button>
          </header>
          <div className="overview-card__body overview-card__body--dates">
            <Typography as="h3" intent="h2" weight="semibold" className="project-dates__title">
              Define Your Project Dates
            </Typography>
            <Typography as="p" intent="body" className="project-dates__description">
              Project dates help keep track of important stages and achievements. Once added, project dates can be displayed on
              the project timeline.
            </Typography>
            <Button variant="secondary" size="sm" type="button">
              Edit Project Dates
            </Button>
          </div>
        </Card>
      </section>
    </main>
  );
}
