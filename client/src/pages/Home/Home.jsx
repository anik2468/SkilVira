import Hero from "../../components/home/Hero";
import FeaturedInternships from "../../components/home/FeaturedInternships";
import PopularCategories from "../../components/home/PopularCategories";
import WhySkilvira from "../../components/home/WhySkilvira";
import HowItWorks from "../../components/home/HowItWorks";
import Testimonials from "../../components/home/Testimonials";
import FAQ from "../../components/home/FAQ";
import CTA from "../../components/home/CTA";


const Home = () => {

  return (

    <div className="min-h-screen bg-white">


      {/* Hero Section */}
      <Hero />



      {/* Categories */}
      <PopularCategories />



      {/* Featured Internships */}
      <FeaturedInternships />



      {/* Why SkilVira */}
      <WhySkilvira />



      {/* How It Works */}
      <HowItWorks />



      {/* Testimonials */}
      <Testimonials />



      {/* FAQ */}
      <FAQ />



      {/* Call To Action */}
      <CTA />


    </div>

  );

};


export default Home;