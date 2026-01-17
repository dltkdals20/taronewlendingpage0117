import { motion } from "motion/react";
import interpretationPreviewImg from '../../../assets/interpretation_preview.png';

const TarotPickAnimation = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Card 1 - Left */}
            <motion.div
                className="absolute w-20 h-32 bg-[#312c85] rounded-md border border-[#ad46ff]/50 shadow-sm"
                style={{ transformOrigin: "bottom center" }}
                animate={{ rotate: -15, x: -20, y: 10 }}
            />
            {/* Card 3 - Right */}
            <motion.div
                className="absolute w-20 h-32 bg-[#312c85] rounded-md border border-[#ad46ff]/50 shadow-sm"
                style={{ transformOrigin: "bottom center" }}
                animate={{ rotate: 15, x: 20, y: 10 }}
            />
            {/* Card 2 - Center (Picking Animation) */}
            <motion.div
                className="absolute w-20 h-32 bg-gradient-to-br from-[#59168b] to-[#312c85] rounded-md border border-[#ffd700] shadow-md z-10 flex items-center justify-center"
                animate={{ y: [0, -25, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="text-lg">✨</div>
            </motion.div>
        </div>
    );
};

const LetterSendAnimation = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
                className="relative w-32 h-24 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-purple-100 flex items-center justify-center overflow-hidden"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white/50" />
                <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 text-[#9810fa]/80 relative z-10" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>

                {/* Badge */}
                <motion.div
                    className="absolute bottom-2 right-2 bg-[#9810fa] text-white p-1.5 rounded-full shadow-md z-20"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default function StepsSection() {
    const steps = [
        {
            step: "01",
            title: "내가 직접 뽑는 행운의 타로 카드",
            description: "유니버셜 웨이트로 13가지 행운 키워드.\nPC·모바일에서 원하는 카드를 직접 선택해요.",
            icon: "🎴",
            customIcon: <TarotPickAnimation />,
            gradient: "from-[#fdf2f8] to-[#faf5ff]", // Pinkish
            borderColor: "border-[#f6339a]/30"
        },
        {
            step: "02",
            title: "타로마스터가 직접 해석한 결과 발송(24시간 이내)",
            description: "직접 뽑은 카드를 바탕으로\n타로마스터가 24시간 내 해석본을 보내드려요.",
            icon: "📩",
            customIcon: <LetterSendAnimation />,
            gradient: "from-[#fdf2f8] to-[#faf5ff]", // Pinkish
            borderColor: "border-[#f6339a]/30"
        }
    ];

    return (
        <div className="w-full bg-white pt-10 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
                        이렇게 진행이 됩니다 <span className="text-4xl">⭐</span>
                    </h2>
                </div>

                <div className="flex flex-col gap-8">
                    {steps.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative flex items-center bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 border border-purple-100 shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
                        >
                            {/* Step Number Badge */}
                            <div className="absolute top-0 left-0 bg-[#9810fa] text-white font-bold px-6 py-2 rounded-br-2xl text-lg">
                                STEP {item.step}
                            </div>

                            <div className="flex flex-col md:flex-row items-center w-full gap-8 mt-6 md:mt-0">
                                {/* Text Content */}
                                <div className="flex-1 text-center md:text-left md:pl-8">
                                    <h3 className="text-2xl font-black text-slate-900 mb-3 break-keep">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-600 text-lg whitespace-pre-line leading-relaxed break-keep">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Visual/Icon */}
                                <div className="w-48 h-48 flex items-center justify-center shrink-0">
                                    {item.customIcon ? (
                                        item.customIcon
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-white rounded-full shadow-md text-6xl group-hover:scale-110 transition-transform duration-300">
                                            {item.icon}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Arrow Logic (Visual connector between steps could go here) */}
            </div>
        </div>
    );
}
