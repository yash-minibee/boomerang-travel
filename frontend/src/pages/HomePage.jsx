import { useEffect } from "react";
import HeroSection from "../sections/HeroSection";
import PopularDestinations from "../sections/PopularDestinations";
import ContinentPackages from "../sections/ContinentPackages";
import WhyChooseUs from "../sections/WhyChooseUs";
import Testimonials from "../sections/Testimonials";
import Newsletter from "../sections/Newsletter";

export default function HomePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <HeroSection />
      <ContinentPackages />
      <PopularDestinations />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
