import { motion } from "motion/react";
import imgSun from "@/assets/166bfafdd1e40dc9e5f54927389444cd63446592.png";

export default function InterpretationSection() {
    return (
        <div className="w-full bg-white py-24 px-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-100 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">

                {/* Left: Card Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-full md:w-1/2 flex justify-center"
                >
                    <div className="relative w-[300px] rounded-2xl shadow-[0_20px_60px_-15px_rgba(255,215,0,0.4)] border-8 border-white bg-white rotate-3">
                        <img src={imgSun} alt="The Sun Card" className="w-full h-auto rounded-lg" />

                        {/* Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white px-6 py-3 rounded-full shadow-lg border border-yellow-100">
                            <span className="text-2xl font-black text-[#f0b100]">THE SUN</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Text Analysis */}
                <div className="w-full md:w-1/2">
                    <div className="bg-gradient-to-br from-yellow-50 to-white p-10 rounded-[40px] border border-yellow-100 shadow-xl relative">
                        <div className="absolute -top-6 left-10 bg-[#f0b100] text-white px-6 py-2 rounded-full font-bold">
                            금전운 해석 예시
                        </div>

                        <h3 className="text-3xl font-black text-slate-800 mb-8 leading-tight">
                            "돈이 밝아지고(가시화)<br />
                            잘 돌고(현금흐름)<br />
                            <span className="text-[#d08700]">성과로 증명되는</span>" 해
                        </h3>

                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">1</span>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg mb-1">수익 상승 / 매출 회복</h4>
                                    <p className="text-slate-600">막히던 금전 흐름이 시원하게 뚫리기 쉬운 시기입니다.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">2</span>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg mb-1">투명한 돈</h4>
                                    <p className="text-slate-600">계약, 정산, 세금 등 모든 것이 투명하고 명확해집니다.</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">3</span>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg mb-1">브랜딩이 돈이 됨</h4>
                                    <p className="text-slate-600">나의 얼굴, 이름, 브랜드 가치가 곧 수익으로 연결됩니다.</p>
                                </div>
                            </li>
                        </ul>

                    </div>
                </div>

            </div>
        </div>
    );
}
