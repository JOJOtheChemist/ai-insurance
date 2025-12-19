import React from 'react';
import { AvatarViewport } from './DigitalHumanChat/AvatarViewport';
import { InteractionSheet } from './DigitalHumanChat/InteractionSheet';
import { InputArea } from './DigitalHumanChat/InputArea';

const DigitalHumanChatSwitch: React.FC = () => {
    const [isChatStarted, setIsChatStarted] = React.useState(false);
    const [messages, setMessages] = React.useState<{ role: 'user' | 'ai', content: React.ReactNode }[]>([]);

    const handleStartChat = (msg: string) => {
        if (!msg.trim()) return;

        // 1. Transition State
        setIsChatStarted(true);

        // 2. Add User Message
        const newMsg: { role: 'user' | 'ai', content: string } = { role: 'user', content: msg };
        setMessages(prev => [...prev, newMsg]);

        // 3. Simulate AI Response
        setTimeout(() => {
            const aiResponse: { role: 'user' | 'ai', content: React.ReactNode } = {
                role: 'ai',
                content: (
                    <>
                        <p className="font-bold text-gray-800 mb-1">这是一个非常典型的风险场景。</p>
                        根据《公司法》与相关司法解释，如果您作为企业法定代表人与公司财产存在混同，债务确实可能穿透到个人。<br /><br />
                        建议我们从<span className="text-orange-600 font-bold">家企账户隔离</span>和<span className="text-orange-600 font-bold">信托架构搭建</span>两个维度来构建防火墙...
                        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar scrollbar-hide pt-1">
                            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 font-medium whitespace-nowrap">查看类似判例</button>
                            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 font-medium whitespace-nowrap">生成隔离方案</button>
                        </div>
                    </>
                )
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 800);
    };

    return (
        <div className="h-full w-full flex flex-col overflow-hidden relative bg-[#1F2937] font-sans">
            <AvatarViewport minimized={isChatStarted} />
            <InteractionSheet
                minimized={isChatStarted}
                messages={messages}
                onPromptClick={handleStartChat}
            />
            <InputArea onSend={handleStartChat} />
        </div>
    );
};

export default DigitalHumanChatSwitch;
