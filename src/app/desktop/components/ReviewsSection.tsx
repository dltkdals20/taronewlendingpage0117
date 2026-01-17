import { motion } from "motion/react";

export default function ReviewsSection() {
    const reviews = [
        {
            text: "직접 뽑고 바로 확인되는 것도 좋았는데, 해석본이 생각보다 훨씬 상세해서 놀랐어요. 그냥 키워드만 주는 게 아니라 상황별로 풀어줘서 좋았습니다.",
            author: "김OO님",
            stars: 5
        },
        {
            text: "온라인 타로는 간단할 줄 알았는데, 타로 마스터님이 해석을 깊게 써주셔서 오히려 더 만족했어요. 읽다 보니 디테일이 살아있더라고요.",
            author: "이OO님",
            stars: 5
        },
        {
            text: "카드 뽑는 과정이 재미있고 간편했어요. 게다가 마스터 해석이 디테일하게 정리돼 있어서 결과가 더 신뢰감 있게 느껴졌습니다.",
            author: "박OO님",
            stars: 5
        }
    ];

    return (
        <div className="w-full bg-slate-50 py-24 px-4 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                        카드는 내가 뽑고<br />
                        <span className="text-[#8200db]">해석은 전문가가</span>
                    </h2>
                    <p className="text-slate-600">디테일한 리딩 후기를 확인해보세요</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex gap-1 mb-4">
                                    {[...Array(review.stars)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-xl">★</span>
                                    ))}
                                </div>
                                <p className="text-slate-700 leading-relaxed mb-6 font-medium">
                                    "{review.text}"
                                </p>
                            </div>
                            <div className="flex items-center gap-3 mt-auto pt-6 border-t border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-purple-600 font-bold">
                                    {review.author[0]}
                                </div>
                                <span className="text-sm font-bold text-slate-500">{review.author}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
