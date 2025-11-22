import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Bulut Sunucular', value: 45 },
  { name: 'Yerel Dijital', value: 30 },
  { name: 'Fiziksel Kağıt', value: 15 },
  { name: 'Mikrofilm', value: 10 },
];

const COLORS = ['#4f46e5', '#818cf8', '#cbd5e1', '#94a3b8'];

export const StorageChart: React.FC = () => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-slate-100 my-8 h-[320px] md:h-[450px]">
      <div className="mb-2 md:mb-6 text-center">
        <h3 className="text-sm md:text-lg font-serif font-bold text-slate-900">Veri Depolama Dağılımı (2025)</h3>
      </div>
      <div className="h-[250px] md:h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={40}
              outerRadius={70}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            />
            <Legend 
                verticalAlign="bottom" 
                height={60} 
                wrapperStyle={{ fontSize: '10px', width: '100%' }}
                align="center"
                layout="horizontal"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};