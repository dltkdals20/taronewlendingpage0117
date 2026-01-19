import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { supabase } from "../../lib/supabaseClient";
import { calculateTimeBasedStock } from "../../utils/timeBasedStock";

interface StockDisplayProps {
    refreshTrigger?: number;
    immediateStock?: number | null;
}

export default function StockDisplay({ refreshTrigger, immediateStock }: StockDisplayProps) {
    const [stock, setStock] = useState<number>(20);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const lastHourRef = useRef<number>(-1);

    const calculateDisplayStock = async () => {
        try {
            // sold_out_at 조회
            const { data: soldOutAtData, error: soldOutError } = await supabase
                .rpc("get_sold_out_at");
            
            const soldOutAt = soldOutAtData || null;
            
            // 시간대별 계산값 (sold_out_at 전달)
            const timeBasedStock = calculateTimeBasedStock(soldOutAt);
            
            // 신청 횟수 가져오기
            const { data: appCountData, error: appCountError } = await supabase
                .rpc("get_application_count");

            if (appCountError) {
                console.error("신청 횟수 조회 오류:", appCountError);
                // 오류 시 시간대별 계산값만 표시
                setStock(timeBasedStock);
                return;
            }

            const applicationCount = appCountData || 0;
            
            // 화면 재고 = 시간대별 계산값 - 신청 횟수
            // 단, sold_out_at이 있고 10분 경과 시 2개로 복구되므로 신청 횟수는 무시
            let displayStock: number;
            if (soldOutAt) {
                const soldOutTime = new Date(soldOutAt);
                const elapsedMinutes = (new Date().getTime() - soldOutTime.getTime()) / (1000 * 60);
                
                if (elapsedMinutes >= 10) {
                    // 10분 경과 시 2개로 복구 (신청 횟수 무시)
                    displayStock = 2;
                } else {
                    // 10분 미만이면 0개 유지
                    displayStock = 0;
                }
            } else {
                // 일반 계산
                displayStock = Math.max(0, timeBasedStock - applicationCount);
            }
            
            console.log("시간대 계산값:", timeBasedStock, "신청 횟수:", applicationCount, "sold_out_at:", soldOutAt, "표시 재고:", displayStock);
            setStock(displayStock);
        } catch (err) {
            console.error("재고 계산 중 예외 발생:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchStock = calculateDisplayStock;

    useEffect(() => {
        // 초기 로드
        fetchStock();

        // 시간대 변경 감지 및 sold_out_at 체크 (1분마다 체크)
        const interval = setInterval(() => {
            const now = new Date();
            const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
            const currentHour = kstTime.getUTCHours();
            
            // 시간대가 바뀌면 재고 갱신
            if (currentHour !== lastHourRef.current) {
                lastHourRef.current = currentHour;
                fetchStock();
            } else {
                // 시간대가 같아도 sold_out_at 체크 (10분 경과 확인)
                fetchStock();
            }
        }, 60000); // 1분마다 체크

        return () => clearInterval(interval);
    }, []);

    // immediateStock이 있으면 즉시 표시 (신청 완료 직후)
    useEffect(() => {
        if (immediateStock !== null && immediateStock !== undefined) {
            console.log("즉시 재고 업데이트:", immediateStock);
            setStock(immediateStock);
            // 즉시 다시 계산 (신청 횟수 반영)
            setTimeout(() => {
                fetchStock();
            }, 500);
        }
    }, [immediateStock]);

    // refreshTrigger가 변경되면 즉시 재고 갱신
    useEffect(() => {
        if (refreshTrigger !== undefined && refreshTrigger > 0) {
            fetchStock();
        }
    }, [refreshTrigger]);

    // 진행 바 계산 (최대 50개 기준 - 수량이 많이 나간 것처럼 보이게)
    const progressPercentage = Math.max(5, (stock / 50) * 100);

    return (
        <div className="w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#e9d4ff]/60 rounded-xl p-5 md:p-6 w-full"
            >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-700 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        선착순 마감 임박!
                    </span>
                    <span className="hidden md:inline text-sm text-slate-600">
                        계속해서 예약이 들어오는 중이에요
                    </span>
                </div>

                <div className="flex items-end gap-2 mb-4">
                    <span className="text-slate-600 font-medium pb-1">현재 남은 수량:</span>
                    <span className="text-5xl md:text-6xl font-black text-red-600 tracking-tight">{stock}</span>
                    <span className="text-xl md:text-2xl text-slate-600 font-bold pb-1">개</span>
                </div>

                <div className="w-full bg-slate-300 rounded-full h-2.5 overflow-hidden mb-2">
                    <motion.div
                        className="bg-red-600 h-2.5 rounded-full"
                        initial={{ width: "100%" }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </div>
                
                <p className="text-xs text-slate-500 text-right">
                    * 재고 소진 시 조기 마감될 수 있습니다.
                </p>
            </motion.div>
        </div>
    );
}
