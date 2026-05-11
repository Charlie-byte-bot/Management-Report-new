import React, { useState } from 'react';
import { 
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Info, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { ActionLink, SectionTitle, ThWithFilter } from '../Shared';

const warningData = [
  { level: 'A级创业者', clients: 12, amount: 450 },
  { level: 'B级创业者', clients: 18, amount: 320 },
  { level: 'C级创业者', clients: 45, amount: 500 },
  { level: 'D级创业者', clients: 25, amount: 150 },
  { level: 'E级创业者', clients: 10, amount: 80 },
];

const churnTypeData = [
  { name: '到期', value: 45 },
  { name: '切户', value: 25 },
  { name: '内部注销', value: 15 },
  { name: '外部注销', value: 10 },
  { name: '封账', value: 5 },
  { name: '其他', value: 2 },
];
// Sync with enterprise size colors
const CHURN_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#cbd5e1'];

const churnDetailsData = [
  { type: '到期', count: 45, percentage: '44%', totalAmount: '¥ 1,200,000', frequency: 120 },
  { type: '切户', count: 25, percentage: '24.5%', totalAmount: '¥ 850,000', frequency: 65 },
  { type: '内部注销', count: 15, percentage: '14.7%', totalAmount: '¥ 450,000', frequency: 32 },
  { type: '外部注销', count: 10, percentage: '9.8%', totalAmount: '¥ 210,000', frequency: 21 },
  { type: '封账', count: 5, percentage: '4.9%', totalAmount: '¥ 120,000', frequency: 12 },
  { type: '其他', count: 2, percentage: '2%', totalAmount: '¥ 45,000', frequency: 5 },
];

export default function Part4Churn() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeType, setActiveType] = useState('');

  const openModal = (type: string) => {
    setActiveType(type);
    setModalOpen(true);
  };

  return (
    <section className="space-y-3 pt-6">
      <div className="text-xs font-bold text-slate-500 mb-2 border-l-4 border-amber-600 pl-2">4. 流失预警及分析</div>

      <div className="grid grid-cols-2 gap-3">
        {/* Warning Chart */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <SectionTitle 
            title="未来3个月到期客户及到期金额" 
          />
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={warningData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis yAxisId="left" orientation="left" stroke="#15326b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} label={{ value: '创业者个数', angle: -90, position: 'insideLeft', offset: -10, style: { fontSize: 10, fill: '#94a3b8' } }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f43f5e" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `¥${val}k`} label={{ value: '预到期金额(k)', angle: 90, position: 'insideRight', offset: -10, style: { fontSize: 10, fill: '#94a3b8' } }} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  cursor={{ fill: '#fef2f2' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar yAxisId="left" dataKey="clients" name="创业者个数" fill="#15326b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar yAxisId="right" dataKey="amount" name="预到期金额" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Churn Pie */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <SectionTitle 
            title="解约归档客户分布" 
          />
          <div className="flex-1 min-h-[300px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={churnTypeData}
                  cx="40%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {churnTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHURN_COLORS[index % CHURN_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
             {/* Center Text */}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-[20%]">
              <span className="text-3xl font-bold text-slate-800">102</span>
              <span className="text-xs text-slate-500 mt-1">解约总数</span>
            </div>
            {/* Custom Legend (Right side) */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 max-h-full overflow-y-auto">
              {churnTypeData.map((entry, index) => (
                 <div key={index} className="flex items-center text-sm w-32">
                   <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: CHURN_COLORS[index] }}></div>
                   <span className="text-slate-600 ml-2 truncate" title={entry.name}>{entry.name}</span>
                   <span className="font-medium ml-auto">{entry.value}</span>
                 </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Churn Details Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <SectionTitle 
          title="解约归档客户详情" 
        />
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-100">
              <tr>
                <th className="px-4 py-3 font-medium">解约归档类型</th>
                <th className="px-4 py-3 font-medium text-right">客户数</th>
                <th className="px-4 py-3 font-medium text-right">客户数占比</th>
                <th className="px-4 py-3 font-medium text-right">累计签单金额</th>
                <th className="px-4 py-3 font-medium text-right">累计签单次数</th>
                <th className="px-4 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {churnDetailsData.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium flex items-center gap-2 text-slate-700">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHURN_COLORS[i] }}></span>
                    {item.type}
                  </td>
                  <td className="px-4 py-3 text-right">{item.count}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.percentage}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-700">{item.totalAmount}</td>
                  <td className="px-4 py-3 text-right">{item.frequency}</td>
                  <td className="px-4 py-3 text-right font-medium">
                    <ActionLink label="详情" onClick={() => openModal(item.type)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       {/* Modal */}
       {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex flex-col">
                <h3 className="font-semibold text-slate-800 text-lg">解约归档明细</h3>
                <span className="text-sm text-slate-500 mt-0.5">筛选类型: {activeType}</span>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto w-full h-[400px]">
              <div className="border border-slate-200 rounded-lg overflow-hidden h-full overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 sticky top-0 z-10 shadow-sm text-xs uppercase">
                    <tr>
                      <ThWithFilter>公司</ThWithFilter>
                      <ThWithFilter>创业者</ThWithFilter>
                      <ThWithFilter>归档原因</ThWithFilter>
                      <ThWithFilter>跟进人</ThWithFilter>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-slate-800 font-medium">流失公司客户 {idx}</td>
                        <td className="px-4 py-3 text-slate-600">创业者 {idx}</td>
                        <td className="px-4 py-3"><span className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100 text-xs">{activeType}</span></td>
                        <td className="px-4 py-3 text-slate-600">服务代表 {idx}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-start text-sm text-slate-500">
                共 12 条记录
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
