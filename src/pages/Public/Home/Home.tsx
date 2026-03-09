import PublicLayout from "@/layouts/PublicLayout";

import Hero from "@/components/public/Hero";
import Features from "@/components/public/Features";
import About from "@/components/public/About";
import HowItWorks from "@/components/public/HowItWorks";
import DownloadApp from "@/components/public/DownloadApp";
import Contact from "@/components/public/Contact";

const Home = () => {
  return (
    <PublicLayout>
      <Hero />
      <Features />
      <About />
      <HowItWorks />
      <DownloadApp />
      <Contact />
    </PublicLayout>
  );
};

export default Home;