import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Belge Tarama', Geleneksel: 120, Dijital: 5 }, 
  { name: 'Arşiv Erişimi', Geleneksel: 4320, Dijital: 2 }, 
  { name: 'Veri Analizi', Geleneksel: 300, Dijital: 15 },
  { name: 'Paylaşım', Geleneksel: 60, Dijital: 1 },
];

export const ComparisonChart: React.FC = () => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-slate-100 my-8 h-[320px] md:h-[450px]">
      <div className="mb-4 md:mb-6">
        <h3 className="text-sm md:text-lg font-serif font-bold text-slate-900">Zaman Maliyeti (Dakika)</h3>
        <p className="text-[10px] md:text-sm text-slate-500 mt-1">Geleneksel vs Dijital Yöntemler</p>
      </div>
      <div className="h-[220px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 0, left: -15, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
                interval={0} 
                tickMargin={5}
            />
            <YAxis 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
            />
            <Tooltip 
              cursor={{fill: '#f1f5f9'}}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} iconSize={8} />
            <Bar dataKey="Geleneksel" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Manuel" />
            <Bar dataKey="Dijital" fill="#6366f1" radius={[4, 4, 0, 0]} name="Dijital (AI)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};