import { useEffect } from "react";
import HeroSection from "../sections/HeroSection";
import PopularDestinations from "../sections/PopularDestinations";
import FeaturedPackages from "../sections/FeaturedPackages";
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
      <PopularDestinations />
      <FeaturedPackages />
      <WhyChooseUs />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
