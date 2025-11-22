import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Bulut Sunucular', value: 45 },
  { name: 'Yerel Dijital Arşivler', value: 30 },
  { name: 'Fiziksel Kağıt/Parşömen', value: 15 },
  { name: 'Mikrofilm/Manyetik Bant', value: 10 },
];

const COLORS = ['#4f46e5', '#818cf8', '#cbd5e1', '#94a3b8'];

export const StorageChart: React.FC = () => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-slate-100 my-8 h-[350px] md:h-[450px]">
      <div className="mb-4 md:mb-6 text-center">
        <h3 className="text-base md:text-lg font-serif font-bold text-slate-900">Küresel Tarih Verisi Depolama Dağılımı (2025)</h3>
      </div>
      <div className="h-[250px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
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
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};