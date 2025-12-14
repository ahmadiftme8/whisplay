"use client";

import { useState, useEffect } from "react";
import { Button, MenuList, MenuListItem, Separator } from "react95";

interface SleepTimerMenuProps {
    onSetTimer: (minutes: number) => void;
}

export const SleepTimerMenu: React.FC<SleepTimerMenuProps> = ({ onSetTimer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTime, setActiveTime] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    // Countdown logic for display
    useEffect(() => {
        if (!activeTime) {
            setTimeLeft(null);
            return;
        }

        setTimeLeft(activeTime * 60);
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeTime]);

    const handleSetTime = (min: number) => {
        setActiveTime(min === 0 ? null : min);
        onSetTimer(min);
        setIsOpen(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <Button active={isOpen} onClick={() => setIsOpen(!isOpen)}>
                {timeLeft !== null ? formatTime(timeLeft) : "Timer"}
            </Button>

            {isOpen && (
                <div style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 4, zIndex: 100 }}>
                    <MenuList>
                        {[15, 30, 60].map((min) => (
                            <MenuListItem
                                key={min}
                                onClick={() => handleSetTime(min)}
                            >
                                <span style={{ width: 20, display: 'inline-block' }}>
                                    {activeTime === min && "✓"}
                                </span>
                                {min} Minutes
                            </MenuListItem>
                        ))}
                        <Separator />
                        <MenuListItem onClick={() => handleSetTime(0)}>
                            <span style={{ width: 20, display: 'inline-block' }}>
                                {activeTime === null && "✓"}
                            </span>
                            Disable
                        </MenuListItem>
                    </MenuList>
                </div>
            )}
        </div>
    );
};
