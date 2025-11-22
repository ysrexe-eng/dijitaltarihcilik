import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Belge Tarama', Geleneksel: 120, Dijital: 5 }, // dakika
  { name: 'Arşiv Erişimi', Geleneksel: 4320, Dijital: 2 }, // dakika (3 gün vs 2 dk)
  { name: 'Veri Analizi', Geleneksel: 300, Dijital: 15 },
  { name: 'Paylaşım', Geleneksel: 60, Dijital: 1 },
];

export const ComparisonChart: React.FC = () => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border border-slate-100 my-8 h-[350px] md:h-[450px]">
      <div className="mb-4 md:mb-6">
        <h3 className="text-base md:text-lg font-serif font-bold text-slate-900">Zaman Maliyeti Analizi (Dakika)</h3>
        <p className="text-xs md:text-sm text-slate-500 mt-1">Geleneksel yöntemler ile dijital araçların ortalama işlem süreleri karşılaştırması.</p>
      </div>
      <div className="h-[200px] md:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} interval={0} />
            <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: '#f1f5f9'}}
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="Geleneksel" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Geleneksel (Manuel)" />
            <Bar dataKey="Dijital" fill="#6366f1" radius={[4, 4, 0, 0]} name="Dijital (AI Destekli)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};