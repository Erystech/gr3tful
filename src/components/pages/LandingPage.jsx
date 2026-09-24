import React from "react";
import MobileNavbar from "../MobileNavbar";
import HeroSection from "../sections/HeroSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import FeaturesSection from "../sections/FeaturesSection";
import CTASection from "../sections/CTASection";
import Footer from "../layout/Footer";


function LandingPage () {
    return (
        <>
            <MobileNavbar 
              showLinks={true}
              showCTA = {true}/>
            <HeroSection />
            <HowItWorksSection />
            <FeaturesSection />
            <CTASection />
            <Footer />
      </>
    )
}

export default LandingPage;
