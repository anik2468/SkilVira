import Hero from "../../components/home/Hero";
import TrustedCompanies from "../../components/home/TrustedCompanies";
import FeaturedInternships from "../../components/home/FeaturedInternships";
import PopularCategories from "../../components/home/PopularCategories";
import WhySkilvira from "../../components/home/WhySkilvira";
import HowitWorks from "../../components/home/HowitWorks";
const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <TrustedCompanies />
      <PopularCategories />
      <FeaturedInternships />
      <WhySkilvira />
      <HowitWorks />
    </div>
  );
};

export default Home;