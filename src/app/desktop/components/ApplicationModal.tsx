import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ApplicationModal({ isOpen, onClose }: ApplicationModalProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const handleSubmit = () => {
        if (!name || !phone) {
            alert("이름과 휴대폰 번호를 입력해주세요.");
            return;
        }
        if (!agreed) {
            alert("개인정보 수집 · 이용에 동의해주세요.");
            return;
        }
        alert("신청이 완료되었습니다! (데모)");
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-md rounded-3xl p-8 relative shadow-2xl overflow-hidden"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-medium text-lg"
                            >
                                닫기
                            </button>

                            {/* Header */}
                            <h2 className="text-3xl font-bold text-slate-900 mb-2">신청하기</h2>
                            <p className="text-slate-500 mb-8">이름과 휴대폰 번호를 입력해주세요.</p>

                            {/* Form */}
                            <div className="space-y-6 mb-8">
                                <div>
                                    <label className="block text-slate-900 font-bold mb-2">이름</label>
                                    <input
                                        type="text"
                                        placeholder="홍길동"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-lg outline-none focus:border-[#8200db] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-900 font-bold mb-2">휴대폰 번호</label>
                                    <input
                                        type="tel"
                                        placeholder="01012345678"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-lg outline-none focus:border-[#8200db] transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Agreement */}
                            <div className="mb-8">
                                <div className="border border-slate-200 rounded-xl p-4 flex items-center gap-3 hover:border-[#ad46ff] transition-colors">
                                    <input
                                        type="checkbox"
                                        id="agreement"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="w-5 h-5 accent-[#8200db] cursor-pointer"
                                    />
                                    <label htmlFor="agreement" className="text-slate-600 text-sm flex-1 cursor-pointer">
                                        개인정보 수집 · 이용에 동의합니다. (필수, <button onClick={() => setShowDetails(!showDetails)} className="underline text-slate-800 font-medium">상세보기</button>)
                                    </label>
                                </div>

                                {/* Agreement Details */}
                                <AnimatePresence>
                                    {showDetails && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-slate-50 text-xs text-slate-500 p-4 rounded-lg mt-2 leading-relaxed whitespace-pre-wrap">
                                                {`인비랩은(는) 고객 지원을 위해 아래와 같이 개인정보를 수집·이용합니다.

1) 개인정보 수집 목적 : 회원관리, 고객 상담, 고지사항 전달
2) 개인정보 수집 항목 : 이름, 전화번호, 이메일
3) 보유 및 이용기간 : 회원 탈퇴시까지

* 개인정보 수집 및 이용에 동의하지 않을 권리가 있으며, 동의를 거부할 경우에는 상품 제공이 불가합니다.`}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-[#59168b] to-[#8200db] text-white font-bold text-xl py-4 rounded-2xl shadow-lg hover:shadow-purple-200 active:scale-[0.98] transition-all"
                            >
                                신청하기
                            </button>

                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
