import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export default function CountdownTimer() {
    // Set target date to 30 days from now
    // In a real app, this might be a fixed date from props
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 30, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // For demonstration, let's fix the end date to 30 days from a static point or just simulate it.
        // Let's set it to 30 days from *now* just once on mount, so it counts down.
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 30);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center mx-2">
            <div className="bg-[#59168b] text-white rounded-lg p-3 w-16 h-16 flex items-center justify-center text-2xl font-bold shadow-lg border border-[#8200db]">
                {value.toString().padStart(2, '0')}
            </div>
            <span className="text-slate-500 text-xs mt-1 font-medium">{label}</span>
        </div>
    );

    return (
        <div className="flex flex-col items-center mb-8">
            <p className="text-[#8200db] font-bold mb-4 text-sm tracking-wider uppercase">
                할인 종료까지 남은 시간
            </p>
            <div className="flex justify-center">
                <TimeUnit value={timeLeft.days} label="DAYS" />
                <span className="text-2xl font-bold text-[#8200db] mt-2">:</span>
                <TimeUnit value={timeLeft.hours} label="HOURS" />
                <span className="text-2xl font-bold text-[#8200db] mt-2">:</span>
                <TimeUnit value={timeLeft.minutes} label="MIN" />
                <span className="text-2xl font-bold text-[#8200db] mt-2">:</span>
                <TimeUnit value={timeLeft.seconds} label="SEC" />
            </div>
        </div>
    );
}
