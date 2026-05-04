import NextLink from "next/link";
import Image from "next/image";
import { Card, Typography } from "@procore/core-react";

type ProjectMapAccessCardStatus = "available" | "coming-soon";

type ProjectMapAccessCardProps = {
  href?: string;
  title?: string;
  status?: ProjectMapAccessCardStatus;
};

export default function ProjectMapAccessCard({
  href,
  title = "Reality Capture",
  status = "available",
}: ProjectMapAccessCardProps) {
  const isAvailable = status === "available" && Boolean(href);

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

      <div className="project-map-card__expand" aria-hidden="true">
        ↗
      </div>
    </div>
  );

  const cardContent = (
    <>
      <header className="overview-card__header project-map-card__header">
        <Typography as="h2" intent="h3" weight="semibold" className="overview-card__title project-map-card__title">
          {title}
        </Typography>
        <div className="project-map-card__meta">
          <span className="project-map-card__meta-label">Field action view</span>
        </div>
      </header>
      {viewportContent}
    </>
  );

  if (isAvailable && href) {
    return (
      <NextLink href={href} className="overview-card overview-card--project-map project-map-card--clickable">
        {cardContent}
      </NextLink>
    );
  }

  return (
    <Card className="overview-card overview-card--project-map">
      {cardContent}
    </Card>
  );
}
