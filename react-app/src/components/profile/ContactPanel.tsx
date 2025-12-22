import React, { useState } from 'react';
import type { CustomerProfile } from '../CustomerInfoCards';

interface ContactPanelProps {
    contacts?: CustomerProfile['contacts'];
}

const ContactPanel: React.FC<ContactPanelProps> = ({ contacts }) => {
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

    const handleCopy = (idx: number, info?: string) => {
        if (!info) return;
        // 模拟复制
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1500);
    };

    const getIconForType = (type?: string) => {
        switch (type) {
            case 'secretary': return 'fa-message';
            case 'finance': return 'fa-envelope';
            case 'doctor': return 'fa-file-arrow-up';
            default: return 'fa-message';
        }
    };

    const getActionLabelForType = (type?: string) => {
        switch (type) {
            case 'secretary': return '发消息';
            case 'finance': return '发邮件';
            case 'doctor': return '上传体检';
            default: return '联系';
        }
    };

    const getCopyLabelForType = (type?: string) => {
        switch (type) {
            case 'secretary': return '复制微信号';
            case 'finance': return '复制邮箱';
            case 'doctor': return '复制联系人';
            default: return '复制联系方式';
        }
    };

    return (
        <div className="bg-white rounded-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.02)] border border-gray-100 p-5 shrink-0 mb-6">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <i className="fa-solid fa-address-book text-orange-500"></i> 常用联系人
                </span>
                {contacts && contacts.length > 0 && (
                    <button className="text-[10px] text-gray-400 hover:text-orange-500 transition-colors">查看全部</button>
                )}
            </div>

            {contacts && contacts.length > 0 ? (
                <div className="space-y-3">
                    {contacts.map((contact, idx) => (
                        <div key={idx} className="flex gap-3 rounded-2xl border border-gray-100 p-3 hover:border-orange-200 transition-colors">
                            {contact.type === 'doctor' ? (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 text-orange-500 flex items-center justify-center text-lg shrink-0">
                                    <i className="fa-solid fa-dna"></i>
                                </div>
                            ) : (
                                <img
                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.avatar_seed || contact.type || contact.name}`}
                                    className={`w-10 h-10 rounded-xl shrink-0 ${contact.type === 'finance' ? 'bg-blue-50' : 'bg-orange-50'}`}
                                    alt={contact.name}
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0">
                                        <h4 className="text-xs font-bold text-gray-800 truncate">{contact.name}</h4>
                                        <p className="text-[10px] text-gray-400 truncate">{contact.role}</p>
                                    </div>
                                    <button className={`text-[10px] text-gray-400 flex items-center gap-1 shrink-0 ${contact.type === 'finance' ? 'hover:text-blue-500' : 'hover:text-orange-500'}`}>
                                        <i className={`fa-solid ${getIconForType(contact.type)}`}></i> {getActionLabelForType(contact.type)}
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-gray-500">
                                    {contact.actions?.map((action, aIdx) => (
                                        <span key={aIdx} className="px-2 py-0.5 bg-gray-50 rounded-full border border-gray-100 whitespace-nowrap">{action}</span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleCopy(idx, contact.contact_info)}
                                    className={`w-full mt-2 py-2 rounded-full border text-xs font-bold flex items-center justify-center gap-2 transition-all bg-white shadow-sm ${copiedIdx === idx ? 'border-green-400 text-green-500 scale-105' : 'border-gray-200 text-gray-500 hover:border-orange-200 hover:text-orange-600'}`}
                                >
                                    {copiedIdx === idx ? (
                                        <>
                                            <i className="fa-solid fa-check"></i> {contact.contact_info ? `已复制：${contact.contact_info.length > 15 ? contact.contact_info.substring(0, 15) + '...' : contact.contact_info}` : '复制成功'}
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-copy"></i> {getCopyLabelForType(contact.type)}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // 空状态：显示待填入提示
                <div className="flex flex-col items-center justify-center py-8 px-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-3">
                        <i className="fa-solid fa-user-plus text-orange-400 text-lg"></i>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">暂无常用联系人</p>
                    <p className="text-xs text-gray-400 text-center">可在对话中提及客户的助理、家人等关键联系人</p>
                </div>
            )}
        </div>
    );
};

export default ContactPanel;
