import React from "react";
import NavBar from "../Navbar";
import HeroSection from "../sections/HeroSection";
import HowItWorksSection from "../sections/HowItWorksSection";
import FeaturesSection from "../sections/FeaturesSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import CTASection from "../sections/CTASection";


function landingPage () {
    return (
        <>
            <NavBar />
            <HeroSection />
            <HowItWorksSection />
            <FeaturesSection />
            <TestimonialsSection />
            <CTASection />
      </>
    )
}

export default landingPage;