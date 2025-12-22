import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RamachandranPlotProps {
  data?: { phi: number; psi: number }[];
}

const RamachandranPlot: React.FC<RamachandranPlotProps> = ({ 
  data = generateSampleData() 
}) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Ramachandran Plot</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            dataKey="phi" 
            name="Phi (ϕ)"
            domain={[-180, 180]}
            label={{ value: 'Phi (ϕ) Angle', position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis 
            type="number" 
            dataKey="psi" 
            name="Psi (ψ)"
            domain={[-180, 180]}
            label={{ value: 'Psi (ψ) Angle', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #d1d5db',
              borderRadius: '4px'
            }}
          />
          <Scatter name="Angles" data={data} fill="#000000" opacity={0.4}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="#000000" />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Sample data showing phi (ϕ) and psi (ψ) angles for protein backbone
      </p>
    </div>
  );
};

// Generate sample Ramachandran plot data
function generateSampleData(): { phi: number; psi: number }[] {
  const data: { phi: number; psi: number }[] = [];
  for (let i = 0; i < 1000; i++) {
    data.push({
      phi: Math.random() * 360 - 180,
      psi: Math.random() * 360 - 180,
    });
  }
  return data;
}

export default RamachandranPlot;

