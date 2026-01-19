// 시간대별 재고 계산 함수 (한국 시간 기준)
export function calculateTimeBasedStock(soldOutAt?: string | null): number {
    const now = new Date();
    // 한국 시간으로 변환 (UTC+9)
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstTime = new Date(now.getTime() + kstOffset);
    // UTC 시간 기준으로 hour, minute 가져오기 (이미 KST로 변환된 시간이므로)
    const hour = kstTime.getUTCHours();
    const minute = kstTime.getUTCMinutes();

    // 재고가 0이 된 후 10분 경과 시 2개로 복구
    if (soldOutAt) {
        const soldOutTime = new Date(soldOutAt);
        const elapsedMinutes = (now.getTime() - soldOutTime.getTime()) / (1000 * 60);
        
        if (elapsedMinutes >= 10) {
            return 2; // 10분 경과 시 2개로 복구
        }
    }

    // 시간대별 시나리오 (20개 기준, 새벽 5시 리셋)
    // 05:00 ~ 07:59: 리셋 후 아침 (15~18개)
    if (hour >= 5 && hour < 8) {
        return 15 + (hour - 5); // 15, 16, 17개
    }
    // 08:00 ~ 11:59: 오전 (14~18개)
    else if (hour >= 8 && hour < 12) {
        return 18 - (hour - 8); // 18, 17, 16, 15, 14개
    }
    // 12:00 ~ 16:59: 이른 오후 (9~13개)
    else if (hour >= 12 && hour < 17) {
        return 13 - (hour - 12); // 13, 12, 11, 10, 9개
    }
    // 17:00 ~ 20:59: 초저녁 (5~8개)
    else if (hour >= 17 && hour < 21) {
        return 8 - (hour - 17); // 8, 7, 6, 5개
    }
    // 21:00 ~ 22:59: 피크 시작 (3~5개)
    else if (hour >= 21 && hour < 23) {
        return 5 - (hour - 21); // 5, 4, 3개
    }
    // 23:00 ~ 23:29: 피크 한가운데 (2~3개)
    else if (hour === 23 && minute < 30) {
        return 3 - Math.floor(minute / 10); // 3, 2개
    }
    // 23:30 ~ 23:59: 자정 직전 (1개 고정)
    else if (hour === 23 && minute >= 30) {
        return 1;
    }
    // 00:00 ~ 01:59: 자정 이후 새벽, 피크 연장 (1~2개)
    else if (hour >= 0 && hour < 2) {
        return 2 - hour; // 2, 1개
    }
    // 02:00 ~ 04:59: 새벽, 막차 느낌 유지 (1~2개)
    else {
        return 2 - Math.floor((hour - 2) / 2); // 2, 1개
    }
}
