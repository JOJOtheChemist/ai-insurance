import React from 'react';

interface CustomerSelectDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const CustomerSelectDrawer: React.FC<CustomerSelectDrawerProps> = ({
    isOpen,
    onClose,
    onConfirm
}) => {
    const [selectedCustomerId, setSelectedCustomerId] = React.useState<number | null>(1);

    const customers = [
        {
            id: 1,
            name: '王志远',
            avatarLabel: '王',
            avatarColor: 'bg-orange-500',
            description: '预算 8W · 意向高',
            tag: 'HOT'
        },
        {
            id: 2,
            name: '李晓雯',
            avatarLabel: '李',
            avatarColor: 'bg-gray-100 text-gray-500',
            description: '预算 2W · 待跟进',
            tag: null
        }
    ];

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />
            <div
                className={`fixed inset-x-0 bottom-0 bg-white rounded-t-[32px] shadow-2xl z-[70] h-[60vh] flex flex-col transition-transform duration-300 ease-out ${isOpen ? 'translate-y-0' : 'translate-y-full'
                    }`}
            >
                <div className="p-5 border-b border-gray-100 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-gray-800 text-lg">选择目标客户</h3>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {customers.map((customer) => (
                        <div
                            key={customer.id}
                            onClick={() => setSelectedCustomerId(customer.id)}
                            className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${selectedCustomerId === customer.id
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-50 bg-white hover:border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-12 h-12 rounded-2xl ${customer.avatarColor} text-white flex items-center justify-center text-lg font-bold shadow-sm`}
                                >
                                    {customer.avatarLabel}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 flex items-center gap-2">
                                        {customer.name}
                                        {customer.tag && (
                                            <span className="text-[10px] bg-white px-2 py-0.5 rounded-lg text-orange-600 border border-orange-200 font-black">
                                                {customer.tag}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5 font-medium">{customer.description}</div>
                                </div>
                            </div>
                            <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${selectedCustomerId === customer.id
                                        ? 'border-orange-500'
                                        : 'border-gray-200'
                                    }`}
                            >
                                {selectedCustomerId === customer.id && (
                                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-[scaleIn_0.2s_ease-out]" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-5 border-t border-gray-100 pb-10">
                    <button
                        onClick={onConfirm}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 active:scale-[0.98] transition-all hover:bg-gray-800"
                    >
                        确认并生成计划书
                    </button>
                </div>
            </div>
        </>
    );
};

export default CustomerSelectDrawer;
