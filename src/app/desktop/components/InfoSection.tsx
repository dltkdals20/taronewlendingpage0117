import { motion } from "motion/react";
import { useState } from "react";
import ApplicationModal from "./ApplicationModal";
import TarotCards from "./TarotCards";

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

                <p className="text-slate-600 text-lg mb-8">
                    나의 올해 행운 키워드는? 지금 바로 13장의 타로 카드를 뽑아 확인해보세요.
                </p>

                <div className="w-full flex justify-center mt-16 -mb-20 md:mb-10">
                    <TarotCards className="scale-45 md:scale-75 origin-top" />
                </div>

                {/* Keywords Grid Preview */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
            </div>

            <ApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
