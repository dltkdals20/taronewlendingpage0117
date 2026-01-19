import HeroSection from "../desktop/components/HeroSection";
import InfoSection from "../desktop/components/InfoSection";
import StepsSection from "../desktop/components/StepsSection";
import DetailsSection from "../desktop/components/DetailsSection";
import QuestionSection from "../desktop/components/QuestionSection";
import InterpretationSection from "../desktop/components/InterpretationSection";
import ReviewsSection from "../desktop/components/ReviewsSection";
import PricingSection from "../desktop/components/PricingSection";

export default function MobileApp() {
    return (
        <div className="w-full min-h-screen bg-white">
            {/* Top Dark Section */}
            <div className="relative w-full bg-[#59168b] overflow-hidden pb-10 md:pb-32">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#59168b] via-[#6e11b0] to-[#59168b]" />

                {/* Background Pattern - Stars */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-4 text-2xl text-[#dab2ff]">✨</div>
                    <div className="absolute top-40 right-10 text-xl text-[#dab2ff]">⭐</div>
                    <div className="absolute bottom-40 left-1/4 text-2xl text-[#dab2ff]">✦</div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <HeroSection />
                </div>
            </div>

            {/* Middle Sections */}
            <InfoSection />
            <StepsSection />
            <DetailsSection />
            <QuestionSection />
            <InterpretationSection />
            <ReviewsSection />
            <PricingSection />

            {/* Final Call to Action area */}
            <div className="bg-slate-900 py-8 text-center text-white/50 text-xs">
                © 2026 New Year Tarot. All rights reserved.
            </div>
        </div>
    );
}
