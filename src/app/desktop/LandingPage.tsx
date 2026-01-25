import HeroSection from "./components/HeroSection";
import InfoSection from "./components/InfoSection";
import StepsSection from "./components/StepsSection";
import DetailsSection from "./components/DetailsSection";
import QuestionSection from "./components/QuestionSection";
import InterpretationSection from "./components/InterpretationSection";
import ReviewsSection from "./components/ReviewsSection";
import PricingSection from "./components/PricingSection";

export default function LandingPage() {
    return (
        <div className="w-full min-h-screen bg-white">
            {/* Top Dark Section */}
            <div className="relative w-full bg-[#59168b] overflow-hidden pb-32">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#59168b] via-[#6e11b0] to-[#59168b]" />

                {/* Background Pattern - Stars */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 text-4xl text-[#dab2ff]">✨</div>
                    <div className="absolute top-40 right-20 text-2xl text-[#dab2ff]">⭐</div>
                    <div className="absolute bottom-40 left-1/4 text-3xl text-[#dab2ff]">✦</div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <HeroSection />
                </div>

                {/* Curved bottom transition (optional, keeping it simple for now) */}
            </div>

            {/* Middle Sections */}
            {/* Middle Sections */}
            <StepsSection />
            <InfoSection />
            <DetailsSection />
            <QuestionSection />
            <InterpretationSection />
            <ReviewsSection />
            <PricingSection />

            {/* Final Call to Action area */}
            <div className="bg-slate-900 py-12 text-center text-white/50 text-sm">
                © 2026 New Year Tarot. All rights reserved.
            </div>
        </div>
    );
}
