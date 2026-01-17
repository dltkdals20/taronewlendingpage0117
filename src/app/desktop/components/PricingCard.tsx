import { motion } from "motion/react";
import { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import ApplicationModal from "./ApplicationModal";

export default function PricingCard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-[#fdf2f8] to-[#f3e8ff] p-6 md:p-10 rounded-3xl border-2 border-[#9810fa]/20 shadow-xl max-w-lg mx-auto relative overflow-hidden flex flex-col"
            >
                {/* Badge */}
                <div className="absolute top-0 right-0 bg-[#ff4500] text-white font-bold px-6 py-2 rounded-bl-2xl shadow-md z-10">
                    60% OFF
                </div>

                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 pr-28 break-keep order-1">
                    신년 타로 운세 대박 패키지
                </h3>

                <div className="order-4 md:order-2 w-full mb-6 md:mb-0">
                    <CountdownTimer />
                </div>

                <div className="flex flex-col items-center gap-2 mb-4 order-2 md:order-3">
                    <div className="text-slate-400 text-xl font-medium line-through decoration-slate-400/50">
                        25,000원
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-7xl md:text-6xl font-black text-[#8200db]">10,000</span>
                        <span className="text-2xl font-bold text-slate-600">원</span>
                    </div>
                </div>

                <ul className="text-left space-y-4 mb-6 order-3 md:order-4 max-w-xs mx-auto text-slate-600">
                    <li className="flex items-center gap-3">
                        <span className="text-[#9810fa]">✓</span> 13가지 행운 키워드
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-[#9810fa]">✓</span> 타로 마스터의 상세 해석
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-[#9810fa]">✓</span> 24시간 이내로 발송
                    </li>
                </ul>

                <motion.button
                    onClick={() => setIsModalOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-[#9810fa] to-[#8200db] text-white text-2xl font-bold py-5 rounded-2xl shadow-lg hover:shadow-purple-500/30 transition-shadow order-5"
                >
                    신청하기
                </motion.button>
            </motion.div>

            <ApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
