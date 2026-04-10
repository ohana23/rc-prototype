import NextLink from "next/link";
import Image from "next/image";
import { Card, Typography } from "@procore/core-react";

type ProjectMapAccessCardStatus = "available" | "coming-soon";

type ProjectMapAccessCardProps = {
  href?: string;
  title?: string;
  mappedItemsLabel?: string;
  currentTempLabel?: string;
  temperatureRangeLabel?: string;
  accessLabel?: string;
  status?: ProjectMapAccessCardStatus;
};

export default function ProjectMapAccessCard({
  href,
  title = "Project Visual",
  currentTempLabel = "87°F",
  temperatureRangeLabel = "91° | 64°",
  accessLabel = "Open 3D view",
  status = "available",
}: ProjectMapAccessCardProps) {
  const isAvailable = status === "available" && Boolean(href);
  const safeHref = href ?? "#";

  const viewportContent = (
    <div className="project-map-card__viewport">
      <Image
        className="project-map-card__panorama"
        src="/panoramas/project-map-preview-360-v2.png"
        alt="360 jobsite panorama preview"
        fill
        sizes="(max-width: 920px) 100vw, 1200px"
        quality={100}
        unoptimized
        draggable={false}
      />
      {isAvailable ? (
        <NextLink href={safeHref} className="project-map-card__viewport-link" aria-label={accessLabel} />
      ) : null}

      <div className="project-map-card__expand" aria-hidden="true">
        ↗
      </div>

    </div>
  );

  return (
    <Card className="overview-card overview-card--project-map">
      <header className="overview-card__header project-map-card__header">
        <Typography as="h2" intent="h3" weight="semibold" className="overview-card__title project-map-card__title">
          {title}
        </Typography>
        <div className="project-map-card__weather" aria-label="Current weather">
          <span className="project-map-card__weather-now">{currentTempLabel}</span>
          <span className="project-map-card__weather-range">{temperatureRangeLabel}</span>
        </div>
      </header>
      {viewportContent}
    </Card>
  );
}
