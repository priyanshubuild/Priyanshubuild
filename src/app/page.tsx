import About from "@/components/About";
import ContactSection from "@/components/ContactSection";
import Container from "@/components/Container";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";
import SectionHeading from "@/components/SectionHeading";
import SkillSection from "@/components/SkillsSection/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection/Experience";
import InitialLoadShell from "@/components/InitialLoadShell";
import GithubActivityCard from "@/components/GithubActivityCard";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  PERSON_ID,
  WEBSITE_ID,
  serializeJSONLD,
} from "@/lib/site";

const page = () => {
  return (
    <InitialLoadShell>
      <Container>
        <div className="w-full md:px-8">
          <div className="bg-[#09090B] text-white">
            <Navbar />
            <main id="main-content">
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: serializeJSONLD({
                    "@context": "https://schema.org",
                    "@type": "ProfilePage",
                    "@id": `${SITE_URL}/#profile`,
                    url: SITE_URL,
                    name: SITE_TITLE,
                    description: SITE_DESCRIPTION,
                    inLanguage: "en",
                    isPartOf: { "@id": WEBSITE_ID },
                    mainEntity: {
                      "@type": "Person",
                      "@id": PERSON_ID,
                      name: SITE_NAME,
                    },
                  }),
                }}
              />
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
    </InitialLoadShell>
  );
};

export default page;
