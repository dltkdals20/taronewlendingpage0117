import { useState } from "react";
import { motion } from "motion/react";
import StockDisplay from "./StockDisplay";
import ApplicationModal from "./ApplicationModal";

export default function HeroSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stockRefreshTrigger, setStockRefreshTrigger] = useState(0);
    const [immediateStock, setImmediateStock] = useState<number | null>(null);

    return (
        <div className="relative w-full flex flex-col items-center pt-8 md:pt-20 pb-2 text-center z-10 box-border px-4">
            {/* Main Heading */}
            <div className="relative z-10 mb-8">


                <h1 className="text-2xl min-[400px]:text-3xl md:text-5xl font-black leading-snug md:leading-snug text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#ffdf20] drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] mb-6 break-keep px-2">
                    2026년 나의 재물과<br className="md:hidden" /> 운의 흐름은?<br />
                    직접 뽑고 타로마스터에게 해석 받기
                </h1>

                {/* Decorative Stars around heading */}
                <span className="absolute -top-4 -right-4 md:-right-12 text-3xl md:text-5xl animate-pulse">⭐</span>
                <span className="absolute bottom-4 -left-4 md:-left-12 text-3xl md:text-5xl animate-pulse delay-100">✨</span>
            </div>

            {/* Price Section */}
            <div className="w-full max-w-md mx-auto mb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#e9d4ff]/60 rounded-xl p-5 md:p-6 border-2 border-[#ffd700] w-full relative"
                >
                    {/* Badge */}
                    <div className="absolute top-0 right-0 bg-[#ff4500] text-white text-xs md:text-sm font-bold px-4 py-1 rounded-bl-xl">
                        60% OFF
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#ffd700] to-[#ffdf20] drop-shadow-sm">비대면 상품</span>
                    </div>

                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl md:text-6xl font-black text-[#59168b] tracking-tight">10,000</span>
                        <span className="text-xl md:text-2xl text-slate-700 font-bold pb-1">원</span>
                    </div>
                </motion.div>
            </div>

            {/* Stock Alert Section */}
            <div className="w-full max-w-md mx-auto mb-4">
                <StockDisplay refreshTrigger={stockRefreshTrigger} immediateStock={immediateStock} />
            </div>

            {/* Primary CTA Button */}
            <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full max-w-md bg-[#3c0366] from-[#9810fa] text-white text-2xl font-bold py-5 rounded-2xl shadow-lg hover:shadow-purple-900/30 transition-shadow mb-4"
            >
                신청하기
            </motion.button>

            <ApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onStockDecreased={(newStock) => {
                    if (newStock !== null && newStock !== undefined) {
                        setImmediateStock(newStock);
                    }
                    setStockRefreshTrigger(prev => prev + 1);
                }}
            />
        </div>
    );
}
