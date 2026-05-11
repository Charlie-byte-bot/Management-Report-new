import React, { useState } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Eye, X, Filter } from 'lucide-react';
import { ActionLink, MetricCard, SectionTitle, ThWithFilter } from '../Shared';

const levelData = [
  { name: 'A级创业者', value: 35 },
  { name: 'B级创业者', value: 45 },
  { name: 'C级创业者', value: 80 },
  { name: 'D级创业者', value: 50 },
  { name: 'E级创业者', value: 44 },
];
// "创业者等级分布及企业规模分布的环形图配色保持统一"
const LEVEL_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const generateContributionData = () => {
  return ['A级', 'B级', 'C级', 'D级', 'E级'].map((lvl, i) => {
    const baseContacts = [35, 45, 80, 50, 44][i];
    return {
      level: lvl,
      contacts: baseContacts,
      p1: Math.floor(Math.random() * 20) + 10,
      p2: Math.floor(Math.random() * 20) + 10,
      p3: Math.floor(Math.random() * 20) + 10,
      p4: Math.floor(Math.random() * 20) + 10,
      p5: Math.floor(Math.random() * 15) + 5,
      p6: Math.floor(Math.random() * 15) + 5,
      p7: Math.floor(Math.random() * 10) + 5,
      p8: Math.floor(Math.random() * 10) + 5,
      p9: Math.floor(Math.random() * 10),
      p10: Math.floor(Math.random() * 5),
      p11: Math.floor(Math.random() * 5), // '其他' OR 11th product
    };
  });
};
const contributionData = generateContributionData();

const referralMetrics = [
  { title: '新增转介绍客户数', value: '124', trend: '+1.50%', trendUp: true, tooltip: '以签单公司为统计单位，1 个签单且有介绍人信息的公司算作 1 个客户' },
  { title: '转介绍率', value: '12%', trend: '-0.50%', trendUp: false, tooltip: '=新增转介绍客户数/新增签单客户数' },
  { title: '转介绍续费金额', value: '¥ 1,240,000', trend: '+5.40%', trendUp: true, tooltip: '新增转介绍客户数带来的签单金额' },
  { title: '转介绍续费金额占比', value: '18%', trend: '+1.20%', trendUp: true, tooltip: '=转介绍续费金额/签单金额' },
];

const referralLeaderboard = Array.from({ length: 20 }).map((_, i) => ({
  rank: i + 1,
  name: `创业者 ${i + 1}`,
  level: ['A级', 'B级', 'C级'][i % 3],
  count: Math.max(1, 15 - Math.floor(i / 2)),
  amount: `¥ ${(15 - Math.floor(i / 2)) * 30},000`
}));

const networkMetrics = [
  { title: '关联客户数', value: '56', trend: '+2.10%', trendUp: true, tooltip: '每个创业者关联的公司数求和' },
  { title: '关联转化客户数', value: '28', trend: '+3.50%', trendUp: true, tooltip: '每个创业者关联且转化的公司数求和' },
  { title: '关联转化率', value: '50%', trend: '-1.00%', trendUp: false, tooltip: '=（每个创业者关联且转化的公司数/每个创业者关联的公司数）取平均值' },
  { title: '潜在客户数', value: '15', trend: '+8.00%', trendUp: true, tooltip: '=关联客户数-关联转化客户数' },
];

// Custom Tooltip for Level Donut
const LevelTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = levelData.reduce((acc, curr) => acc + curr.value, 0);
    const pct = ((data.value / total) * 100).toFixed(2);
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 z-50 min-w-[150px]">
        <div className="font-bold mb-2 text-slate-800 text-sm">【{data.name}】</div>
        <div className="text-xs text-slate-500 mb-1">创业者人数：<span className="text-slate-800 font-medium">{data.value}</span></div>
        <div className="text-xs text-slate-500">人数占比：<span className="text-slate-800 font-medium">{pct}%</span></div>
      </div>
    );
  }
  return null;
};

// Custom Tooltip for Contribution Dual Axis
const ContributionTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const contactsPayload = payload.find((p: any) => p.dataKey === 'contacts');
    // Display stacked tooltip data in ascending order of values
    const productsPayload = payload.filter((p: any) => p.dataKey !== 'contacts')
      .sort((a: any, b: any) => a.value - b.value);
    
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100 z-[9999] min-w-[200px]">
        <div className="font-bold mb-2 text-slate-800 border-b border-slate-100 pb-2">{label} 总计</div>
        {contactsPayload && (
          <div className="text-xs text-slate-700 font-medium mb-3">
            {contactsPayload.name}：<span className="text-amber-600 font-bold">{contactsPayload.value}</span> 人
          </div>
        )}
        <div className="space-y-1">
          {productsPayload.map((p: any, i: number) => (
             <div key={i} className="flex items-center justify-between text-xs text-slate-500">
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: p.color }}></div>
                 <span>{p.name}</span>
               </div>
               <span className="font-medium text-slate-700">¥{p.value}k</span>
             </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function Part2Contacts() {
  const [modalState, setModalState] = useState<{type: string, data?: any} | null>(null);

  const totalLevel = levelData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <section className="space-y-3 pt-6">
      <div className="text-xs font-bold text-slate-500 mb-2 border-l-4 border-amber-600 pl-2">2. 创业者分析</div>

      <div className="grid grid-cols-1 gap-3">
        {/* Level Distribution Pie (Full Row) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <SectionTitle 
            title="创业者等级分布" 
            tooltip={
              <div className="space-y-1">
                <div>创业者等级划分规则：</div>
                <div>【A级】创业者关联存续公司（纳税人类别="一般纳税人" 或 参保人数≠0）且 成立年限&gt;=5</div>
                <div>【B级】创业者关联存续公司（纳税人类别="一般纳税人" 或 参保人数≠0）且 成立年限&gt;=3</div>
                <div>【C级】创业者关联存续公司  纳税人类别="一般纳税人" 或 参保人数≠0 或 成立年限&gt;=1</div>
                <div>【D级】创业者关联存续公司  纳税人类别!="一般纳税人" 且 参保人数=0 且 成立年限&lt;1</div>
                <div>【E级】除ABCD等级外，均归为E等级</div>
              </div>
            } 
            action={
              <button 
                onClick={() => setModalState({ type: 'level' })}
                className="text-slate-400 hover:text-amber-500 transition-colors"
                title="查看详情"
              >
                <Eye className="w-4 h-4" />
              </button>
            } 
          />
          <div className="h-[250px] relative w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={LEVEL_COLORS[index]} />
                  ))}
                </Pie>
                <RechartsTooltip content={<LevelTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-[50%] -translate-x-[65px] -translate-y-[15px] flex flex-col items-center justify-center pointer-events-none w-[100px] text-center">
              <span className="text-3xl font-bold text-slate-800">{totalLevel}</span>
              <span className="text-xs text-slate-500 mt-1">总人数</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Contribution Dual Axis Bar (Full Row) */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <SectionTitle 
            title="创业者成交贡献价值" 
            tooltip="不同等级创业者的人数、贡献的签单金额总及各签单产品金额，其中产品仅展示不同等级成交金额top10产品，不在top10的计入“其他产品”" 
            action={
              <button 
                onClick={() => setModalState({ type: 'contribution' })}
                className="text-slate-400 hover:text-amber-500 transition-colors"
                title="查看详情"
              >
                <Eye className="w-4 h-4" />
              </button>
            } 
          />
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={contributionData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis yAxisId="left" orientation="left" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} label={{ value: '签单金额 (k)', angle: -90, position: 'insideLeft', offset: -10, style: { fontSize: 10, fill: '#94a3b8' } }} />
                <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} label={{ value: '创业者人数', angle: 90, position: 'insideRight', offset: -10, style: { fontSize: 10, fill: '#94a3b8' } }} />
                <RechartsTooltip content={<ContributionTooltip />} cursor={{ fill: '#f8fafc' }} />
                
                {['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11'].map((key, idx) => (
                   <Bar 
                     key={key} 
                     yAxisId="left" 
                     dataKey={key} 
                     name={idx === 10 ? '其他产品' : `产品 ${idx + 1}`} 
                     stackId="a" 
                     fill={`hsl(${idx * 30}, 80%, 60%)`} 
                     maxBarSize={20} 
                     radius={idx === 10 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                   />
                ))}

                <Bar yAxisId="right" dataKey="contacts" name="创业者人数" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={20} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Referral Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <SectionTitle title="创业者转介绍价值" />
          <div className="grid grid-cols-2 gap-3 mb-6">
             {referralMetrics.map((m, i) => (
                <MetricCard key={i} {...m} />
             ))}
          </div>
          <h4 className="text-xs font-semibold text-slate-600 mb-3">转介绍人排行榜 Top 20</h4>
          <div className="overflow-x-auto h-[350px] relative border border-slate-100 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 bg-slate-50 uppercase sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-3 py-2 w-12 border-b border-slate-200">排名</th>
                  <th className="px-3 py-2 border-b border-slate-200">创业者</th>
                  <th className="px-3 py-2 border-b border-slate-200">创业者等级</th>
                  <th className="px-3 py-2 text-right border-b border-slate-200">转介绍客户数</th>
                  <th className="px-3 py-2 text-right border-b border-slate-200">转介绍签单金额</th>
                  <th className="px-3 py-2 text-right border-b border-slate-200">操作</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {referralLeaderboard.map((item, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-3 py-2 font-medium">
                      {item.rank <= 3 ? (
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] text-white ${item.rank === 1 ? 'bg-amber-500' : item.rank === 2 ? 'bg-slate-400' : 'bg-amber-700'}`}>
                          {item.rank}
                        </span>
                      ) : (
                        <span className="text-slate-400 pl-1">{item.rank}</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-800 font-medium">{item.name}</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 border border-slate-200">
                        {item.level}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">{item.count}</td>
                    <td className="px-3 py-2 text-right font-medium text-slate-700">{item.amount}</td>
                    <td className="px-3 py-2 text-right font-medium">
                       <ActionLink label="详情" onClick={() => setModalState({ type: 'referral_detail', data: item })} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Network Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <SectionTitle title="创业者关系网价值" />
          <div className="grid grid-cols-2 gap-3 mb-6">
             {networkMetrics.map((m, i) => (
                <MetricCard key={i} {...m} />
             ))}
          </div>
          <h4 className="text-xs font-semibold text-slate-600 mb-3">创业者关系网转化详情</h4>
          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] text-slate-500 bg-slate-50 uppercase">
                <tr>
                  <th className="px-2 py-2">创业者等级</th>
                  <th className="px-2 py-2 text-right">签单客户数</th>
                  <th className="px-2 py-2 text-right">关联客户数</th>
                  <th className="px-2 py-2 text-right">转化客户数</th>
                  <th className="px-2 py-2 text-right">转化率</th>
                  <th className="px-2 py-2 text-right">潜在客户数</th>
                  <th className="px-2 py-2 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {['A级', 'B级', 'C级', 'D级', 'E级'].map((lvl, i) => (
                  <tr key={lvl} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                    <td className="px-2 py-2 font-medium text-slate-700">{lvl}</td>
                    <td className="px-2 py-2 text-right">{20 - i*2}</td>
                    <td className="px-2 py-2 text-right">{12 + (5-i)*3}</td>
                    <td className="px-2 py-2 text-right">{8 + (5-i)*2}</td>
                    <td className="px-2 py-2 text-right text-emerald-600 font-medium">{60 + (5-i)*4}%</td>
                    <td className="px-2 py-2 text-right text-slate-500">{4 + i}</td>
                    <td className="px-2 py-2 text-right font-medium">
                       <ActionLink label="详情" onClick={() => setModalState({ type: 'network_detail', data: lvl })} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalState && (
        <div className="fixed inset-0 bg-slate-900/40 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-base">
                {modalState.type === 'level' && '创业者等级分布明细'}
                {modalState.type === 'contribution' && '创业者成交贡献价值明细'}
                {modalState.type === 'referral_detail' && '转介绍客户明细'}
                {modalState.type === 'network_detail' && '关系网转化明细'}
              </h3>
              <button onClick={() => setModalState(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto w-full">
              {/* LEVEL MODAL */}
              {modalState.type === 'level' && (
                <div className="border border-slate-200 rounded-lg overflow-hidden w-full h-[400px] overflow-y-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-xs sticky top-0 z-10 shadow-sm">
                      <tr>
                        <ThWithFilter>创业者等级</ThWithFilter>
                        <ThWithFilter>创业者</ThWithFilter>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Array.from({ length: 30 }).map((_, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-800">{['A级', 'B级', 'C级', 'D级', 'E级'][idx % 5]}</td>
                          <td className="px-4 py-3 text-slate-600">创业者 {idx + 1}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CONTRIBUTION MODAL */}
              {modalState.type === 'contribution' && (
                <div className="border border-slate-200 rounded-lg overflow-hidden w-full h-[400px] overflow-y-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-xs sticky top-0 z-10 shadow-sm">
                      <tr>
                        <ThWithFilter>创业者</ThWithFilter>
                        <ThWithFilter>创业者等级</ThWithFilter>
                        <ThWithFilter>公司</ThWithFilter>
                        <ThWithFilter>产品</ThWithFilter>
                        <th className="px-4 py-3 font-medium text-right">签单金额</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Array.from({ length: 30 }).map((_, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-800 font-medium">创业者 {idx + 1}</td>
                          <td className="px-4 py-3 text-slate-600">{['A级', 'B级', 'C级', 'D级', 'E级'][idx % 5]}</td>
                          <td className="px-4 py-3 text-slate-600">测试公司 {idx + 1}</td>
                          <td className="px-4 py-3 text-slate-600">产品 {idx % 10 + 1}</td>
                          <td className="px-4 py-3 text-slate-800 font-medium text-right">¥ {120 - idx * 2},000</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* REFERRAL MODAL */}
              {modalState.type === 'referral_detail' && (
                <div className="border border-slate-200 rounded-lg overflow-hidden w-full h-[400px] overflow-y-auto">
                  <div className="p-3 bg-white border-b border-slate-100 text-sm text-slate-600 sticky top-0 z-20">
                    当前查询： <span className="font-bold text-amber-600">{modalState.data?.name}</span> ({modalState.data?.level})
                  </div>
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-xs sticky top-11 z-10 shadow-sm">
                      <tr>
                        <ThWithFilter>公司</ThWithFilter>
                        <th className="px-4 py-3 font-medium text-right">签单金额</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Array.from({ length: 15 }).map((_, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-800">转介绍被邀请公司 {idx + 1}</td>
                          <td className="px-4 py-3 text-right font-medium text-slate-600">¥ {(20-idx)*15},000</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* NETWORK MODAL */}
              {modalState.type === 'network_detail' && (
                <div className="border border-slate-200 rounded-lg overflow-hidden w-full h-[400px] overflow-y-auto">
                  <div className="p-3 bg-white border-b border-slate-100 text-sm text-slate-600 sticky top-0 z-20">
                    当前查询等级： <span className="font-bold text-amber-600">{modalState.data}</span>
                  </div>
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-xs sticky top-11 z-10 shadow-sm">
                      <tr>
                        <ThWithFilter>创业者</ThWithFilter>
                        <ThWithFilter>创业者等级</ThWithFilter>
                        <ThWithFilter>关联客户</ThWithFilter>
                        <ThWithFilter>是否成交</ThWithFilter>
                        <ThWithFilter>是否跟进</ThWithFilter>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {Array.from({ length: 15 }).map((_, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-800 font-medium">网络创业者 {idx + 1}</td>
                          <td className="px-4 py-3 text-slate-600">{modalState.data}</td>
                          <td className="px-4 py-3 text-slate-600">被关联客户 {idx + 1} 公司</td>
                          <td className="px-4 py-3">
                            {idx % 2 === 0 ? <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium">是</span> : <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded text-[11px]">否</span>}
                          </td>
                          <td className="px-4 py-3">
                            {idx % 2 !== 0 ? <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium">是</span> : <span className="text-slate-400 bg-slate-100 px-2 py-0.5 rounded text-[11px]">否</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 flex justify-start text-xs text-slate-500">
                数据展示为模拟环境，仅供参考...
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
