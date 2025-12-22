import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AminoAcidChartProps {
  data: { aminoAcid: string; count: number }[];
}

const AminoAcidChart: React.FC<AminoAcidChartProps> = ({ data }) => {
  const colors = [
    '#000000', '#1f2937', '#374151', '#4b5563', '#6b7280',
    '#9ca3af', '#d1d5db', '#e5e7eb', '#000000', '#1f2937',
    '#374151', '#4b5563', '#6b7280', '#9ca3af', '#d1d5db',
    '#e5e7eb', '#000000', '#1f2937', '#374151', '#4b5563'
  ];

  return (
    <div className="w-full bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Amino Acid Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="aminoAcid" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AminoAcidChart;

