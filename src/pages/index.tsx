import dynamic from "next/dynamic";
import TopNav from "@/components/TopNav";

const HomeContent = dynamic(() => import("@/components/HomeContent"), {
  ssr: false,
  loading: () => <p style={{ padding: 40 }}>Loading...</p>,
});

const ProjectHeader = dynamic(() => import("@/components/ProjectHeader"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <TopNav />
      <ProjectHeader />
      <HomeContent />
    </>
  );
}
