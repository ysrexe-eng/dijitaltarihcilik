import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { year: '2010', digital: 15, physical: 85 },
  { year: '2012', digital: 25, physical: 75 },
  { year: '2014', digital: 35, physical: 65 },
  { year: '2016', digital: 48, physical: 52 },
  { year: '2018', digital: 60, physical: 40 },
  { year: '2020', digital: 75, physical: 25 },
  { year: '2022', digital: 82, physical: 18 },
  { year: '2024', digital: 90, physical: 10 },
];

export const StatsChart: React.FC = () => {
  return (
    <div className="bg-white p-2 md:p-6 rounded-xl shadow-sm border border-slate-200 h-[350px] md:h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorDigital" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="year" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickMargin={10}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            unit="%" 
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', padding: '8px' }}
            itemStyle={{ color: '#fff', fontSize: '12px' }}
          />
          <Area 
            type="monotone" 
            dataKey="digital" 
            stroke="#4f46e5" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorDigital)" 
            name="Dijital"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};