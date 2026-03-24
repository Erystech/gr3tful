import React from "react";
import MobileNavbar from "../MobileNavbar";
import HeroSection from "../sections/HeroSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import FeaturesSection from "../sections/FeaturesSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import CTASection from "../sections/CTASection";
import Footer from "../layout/Footer";


function LandingPage () {
    return (
        <>
            <MobileNavbar 
              showLinks={true}/>
            <HeroSection />
            <HowItWorksSection />
            <FeaturesSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
      </>
    )
}

export default LandingPage;