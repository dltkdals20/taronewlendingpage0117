import { motion } from "motion/react";
import imgImage from "@/assets/5a9f80748f5cc4cf4bcc943230ba6b7c611be95b.png";

export default function DetailsSection() {


    return (
        <div className="w-full bg-gradient-to-b from-[#f3e8ff] to-white py-24 px-4 overflow-hidden">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">

                {/* Left Side: Image */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="w-full md:w-1/2 relative"
                >
                    <div className="rounded-2xl overflow-hidden shadow-2xl transform rotate-[-2deg] border-4 border-white">
                        {/* Using the local asset image extracted earlier */}
                        <img src={imgImage} alt="Tarot Spread" className="w-full h-auto object-cover" />
                    </div>
                </motion.div>

                {/* Right Side: Features List */}
                <div className="w-full md:w-1/2">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-3xl font-black text-slate-900 leading-tight">
                            타로 카드의 정석<br />
                            <span className="text-[#9810fa] text-xl font-bold block mt-2">유니버셜 웨이트 카드로 진행</span>
                        </h2>
                    </div>

                    <div className="bg-[#f5ebff] rounded-2xl p-8 border border-purple-100 shadow-sm">
                        <p className="text-xl text-slate-700 font-bold leading-relaxed">
                            검증된 유니버셜 웨이트 78장에서,<br className="hidden md:block" />
                            올해 행운의 키워드 13개를 뽑아 확인하세요.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
