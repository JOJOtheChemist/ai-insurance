import React from 'react';

const ActionMenu: React.FC = () => {
    return (
        <section className="relative z-10 px-4 space-y-4 pb-12">
            <h2 className="text-sm font-black text-gray-400 px-1 uppercase tracking-widest">AI 专属服务</h2>

            <div className="grid grid-cols-2 gap-4">
                <button className="bg-white border border-gray-50 rounded-[24px] p-5 flex flex-col gap-4 items-start group relative overflow-hidden active:scale-95 transition-all active:bg-gray-50 active:border-gray-200 shadow-sm">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fa-solid fa-users-viewfinder text-5xl text-blue-500"></i>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                        <i className="fa-solid fa-user-astronaut"></i>
                    </div>
                    <div>
                        <div className="text-base font-black text-gray-800">我的数字分身</div>
                        <div className="text-xs font-medium text-gray-400 mt-1">管理销售大脑与风格</div>
                    </div>
                </button>

                <button className="bg-white border border-gray-50 rounded-[24px] p-5 flex flex-col gap-4 items-start group relative overflow-hidden active:scale-95 transition-all active:bg-gray-50 active:border-gray-200 shadow-sm">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <i className="fa-solid fa-book text-5xl text-purple-500"></i>
                    </div>
                    <div
                        className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
                        <i className="fa-solid fa-database"></i>
                    </div>
                    <div>
                        <div className="text-base font-black text-gray-800">私有知识库</div>
                        <div className="text-xs font-medium text-gray-400 mt-1">上传文档/话术资料</div>
                    </div>
                </button>
            </div>

            <div className="bg-white rounded-[24px] border border-gray-50 overflow-hidden mt-6 shadow-sm">
                <button
                    className="w-full flex items-center justify-between p-5 border-b border-gray-50 hover:bg-gray-50 transition-colors active:bg-gray-100">
                    <div className="flex items-center gap-4">
                        <i className="fa-solid fa-file-invoice-dollar text-gray-400 w-6 text-center text-lg"></i>
                        <span className="text-base font-bold text-gray-700">充值记录与发票</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-sm text-gray-300"></i>
                </button>
                <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors active:bg-gray-100">
                    <div className="flex items-center gap-4">
                        <i className="fa-solid fa-gift text-gray-400 w-6 text-center text-lg"></i>
                        <span className="text-base font-bold text-gray-700">邀请同事 (送算力)</span>
                        <span className="bg-red-50 text-red-500 text-[10px] px-2 py-0.5 rounded-full font-black">Hot</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-sm text-gray-300"></i>
                </button>
            </div>
        </section>
    );
};

export default ActionMenu;
