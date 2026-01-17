import { motion } from "motion/react";

export default function HeroSection() {
    return (
        <div className="relative w-full flex flex-col items-center pt-12 md:pt-20 pb-10 text-center z-10 box-border px-4">
            {/* Top Banner */}
            <div className="mb-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block bg-[#8200db]/30 rounded-full px-6 py-2 border border-[#dab2ff]/30 backdrop-blur-sm"
                >
                    <p className="text-[#e9d4ff] text-sm md:text-lg font-medium tracking-tight">
                        ✨ 2026년 행운의 타로 뽑기 ✨
                    </p>
                </motion.div>
            </div>

            {/* Main Heading */}
            <div className="relative z-10 mb-8">
                <h1 className="text-3xl md:text-[64px] font-black leading-[1.2] md:leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#ffdf20] drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] break-keep">
                    2026 병오년<br />
                    신년 운세 대박 타로 보기
                </h1>

                {/* Decorative Stars around heading */}
                <span className="absolute -top-4 -right-4 md:-right-12 text-3xl md:text-5xl animate-pulse">⭐</span>
                <span className="absolute bottom-4 -left-4 md:-left-12 text-3xl md:text-5xl animate-pulse delay-100">✨</span>
            </div>

            <p className="text-[#dab2ff] text-base md:text-xl font-medium tracking-wide mb-12 opacity-90 break-keep">
                푸른 뱀의 해, 당신의 운명을 확인하세요
            </p>
        </div>
    );
}
