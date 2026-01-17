import { motion } from "motion/react";
import { useState } from "react";
import ApplicationModal from "./ApplicationModal";

export default function InfoSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const keywords = [
        { icon: "💰", text: "금전" },
        { icon: "❤️", text: "연애" },
        { icon: "🎓", text: "학업" },
        { icon: "🏥", text: "건강" },
        { icon: "🤝", text: "대인" },
        { icon: "💼", text: "취업" },
    ];

    return (
        <div className="w-full bg-white flex flex-col items-center py-20 px-4">
            <div className="max-w-4xl w-full text-center">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                    올해 당신을 빛나게 할<br />
                    <span className="text-[#8200db]">행운 키워드 13가지</span> ✨
                </h2>

                <p className="text-slate-600 text-lg mb-12">
                    나의 올해 행운 키워드는? 지금 바로 13장의 타로 카드를 뽑아 확인해보세요.
                </p>

                {/* Keywords Grid Preview */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
                    {keywords.map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-purple-50 rounded-xl p-4 flex flex-col items-center justify-center border border-purple-100 shadow-sm"
                        >
                            <span className="text-4xl mb-2">{item.icon}</span>
                            <span className="font-bold text-slate-700">{item.text}</span>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="relative w-full max-w-2xl mx-auto mt-10">
                    <motion.button
                        onClick={() => setIsModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-gradient-to-r from-[#59168b] to-[#8200db] text-white text-2xl md:text-4xl font-black py-8 rounded-full shadow-[0_20px_50px_-12px_rgba(89,22,139,0.5)] border-4 border-[#ad46ff]"
                    >
                        신청하기
                    </motion.button>
                    <p className="mt-6 text-2xl font-bold text-slate-800">
                        지금 바로 신청하세요!
                    </p>
                </div>
            </div>

            <ApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
