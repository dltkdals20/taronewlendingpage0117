import { motion } from "motion/react";
import sunTarotImg from '../../../assets/sun_tarot_card.png';
import moonTarotImg from '../../../assets/moon_tarot_card.png';
import starTarotImg from '../../../assets/star_tarot_card.png';

const Card = ({ title, symbol, number, gradient, border, rotate, delay, imgSrc }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 50, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: rotate }}
        transition={{ delay, duration: 0.8, type: "spring" }}
        className={`relative w-[300px] h-[480px] rounded-2xl p-1 shadow-2xl origin-bottom`}
    >
        <div className={`w-full h-full rounded-xl border-2 ${border} bg-gradient-to-br ${gradient} p-6 flex flex-col items-center justify-between relative overflow-hidden backdrop-blur-sm`}>
            {/* Card Content */}
            {imgSrc ? (
                <div className="absolute inset-0 w-full h-full">
                    <img
                        src={imgSrc}
                        alt={title}
                        className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
            ) : (
                <div className="z-10 flex flex-col items-center w-full h-full border border-white/20 rounded-lg p-4">
                    <div className="text-white/80 font-bold tracking-widest text-sm mb-4">✧ {title} ✧</div>
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-8xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">{symbol}</span>
                    </div>
                    <div className="text-white/60 font-serif text-lg tracking-widest mt-4">{number}</div>
                </div>
            )}

            {/* Shine effect */}
            {!imgSrc && <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />}
        </div>
    </motion.div>
);

export default function TarotCards() {
    return (
        <div className="relative w-full h-[350px] md:h-[600px] flex items-center justify-center -mt-10 md:-mt-10 overflow-visible scale-[0.45] md:scale-100 origin-top">

            {/* Left Card - Moon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-[110%] -translate-y-[45%] z-10">
                <Card
                    title="THE MOON"
                    symbol="☽"
                    number="XVIII"
                    gradient="from-[#312c85] to-[#59168b]"
                    border="border-[#ad46ff]"
                    rotate="-6deg"
                    delay={0.2}
                    imgSrc={moonTarotImg}
                />
            </div>

            {/* Right Card - Star */}
            <div className="absolute top-1/2 left-1/2 transform translate-x-[10%] -translate-y-[45%] z-10">
                <Card
                    title="THE STAR"
                    symbol="★"
                    number="XVII"
                    gradient="from-[#312c85] to-[#8200db]"
                    border="border-[#ad46ff]"
                    rotate="6deg"
                    delay={0.4}
                    imgSrc={starTarotImg}
                />
            </div>

            {/* Center Card - Sun (Main) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className="relative w-[320px] h-[500px] rounded-2xl p-1 shadow-[0_0_50px_rgba(255,165,0,0.3)] bg-gradient-to-br from-[#ffd700] via-[#ffaa00] to-[#ff4500]">
                        <div className="w-full h-full rounded-xl bg-[#1a1a2e] relative overflow-hidden flex flex-col">
                            {/* Inner Card Design */}
                            <div className="h-2/3 relative border-b-4 border-[#ffd700] overflow-hidden group">
                                <img
                                    src={sunTarotImg}
                                    alt="The Sun Tarot Card"
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            <div className="h-1/3 bg-white p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
                                <motion.div
                                    className="text-transparent bg-clip-text bg-gradient-to-br from-[#3c0366] to-[#8200db] text-7xl font-black leading-none filter drop-shadow-sm px-1"
                                    animate={{ scale: [1, 1.02, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    60<span className="text-4xl align-top">%</span>
                                </motion.div>
                                <div className="text-[#ff4500] font-black tracking-[0.3em] text-xl -mt-1 mb-3">OFF</div>
                                <motion.div
                                    className="bg-gradient-to-r from-[#3c0366] to-[#59168b] text-[#ffd700] px-4 py-1.5 rounded-full text-sm font-bold shadow-lg border border-[#ffd700]/30 whitespace-nowrap"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    신년 운세 대박 ✨
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
