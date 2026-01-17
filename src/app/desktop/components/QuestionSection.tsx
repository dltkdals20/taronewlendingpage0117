export default function QuestionSection() {
    return (
        <div className="w-full bg-white py-16 px-4 flex flex-col items-center justify-center">
            <div className="max-w-4xl w-full text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-slate-800 leading-relaxed mb-12 break-keep">
                    유니버셜 웨이트 78장에서, 어떤<br />
                    <span className="text-[#8200db]">올해 행운의 키워드 13개</span>를 뽑나요?
                </h3>

                <div className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto">
                    {[
                        "대표, 금전, 형제",
                        "가족, 연애, 건강",
                        "결혼, 도움, 시험운",
                        "직장/사업/자영업",
                        "우정, 장애물, 결과"
                    ].map((text, idx) => (
                        <div key={idx} className="bg-purple-50 px-10 py-6 rounded-3xl border-2 border-purple-200 text-2xl md:text-3xl font-black text-slate-800 shadow-md hover:scale-105 transition-transform duration-300">
                            {text}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
