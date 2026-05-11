import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Info, FileText, X } from 'lucide-react';
import Part1Overview from './sections/Part1Overview';
import Part2Contacts from './sections/Part2Contacts';
import Part3Products from './sections/Part3Products';
import Part4Churn from './sections/Part4Churn';
import { cn } from '../../lib/utils';

export default function DashboardContent() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5);
  const [showDefModal, setShowDefModal] = useState(false);

  // 假设当前时间是 2026-05-10
  const isCurrentIncompleteMonth = year === 2026 && month === 5;

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-4 pb-20">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">管理报表</h1>
          <p className="text-xs text-slate-500 mt-1">成交客户数据洞察及价值挖掘</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">数据更新时间:</span>
            <span className="font-medium text-slate-800">2026-05-10 10:00:00</span>
          </div>
          <button 
            onClick={() => setShowDefModal(true)}
            className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md hover:bg-amber-100 transition-colors border border-amber-200 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" /> 看板说明
          </button>
        </div>
      </div>

      {/* Global Time Filter */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-5">
           {/* Year */}
           <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">数据区间:</span>
              <div className="flex items-center border border-slate-200 rounded text-xs overflow-hidden h-7">
                <button onClick={() => { setYear(y => y - 1); setMonth(1); }} className="px-2 h-full bg-slate-50 hover:bg-slate-100 text-slate-600 border-r border-slate-200 transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
                <div className="px-3 font-medium bg-white w-[50px] text-center">{year}</div>
                <button onClick={() => { setYear(y => Math.min(2026, y + 1)); setMonth(1); }} disabled={year >= 2026} className="px-2 h-full bg-slate-50 hover:bg-slate-100 text-slate-600 border-l border-slate-200 transition-colors disabled:opacity-50"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
           </div>
           
           {/* Months */}
           <div className="flex gap-0.5 bg-slate-50 border border-slate-200 p-0.5 rounded h-7">
             {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => {
               const isDisabled = year === 2026 && m > 5;
               return (
                 <button 
                  key={m}
                  onClick={() => !isDisabled && setMonth(m)}
                  disabled={isDisabled}
                  className={cn(
                    "w-8 h-full text-[11px] rounded transition-colors flex items-center justify-center font-medium",
                    month === m && !isDisabled ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600',
                    isDisabled ? 'opacity-30 cursor-not-allowed bg-transparent' : 'hover:bg-slate-200'
                  )}
                 >
                   {m}月
                 </button>
               );
             })}
           </div>
        </div>

        {/* Status Tip */}
        <div className="w-[300px]">
          {isCurrentIncompleteMonth && (
            <div className="flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-50 px-3 py-1.5 rounded border border-amber-100 justify-end w-fit ml-auto">
              <Info className="w-3.5 h-3.5 flex-shrink-0" />
              未过完月份，数据统计该月 1 日~T+1 日数据并展示
            </div>
          )}
        </div>
      </div>

      <Part1Overview />
      <Part2Contacts />
      <Part3Products />
      <Part4Churn />

      {/* Data Definition Modal */}
      {showDefModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-base">看板说明</h3>
              <button onClick={() => setShowDefModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600">
              <div>
                 <h4 className="font-semibold text-slate-800 mb-1">1. 更新频率</h4>
                 <p>看板数据支持 T+1 更新，即用户今日可查看截至昨日晚 24:00 产生的所有数据变化。</p>
              </div>
              <div>
                 <h4 className="font-semibold text-slate-800 mb-1">2. 环比计算公式</h4>
                 <p>环比 = (本期数值 - 上期数值) / 上期数值 * 100%。本看板统一保留小数点后两位。</p>
              </div>
              <div>
                 <h4 className="font-semibold text-slate-800 mb-1">3. 客户定义</h4>
                 <p>以签单公司为统计单位，1 个签单公司算作 1 个客户</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button onClick={() => setShowDefModal(false)} className="px-4 py-1.5 bg-slate-800 text-white rounded font-medium text-sm hover:bg-slate-700 transition-colors">
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
