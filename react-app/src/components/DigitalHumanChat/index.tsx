
import React from 'react';
import { AvatarViewport } from './AvatarViewport';
import { InteractionSheet } from './InteractionSheet';
import { InputArea } from './InputArea';

const DigitalHumanChat: React.FC = () => {
    return (
        <div className="h-full w-full flex flex-col overflow-hidden relative bg-[#1F2937] font-sans">
            <AvatarViewport />
            <InteractionSheet />
            <InputArea />
        </div>
    );
};

export default DigitalHumanChat;
