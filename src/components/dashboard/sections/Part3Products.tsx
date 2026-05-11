import React, { useState } from 'react';
import { 
  Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import { Eye, X, Info } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { ActionLink, MetricCard, SectionTitle, ThWithFilter } from '../Shared';

// --- Rank Data Generation ---
const generateRankData = (filter: 'all' | 'daizhang' | 'other') => {
  return Array.from({ length: 20 }).map((_, i) => ({
    name: `${filter === 'all' ? '热门' : filter === 'daizhang' ? '代账' : '非代账'}产品 ${i + 1}`,
    amount: (20 - i) * 100 + Math.floor(Math.random() * 50),
    type: filter === 'all' && i % 4 === 0 ? 'package' : 'single' // Only "all" has package products
  }));
};
const rankDataMap = {
  all: generateRankData('all'),
  daizhang: generateRankData('daizhang'),
  other: generateRankData('other')
};

// --- Other Data ---
const prodSummaryData = Array.from({ length: 20 }).map((_, i) => ({
  name: i === 0 ? '财税管家旗舰版' : i === 1 ? '代理记账-小规模(年)' : i === 2 ? '税务筹划咨询' : `其他组合产品 ${i+1}`,
  clients: 500 - i * 15,
  penetration: `${95 - i}%`,
  amount: (10000000 - i * 400000).toLocaleString()
}));

const renewalMetrics = [
  { title: '续费金额', value: '450万', trend: '+12.00%', trendUp: true },
  { title: '续费金额占比', value: '45%', trend: '+2.10%', trendUp: true, tooltip: '=续费金额/签单金额' },
  { title: '按时续费客户数', value: '180', trend: '-1.50%', trendUp: false, tooltip: '以签单公司为统计单位，1 个签单且续费的公司算作 1 个客户' },
  { title: '按时续费率', value: '85%', trend: '+5.00%', trendUp: true, tooltip: '=按时续费客户数/到期客户数' },
  { title: '总续费率', value: '92%', trend: '+1.50%', trendUp: true, tooltip: '=续费客户数/到期客户数，包含提前续费、按时续费和滞后续费三种续费场景' },
];

const heatmapProds = Array.from({ length: 10 }).map((_, i) => `单品${String.fromCharCode(65 + i)}`);
const getHeatmapColor = (intensity: number) => {
  if (intensity === -1) return 'bg-slate-100'; // diagonal
  if (intensity < 10) return 'bg-blue-50';
  if (intensity < 30) return 'bg-blue-200';
  if (intensity < 60) return 'bg-blue-400 text-white';
  return 'bg-blue-600 text-white';
};
const heatmapData = [
  [-1, 85, 20, 5, 40, 12, 60, 25, 10, 8],
  [85, -1, 10, 0, 95, 5, 15, 30, 20, 11],
  [20, 10, -1, 15, 5, 50, 80, 5, 2, 0],
  [5, 0, 15, -1, 30, 5, 10, 85, 20, 15],
  [40, 95, 5, 30, -1, 10, 5, 0, 60, 70],
  [12, 5, 50, 5, 10, -1, 20, 45, 15, 5],
  [60, 15, 80, 10, 5, 20, -1, 10, 5, 0],
  [25, 30, 5, 85, 0, 45, 10, -1, 20, 30],
  [10, 20, 2, 20, 60, 15, 5, 20, -1, 50],
  [8, 11, 0, 15, 70, 5, 0, 30, 50, -1],
];

// Modal cross-purchase mock data (100 items represented briefly)
const generateCrossPurchaseData = () => {
  return Array.from({ length: 30 }).map((_, i) => ({ // Just generate 30 for DOM performance, UI says "100" as example
    id: i + 1,
    prodA: heatmapProds[Math.floor(i / 10) % 10],
    prodB: heatmapProds[i % 10],
    crossCount: Math.floor(Math.random() * 200),
    crossPct: `${Math.floor(Math.random() * 80 + 10)}%`
  }));
};
const crossPurchaseTableData = generateCrossPurchaseData();

export default function Part3Products() {
  const [activeTab, setActiveTab] = useState<'all' | 'daizhang' | 'other'>('all');
  const [modalState, setModalState] = useState<{type: string, title?: string, data?: any} | null>(null);

  const currentRankData = rankDataMap[activeTab];
  const maxRankAmount = Math.max(...currentRankData.map(d => d.amount));

  return (
    <section className="space-y-3 pt-6">
      <div className="text-xs font-bold text-slate-500 mb-2 border-l-4 border-amber-600 pl-2">3. 产品分析</div>

      <div className="grid grid-cols-2 gap-3">
        {/* Product Ranking */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <SectionTitle 
            title="产品签单金额排行榜 Top 20" 
            tooltip={
              <div className="space-y-1">
                <div>【全部产品】按SPU粒度统计签单金额排名，含套餐产品</div>
                <div>【代账类】【非代账类】按SKU粒度统计签单金额排名，不含套餐产品，仅单品</div>
              </div>
            }
            action={
              <div className="flex bg-slate-100 p-0.5 rounded-lg">
                {[{ id: 'all', label: '全部产品' }, { id: 'daizhang', label: '代账类' }, { id: 'other', label: '非代账类' }].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                      activeTab === tab.id ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            }
          />
          <div className="flex-1 overflow-y-auto pr-2 max-h-[350px] space-y-3">
            {currentRankData.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono w-4">{idx + 1}.</span>
                    <span className="text-slate-700 font-medium">{item.name}</span>
                    {item.type === 'package' ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 border border-blue-200">套餐</span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-700 border border-amber-200">单品</span>
                    )}
                  </div>
                  <span className="text-slate-600 font-medium">¥ {item.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500", item.type === 'package' ? "bg-blue-500" : "bg-amber-500")}
                    style={{ width: `${(item.amount / maxRankAmount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col group relative">
          <SectionTitle 
            title="产品交叉购买热力图" 
            tooltip="签单次数top10的单品产品交叉购买的关联度，颜色越深代表一起购买的客户占比越大"
            action={
              <button 
                onClick={() => setModalState({ type: 'heatmap', title: '产品交叉购买数据 (100个产品示例)' })}
                className="text-slate-400 hover:text-amber-500 transition-colors"
                title="查看详情列表"
              >
                <Eye className="w-4 h-4" />
              </button>
            }
          />
          <div className="flex-1 flex flex-col justify-center">
            {/* Header Row */}
            <div className="flex text-xs text-slate-500 font-medium mb-1">
              <div className="w-16 shrink-0"></div>
              {heatmapProds.map((p, i) => (
                <div key={i} className="flex-1 text-center truncate px-[1px] text-[10px]" title={p}>{p}</div>
              ))}
            </div>
            {/* Grid */}
            {heatmapProds.map((pY, rowIdx) => (
              <div key={rowIdx} className="flex mb-[2px] items-stretch h-6 sm:h-7">
                <div className="w-16 shrink-0 text-[10px] text-slate-600 flex items-center pr-1 font-medium truncate" title={pY}>
                  {pY}
                </div>
                {heatmapData[rowIdx].map((val, colIdx) => (
                  <div key={colIdx} className="flex-1 p-[1px]">
                     <div 
                        className={cn(
                          "w-full h-full flex items-center justify-center text-[9px] sm:text-[10px] rounded-[2px] transition-colors cursor-default hover:opacity-80 hover:ring-1 ring-slate-400", 
                          getHeatmapColor(val)
                        )}
                        title={val === -1 ? '不适用' : `购买${pY}的所有客户中，有${val}%购买了${heatmapProds[colIdx]}`}
                     >
                        {val === -1 ? <span className="text-slate-300">/</span> : `${val}%`}
                     </div>
                  </div>
                ))}
              </div>
            ))}
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-slate-500">
              <span>低关联度</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-blue-50 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-200 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-600 rounded-sm"></div>
              </div>
              <span>高关联度</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Table */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <SectionTitle 
          title="产品签单明细" 
        />
        <div className="overflow-x-auto rounded-lg border border-slate-100 max-h-[300px]">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-slate-500 bg-slate-50 uppercase border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-medium">产品名称</th>
                <th className="px-4 py-3 font-medium text-right">签单客户数</th>
                <th className="px-4 py-3 font-medium text-right">
                  <div className="flex items-center justify-end gap-1">
                    客户渗透率
                    <Info className="w-3 h-3 text-slate-400 group-hover:text-slate-600" title="该产品签单的客户数/总签单客户数" />
                  </div>
                </th>
                <th className="px-4 py-3 font-medium text-right">签单金额</th>
                <th className="px-4 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {prodSummaryData.slice(0, 5).map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 text-right">{item.clients}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{item.penetration}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-700">¥ {item.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <ActionLink label="详情" onClick={() => setModalState({ type: 'buyers', title: `产品购买客户列表 - ${item.name}` })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renewal Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <SectionTitle 
          title="续费分析" 
        />
        <div className="grid grid-cols-5 gap-3 mb-6">
           {renewalMetrics.map((m, i) => (
              <MetricCard key={i} {...m} />
           ))}
        </div>
        
        <h4 className="text-xs font-bold text-slate-600 mb-2 mt-4">续费产品排行（按续费客户数 Top 20）</h4>
        <div className="overflow-x-auto rounded-lg border border-slate-100 max-h-[350px]">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-slate-500 bg-slate-50 uppercase border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-medium w-16 text-center">排名</th>
                <th className="px-4 py-3 font-medium">产品名称</th>
                <th className="px-4 py-3 font-medium text-right">续费客户数</th>
                <th className="px-4 py-3 font-medium text-right">续费金额</th>
                <th className="px-4 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {prodSummaryData.slice(0, 20).map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 text-center">
                    {i < 3 ? (
                      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] text-white ${i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : 'bg-amber-700'}`}>
                        {i + 1}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">{i + 1}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                  <td className="px-4 py-3 text-right">{Math.floor(item.clients * 0.8)}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-700">¥ {Math.floor(parseInt(item.amount.replace(/,/g, '')) * 0.8).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <ActionLink label="详情" onClick={() => setModalState({ type: 'renewal_detail', title: `产品续费客户明细 - ${item.name}` })} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modalState && (
        <div className="fixed inset-0 bg-slate-900/40 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-base">{modalState.title}</h3>
              <button onClick={() => setModalState(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto w-full">
              {/* CROSS PURCHASE TABLE (Heatmap modal) */}
              {modalState.type === 'heatmap' && (
                <div className="border border-slate-200 rounded-lg overflow-hidden w-full h-[400px] overflow-y-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-xs sticky top-0 z-10 shadow-sm">
                      <tr>
                        <ThWithFilter>产品 A</ThWithFilter>
                        <ThWithFilter>产品 B</ThWithFilter>
                        <th className="px-4 py-3 font-medium text-right">购买客户数（重合）</th>
                        <th className="px-4 py-3 font-medium text-right">交叉关联度</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {crossPurchaseTableData.map((d, i) => (
                        <tr key={i} className="hover:bg-slate-50 text-xs">
                          <td className="px-4 py-3 font-medium text-slate-800">{d.prodA}</td>
                          <td className="px-4 py-3 font-medium text-slate-800">{d.prodB}</td>
                          <td className="px-4 py-3 text-right text-slate-600">{d.crossCount}</td>
                          <td className="px-4 py-3 text-right text-emerald-600 font-medium">{d.crossPct}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CLIENT LIST (Buy & Renewal) */}
              {(modalState.type === 'buyers' || modalState.type === 'renewal_detail') && (
                <div className="border border-slate-200 rounded-lg overflow-hidden w-full h-[400px] overflow-y-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-[11px] sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-4 py-3 font-medium w-16 text-center">序号</th>
                        <ThWithFilter>公司</ThWithFilter>
                        <ThWithFilter>创业者</ThWithFilter>
                        <th className="px-4 py-3 font-medium text-right">签单金额</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-center text-slate-400">{idx}</td>
                          <td className="px-4 py-3 font-medium text-slate-800">目标客户公司 {idx}</td>
                          <td className="px-4 py-3 text-slate-600">创业者 {idx}</td>
                          <td className="px-4 py-3 text-right font-medium text-slate-600">¥ {Math.floor(Math.random()*10)*10+10},000</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 flex justify-start text-xs text-slate-500">
                数据为演示示例
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
