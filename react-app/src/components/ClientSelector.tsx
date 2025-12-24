import React, { useState, useEffect } from 'react';
import { getClientsList, type ClientListItem } from '../services/clientApi';

interface ClientSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectClient: (client: ClientListItem) => void;
    salespersonId?: number;
}

const ClientSelector: React.FC<ClientSelectorProps> = ({
    isOpen,
    onClose,
    onSelectClient,
    salespersonId = 1, // 默认销售人员ID
}) => {
    const [clients, setClients] = useState<ClientListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadClients();
        }
    }, [isOpen]);

    const loadClients = async () => {
        setLoading(true);
        try {
            const response = await getClientsList();
            if (response) {
                setClients(response.clients);
            }
        } catch (error) {
            console.error('加载客户列表失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectClient = (client: ClientListItem) => {
        onSelectClient(client);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* 遮罩层 */}
            <div
                className="fixed inset-0 bg-black/40 z-[70] backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* 选择器面板 */}
            <div className="fixed inset-x-0 bottom-0 z-[75] bg-white rounded-t-[32px] shadow-2xl max-h-[85vh] flex flex-col animate-[slideUp_0.3s_ease-out]">
                {/* 顶部把手 */}
                <div className="w-full flex justify-center pt-3 pb-2 shrink-0">
                    <div className="w-10 h-1 bg-gray-200 rounded-full" />
                </div>

                {/* 标题栏 */}
                <div className="px-6 pb-4 shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">选择客户档案</h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
                        >
                            <i className="fa-solid fa-xmark" />
                        </button>
                    </div>

                    {/* 搜索框 */}
                    <div className="relative">
                        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            type="text"
                            placeholder="搜索客户姓名或职位..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                        />
                    </div>
                </div>

                {/* 客户列表 */}
                <div className="flex-1 overflow-y-auto px-6 pb-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <i className="fa-solid fa-users text-4xl mb-3 text-gray-200" />
                            <p className="text-sm">
                                {searchTerm ? '未找到匹配的客户' : '暂无客户档案'}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredClients.map((client) => (
                                <button
                                    key={client.id}
                                    onClick={() => handleSelectClient(client)}
                                    className="w-full bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-orange-300 hover:bg-orange-50 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        {/* 头像 */}
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center text-lg font-bold shadow-md">
                                            {client.name.charAt(0)}
                                        </div>

                                        {/* 客户信息 */}
                                        <div className="flex flex-col items-start">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-900">
                                                    {client.name}
                                                </span>
                                                {client.plans_count > 0 && (
                                                    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[9px] font-bold rounded">
                                                        {client.plans_count}方案
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                                                {client.role && (
                                                    <>
                                                        <span>{client.role}</span>
                                                        <span className="w-0.5 h-2 bg-gray-300" />
                                                    </>
                                                )}
                                                {client.annual_budget && (
                                                    <>
                                                        <span>预算{client.annual_budget}</span>
                                                    </>
                                                )}
                                                {!client.role && !client.annual_budget && (
                                                    <span className="text-gray-400">待完善</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 箭头图标 */}
                                    <i className="fa-solid fa-chevron-right text-gray-300 text-xs group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 创建新客户按钮 */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                            onClick={() => {
                                // TODO: 实现创建新客户逻辑
                                console.log('创建新客户');
                            }}
                            className="w-full h-14 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-all"
                        >
                            <i className="fa-solid fa-plus text-sm" />
                            <span className="text-sm font-medium">创建新客户档案</span>
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                    }
                    to {
                        transform: translateY(0);
                    }
                }
            `}</style>
        </>
    );
};

export default ClientSelector;
