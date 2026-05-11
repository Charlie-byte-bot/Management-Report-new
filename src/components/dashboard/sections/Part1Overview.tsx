import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Treemap } from 'recharts';
import { Eye, X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { MetricCard, SectionTitle } from '../Shared';

// 更新后的趋势值均保留两位小数
const metrics = [
  { label: '总客户数', value: '456', tooltip: '以签单公司为统计单位，1 个签单公司算作 1 个客户，历史累计值，仅展示最新统计的值' },
  { label: '累计签单金额', value: '¥ 12,450,000', tooltip: '历史累计签单金额，仅展示最新统计的值' },
  { label: '累计实收金额', value: '¥ 9,800,000', tooltip: '历史累计实收金额，仅展示最新统计的值' },
  { label: '签单金额', value: '¥ 450,000', trend: '+12.50%', positive: true },
  { label: '实收金额', value: '¥ 420,000', trend: '+8.30%', positive: true },
  { label: '服务中的客户数', value: '210', trend: '-3.20%', positive: false, tooltip: '以签单公司为统计单位，1 个签单且在服务中的公司算作 1 个客户' },
  { label: '未来3个月到期客户数', value: '45', trend: '+1.50%', positive: null, tooltip: '以签单公司为统计单位，未来3个月不包含当前月' },
  { label: '新增签单客户数', value: '18', trend: '+2.00%', positive: true, tooltip: '以签单公司为统计单位，1 个签单公司算作 1 个客户' },
  { label: '到期未续费客户数', value: '3', trend: '-1.00%', positive: true, tooltip: '以签单公司为统计单位，1 个签单且所有产品均到期且未续费的公司算作 1 个客户' },
  { label: '解约归档客户数', value: '2', trend: '0.00%', positive: null, tooltip: '以签单公司为统计单位，1 个签过单且归档了的公司算作 1 个客户' },
];

const industryData = [
  { name: '租赁和商务服务业', size: 120 },
  { name: '信息传输、软件和信息技术服务业', size: 90 },
  { name: '批发和零售业', size: 80 },
  { name: '制造业', size: 60 },
  { name: '建筑业', size: 50 },
  { name: '科学研究和技术服务业', size: 45 },
  { name: '房地产业', size: 40 },
  { name: '农、林、牧、渔业', size: 30 },
  { name: '交通运输、仓储和邮政业', size: 25 },
  { name: '教育', size: 20 },
  // 省略了一些占比较小的以防热力区域过多太碎，作为数据演示即可
  { name: '其他', size: 40 },
];

const COLORS = ['#15326b', '#2563eb', '#3b82f6', '#60a5fa', '#f59e0b', '#d97706'];

const sizeData = [
  { name: '微型企业', value: 120 },
  { name: '小型企业', value: 80 },
  { name: '中型企业', value: 30 },
  { name: '大型企业', value: 24 },
];
const SIZE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const CustomizedContent = (props: any) => {
  const { root, depth, x, y, width, height, index, payload, colors, rank, name } = props;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth < 2 ? colors[Math.floor((index / root.children.length) * 6)] : '#ffffff00',
          stroke: '#fff',
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {width > 50 && height > 30 && (
        <text x={x + 8} y={y + 18} fill="#fff" fontSize={12} fontWeight={500}>
          {name}
        </text>
      )}
    </g>
  );
};

// Tooltip for Treemap (Industry)
const IndustryTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = industryData.reduce((acc, curr) => acc + curr.size, 0);
    const pct = ((data.size / total) * 100).toFixed(2);
    return (
      <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-xl relative z-[9999] border border-slate-700 min-w-[150px]">
        <div className="font-bold mb-2 text-sm text-amber-400">【{data.name}】</div>
        <div className="text-xs text-slate-300 mb-1">客户数：<span className="text-white font-medium">{data.size}</span></div>
        <div className="text-xs text-slate-300">客户占比：<span className="text-white font-medium">{pct}%</span></div>
      </div>
    );
  }
  return null;
};

// Tooltip for PieChart (Size)
const SizeTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = sizeData.reduce((acc, curr) => acc + curr.value, 0);
    const pct = ((data.value / total) * 100).toFixed(2);
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 z-50 min-w-[150px]">
        <div className="font-bold mb-2 text-slate-800 text-sm">【{data.name}】</div>
        <div className="text-xs text-slate-500 mb-1">客户数：<span className="text-slate-800 font-medium">{data.value}</span></div>
        <div className="text-xs text-slate-500">客户占比：<span className="text-slate-800 font-medium">{pct}%</span></div>
      </div>
    );
  }
  return null;
};

export default function Part1Overview() {
  const [modalType, setModalType] = useState<string | null>(null);

  const totalSize = sizeData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <section className="space-y-3">
      <div className="text-xs font-bold text-slate-500 mb-2 border-l-4 border-accent pl-2">1. 核心概览及客户画像</div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-5 bg-white rounded-xl p-4 shadow-sm border border-slate-200 gap-3">
        {metrics.map((m, i) => (
          <MetricCard key={i} title={m.label} value={m.value} trend={m.trend} positive={m.positive} tooltip={m.tooltip} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Industry Treemap */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col relative">
          <SectionTitle 
            title="企业行业分布" 
            tooltip="签单客户所属行业分布情况" 
            action={
              <button 
                onClick={() => setModalType('industry')}
                className="text-slate-400 hover:text-amber-500 transition-colors"
                title="查看详情"
              >
                <Eye className="w-4 h-4" />
              </button>
            } 
          />
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={industryData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomizedContent colors={COLORS} />}
              >
                <RechartsTooltip content={<IndustryTooltip />} cursor={false} />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Size Donut */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col relative">
          <SectionTitle 
            title="企业规模分布" 
            tooltip="签单客户行业规模分布情况" 
            action={
              <button 
                onClick={() => setModalType('size')}
                className="text-slate-400 hover:text-amber-500 transition-colors"
                title="查看详情"
              >
                <Eye className="w-4 h-4" />
              </button>
            } 
          />
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sizeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {sizeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SIZE_COLORS[index % SIZE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<SizeTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-slate-800">{totalSize}</span>
              <span className="text-xs text-slate-500 mt-1">总计(家)</span>
            </div>
            
            {/* Custom Legend */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {sizeData.map((entry, index) => (
                 <div key={index} className="flex items-center gap-2 text-sm">
                   <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: SIZE_COLORS[index] }}></div>
                   <span className="text-slate-600">{entry.name}</span>
                   <span className="font-semibold ml-2">{entry.value}</span>
                 </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/40 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-base">
                {modalType === 'industry' ? '企业行业分布明细' : '企业规模分布明细'}
              </h3>
              <button onClick={() => setModalType(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 font-medium">公司</th>
                      <th className="px-4 py-3 font-medium">
                        {modalType === 'industry' ? '所属行业' : '企业规模'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[1, 2, 3, 4, 5, 6, 7].map((idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">财宝科技 {idx} 公司</td>
                        <td className="px-4 py-3 text-slate-600">
                          {modalType === 'industry' ? '信息传输、软件和信息技术服务业' : '中型企业'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-start text-xs text-slate-500">
                共展示 7 条示例数据
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
