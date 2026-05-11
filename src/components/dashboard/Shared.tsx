import React, { ReactNode, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Filter, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

export function SectionTitle({ title, tooltip, action }: { title: string, tooltip?: ReactNode, action?: ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-1">
        <h3 className="text-xs font-bold text-slate-600">{title}</h3>
        {tooltip && (
          <div className="relative flex items-center group/tooltip">
            <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 w-max max-w-[250px] p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-[100] text-left whitespace-normal leading-relaxed pointer-events-none">
              {tooltip}
              <div className="absolute top-full left-1.5 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function ThWithFilter({ children, active, className }: { children: ReactNode, active?: boolean, className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <th className={cn("px-4 py-3 font-medium cursor-pointer hover:bg-slate-100 transition-colors relative", className)} onClick={() => setOpen(!open)}>
      <div className="flex items-center gap-1.5">
        {children}
        <Filter className={cn("w-3 h-3 text-slate-400", active && "text-slate-800 fill-slate-800")} />
      </div>
      {open && (
        <div className="absolute top-full left-0 mt-1 w-32 bg-white shadow-lg border border-slate-200 rounded-md z-50 p-2 text-xs font-normal text-slate-600">
          <div className="flex items-center gap-2 py-1"><input type="checkbox" checked readOnly/> 全选</div>
          <div className="flex items-center gap-2 py-1"><input type="checkbox" checked readOnly/> 选项 1</div>
          <div className="flex items-center gap-2 py-1"><input type="checkbox" checked readOnly/> 选项 2</div>
        </div>
      )}
    </th>
  );
}

export function MetricCard({ title, value, trend, trendUp, positive, tooltip }: any) {
  const isPositive = positive !== undefined ? positive : trendUp;
  return (
    <div className="bg-slate-50 p-2 md:p-3 rounded-lg flex flex-col justify-between h-full">
      <div className="flex items-center gap-1 mb-1">
        <div className="text-[10px] md:text-[11px] text-slate-500">{title}</div>
        {tooltip && (
          <div className="group relative flex items-center">
             <div className="w-3 h-3 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px] font-bold cursor-help pt-px">!</div>
             <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100] whitespace-pre-wrap text-left">
               {tooltip}
               <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
             </div>
          </div>
        )}
      </div>
      <div className="flex items-end justify-between mt-1 h-full">
        <div className="text-lg md:text-xl font-bold text-slate-900 font-mono leading-none">{value}</div>
        {trend && (
          <div className="group relative flex items-center">
            <div className={cn(
              "flex items-center text-[10px] font-medium px-1 py-0.5 rounded",
              isPositive === true ? "text-emerald-600 bg-emerald-50" : isPositive === false ? "text-rose-600 bg-rose-50" : "text-slate-500 bg-slate-100"
            )}>
              {isPositive === true && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
              {isPositive === false && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
              {trend}
            </div>
            {/* Tooltip for MoM */}
            <div className="absolute bottom-full right-0 mb-2 w-max bg-slate-800 text-white text-[10px] p-1.5 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
               环比变化
               <div className="absolute top-full right-4 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const ActionLink = ({ label, onClick }: { label: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="inline-flex items-center gap-0.5 text-amber-500 hover:text-amber-600 font-medium whitespace-nowrap text-xs transition-colors"
  >
    <span>{label}</span>
    <ExternalLink className="w-3.5 h-3.5" />
  </button>
);
