import { useState } from "react";
import { motion } from "motion/react";
import CountdownTimer from "./CountdownTimer";
import ApplicationModal from "./ApplicationModal";

export default function PricingSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-full bg-white py-24 px-4 flex flex-col items-center">
            <div className="max-w-4xl w-full text-center">
                <h2 className="text-4xl font-black text-slate-900 mb-6">
                    2026년 당신의 운세,<br />
                    <span className="text-[#8200db]">지금 바로 확인하세요</span>
                </h2>

                <div className="flex flex-col items-center gap-10 mt-12">
                    <CountdownTimer />

                    <div className="flex flex-col items-center gap-2">
                        <div className="text-slate-400 text-xl font-medium line-through decoration-slate-400/50">
                            25,000원
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-[#8200db]">10,000</span>
                            <span className="text-2xl font-bold text-slate-600">원</span>
                        </div>
                    </div>

                    <motion.button
                        onClick={() => setIsModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full max-w-md bg-[#3c0366] text-white text-2xl font-bold py-6 rounded-2xl shadow-lg hover:shadow-purple-900/30 transition-shadow"
                    >
                        신청하기
                    </motion.button>
                </div>

                <ApplicationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </div>
    );
}
