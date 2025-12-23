import React from 'react';

interface RateRow {
    age: string;
    premium: string;
}

interface RateTableProps {
    rows: RateRow[];
    note?: string;
}

const RateTable: React.FC<RateTableProps> = ({ rows, note }) => {
    if (!rows || rows.length === 0) return null;

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
            <h3 className="text-lg font-bold mb-2 flex items-center">
                <span className="w-1 h-4 bg-red-600 mr-2 rounded"></span>
                费率参考 (示例)
            </h3>
            {note && (
                <p className="text-sm text-gray-500 mb-3">*{note}</p>
            )}
            <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left font-semibold">年龄</th>
                            <th className="p-3 text-right font-semibold">年交保费</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="border-b border-gray-100 last:border-0">
                                <td className="p-3">{row.age}</td>
                                <td className="p-3 text-right font-semibold">{row.premium}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RateTable;
