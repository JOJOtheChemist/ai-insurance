import React from 'react';

export interface TableData {
    title?: string;
    headers: string[];
    rows: string[][];
}

interface DynamicTableProps {
    data: TableData;
    showTitle?: boolean;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, showTitle = true }) => {
    if (!data || !data.headers || !data.rows) return null;

    return (
        <div className="overflow-hidden rounded-lg border border-gray-100">
            {showTitle && data.title && (
                <div className="bg-gray-50 px-4 py-2 font-bold text-gray-700 text-sm border-b border-gray-100">
                    {data.title}
                </div>
            )}
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                        {data.headers.map((header, idx) => (
                            <th key={idx} className="px-4 py-3 border-b border-gray-100">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-gray-50/50 transition-colors">
                            {row.map((cell, cellIdx) => (
                                <td key={cellIdx} className="px-4 py-3 text-gray-700">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DynamicTable;
