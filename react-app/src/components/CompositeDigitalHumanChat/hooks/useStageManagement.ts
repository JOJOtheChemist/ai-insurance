import { useRef, useEffect } from 'react';
import type { Stage, Message } from '../types';

/**
 * Hook for managing UI stage transitions and scroll behavior
 * Handles stage 0 (welcome), stage 1 (chat started), stage 2 (full screen)
 */
export const useStageManagement = (messages: Message[], stage: Stage, setStage: (stage: Stage) => void) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic
    useEffect(() => {
        if (stage === 2 && chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        } else {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, stage]);

    // Stage transition logic - check for overflow
    useEffect(() => {
        const checkOverflow = () => {
            if (stage === 1 && chatContainerRef.current) {
                const { scrollHeight, clientHeight } = chatContainerRef.current;
                if (scrollHeight > clientHeight) {
                    setStage(2);
                }
            }
        };

        const timer = setTimeout(checkOverflow, 100);
        return () => clearTimeout(timer);
    }, [messages, stage]);

    const getChatSheetClasses = () => {
        if (stage === 2) return 'top-[60px] h-[calc(100%-60px)] rounded-none';
        if (stage === 1) return 'top-[180px] h-[calc(100%-180px)] rounded-t-[24px]';
        return 'top-[45%] h-[55%] rounded-t-[32px]';
    };

    return {
        messagesEndRef,
        chatContainerRef,
        getChatSheetClasses
    };
};
