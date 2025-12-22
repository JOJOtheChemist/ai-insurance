import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CustomerProfilePanel from '../components/CustomerProfilePanel';
import type { CustomerProfile } from '../components/CustomerInfoCards';
import { getClientBySession, getClientDetail } from '../services/clientApi';

const CustomerProfilePanelPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('sessionId');
    const clientId = searchParams.get('clientId');

    const [customerData, setCustomerData] = useState<CustomerProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!sessionId && !clientId) {
                setError('请在 URL 中提供 sessionId 或 clientId，才能加载真实客户数据');
                setCustomerData(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            const data = sessionId
                ? await getClientBySession(sessionId)
                : await getClientDetail(clientId as string);

            if (!data) {
                setError('未能获取到客户数据，请确认参数是否正确');
            }

            setCustomerData(data);
            setLoading(false);
        };

        fetchProfile();
    }, [sessionId, clientId]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100 py-10 px-6 flex justify-center overflow-auto font-['Noto_Sans_SC']">
            {loading ? (
                <div className="w-full max-w-md bg-white border border-orange-100 shadow-lg rounded-[24px] p-6 flex flex-col items-center justify-center text-gray-500">
                    <span className="text-sm font-bold animate-pulse">正在拉取客户档案...</span>
                    <p className="text-[11px] mt-2 text-gray-400">请稍候</p>
                </div>
            ) : customerData ? (
                <CustomerProfilePanel customerData={customerData} />
            ) : (
                <div className="w-full max-w-md bg-white border border-dashed border-gray-300 rounded-[24px] p-6 text-center text-gray-500 flex flex-col gap-3">
                    <div className="text-4xl">🗂️</div>
                    <p className="text-sm font-bold">{error || '暂无客户数据'}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        例如：访问
                        <code className="bg-gray-100 rounded px-1 py-0.5 mx-1 text-[11px]">/customer-profile-panel?clientId=9</code>
                        或
                        <code className="bg-gray-100 rounded px-1 py-0.5 mx-1 text-[11px]">/customer-profile-panel?sessionId=session-1766383216770</code>
                        加载已生成推荐方案的客户。
                    </p>
                </div>
            )}
        </div>
    );
};

export default CustomerProfilePanelPage;
