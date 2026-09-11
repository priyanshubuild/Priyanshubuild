import dynamic from "next/dynamic";
import About from "@/components/About";
import ContactSection from "@/components/ContactSection";
import Container from "@/components/Container";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";
import SectionHeading from "@/components/SectionHeading";
import SkillSection from "@/components/SkillsSection/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection/Experience";
import LoadingScreen from "@/components/InitialLoadShell";

const GithubActivityCard = dynamic(
  () => import("@/components/GithubActivityCard"),
  {
    loading: () => (
      <div className="px-[3%] py-10">
        <div className="h-44 w-full animate-pulse rounded-2xl bg-[#0e0e10]/60 border border-white/5" />
      </div>
    ),
  }
);

const page = () => {
  return (
    <LoadingScreen>
      <Container>
        <div className="w-full md:px-8">
          <div className="text-white bg-[#09090B]">
            <Navbar />
            <main id="main-content">
              <section id="hero" data-section-label="Hero section">
                <HeroSection />
              </section>
              <section id="projects" data-section-label="Projects section">
                <SectionHeading title="Projects" />
                <ProjectsSection />
              </section>
              <section id="experience" data-section-label="Experience section">
                <SectionHeading title="Experience" />
                <ExperienceSection />
              </section>
              <section id="skills" data-section-label="Skills section">
                <SectionHeading title="Skills" />
                <SkillSection />
              </section>
              <section id="github" data-section-label="Github section">
                <SectionHeading title="Github Activity" />
                <GithubActivityCard />
              </section>
              <section id="about" data-section-label="About section">
                <SectionHeading title="About Me" />
                <About />
              </section>
            </main>
            <footer id="contact" data-section-label="Contact section">
              <ContactSection />
            </footer>
          </div>
        </div>
      </Container>
    </LoadingScreen>
  );
};

export default page;