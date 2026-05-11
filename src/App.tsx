/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  Settings, 
  Users, 
  Search,
  ChevronDown,
  Building2,
  ChevronRight,
  MonitorPlay,
  Briefcase,
  HeadphonesIcon
} from 'lucide-react';
import { cn } from './lib/utils';
import DashboardContent from './components/dashboard/DashboardContent';
import OrgSelector from './components/dashboard/OrgSelector';

export default function App() {
  const [activeTopTab, setActiveTopTab] = useState('reports');
  const [activeSideTab, setActiveSideTab] = useState('management');
  const [orgId, setOrgId] = useState('grp-1');

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans h-screen overflow-hidden">
      {/* Top Navigation */}
      <header className="h-14 bg-[#1E293B] border-b border-amber-600/30 flex items-center px-4 shrink-0 z-20 relative">
        <div className="flex items-center gap-2 mr-12">
          <div className="w-8 h-8 bg-[#f59e0b] rounded flex items-center justify-center text-slate-900 font-bold text-lg leading-none">
            财
          </div>
          <span className="font-bold text-lg tracking-tight text-[#f59e0b]">财宝科技</span>
        </div>
        
        <nav className="flex items-center h-full gap-1">
          <button 
            onClick={() => setActiveTopTab('crm')}
            className={cn("px-6 h-full flex items-center gap-2 text-slate-400 hover:text-white transition-colors", activeTopTab === 'crm' && "text-[#f59e0b] border-b-2 border-[#f59e0b] bg-white/5 font-semibold hover:text-[#f59e0b]")}
          >
            <Users className="w-4 h-4" /> CRM
          </button>
          <button 
            onClick={() => setActiveTopTab('reports')}
            className={cn("px-6 h-full flex items-center gap-2 text-slate-400 hover:text-white transition-colors", activeTopTab === 'reports' && "text-[#f59e0b] border-b-2 border-[#f59e0b] bg-white/5 font-semibold hover:text-[#f59e0b]")}
          >
            <BarChart3 className="w-4 h-4" /> 报表
          </button>
          <button 
            onClick={() => setActiveTopTab('settings')}
            className={cn("px-6 h-full flex items-center gap-2 text-slate-400 hover:text-white transition-colors", activeTopTab === 'settings' && "text-[#f59e0b] border-b-2 border-[#f59e0b] bg-white/5 font-semibold hover:text-[#f59e0b]")}
          >
            <Settings className="w-4 h-4" /> 设置
          </button>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-xs text-white">管</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Module Sidebar (Left 1) */}
        {activeTopTab === 'reports' && (
          <aside className="w-36 bg-slate-800 shrink-0 flex flex-col pt-4 z-10 relative">
            <nav className="flex flex-col">
              <button 
                onClick={() => setActiveSideTab('management')}
                className={cn("px-4 py-3 text-sm text-left flex items-center gap-2 transition-colors", activeSideTab === 'management' ? "bg-[#f59e0b]/10 text-[#f59e0b] border-r-4 border-[#f59e0b] font-medium" : "text-slate-400 hover:bg-slate-700")}
              >
                <MonitorPlay className="w-4 h-4" /> 管理报表
              </button>
              <button 
                onClick={() => setActiveSideTab('sales')}
                className={cn("px-4 py-3 text-sm text-left flex items-center gap-2 transition-colors", activeSideTab === 'sales' ? "bg-[#f59e0b]/10 text-[#f59e0b] border-r-4 border-[#f59e0b] font-medium" : "text-slate-400 hover:bg-slate-700")}
              >
                <Briefcase className="w-4 h-4" /> 销售报表
              </button>
              <button 
                onClick={() => setActiveSideTab('service')}
                className={cn("px-4 py-3 text-sm text-left flex items-center gap-2 transition-colors", activeSideTab === 'service' ? "bg-[#f59e0b]/10 text-[#f59e0b] border-r-4 border-[#f59e0b] font-medium" : "text-slate-400 hover:bg-slate-700")}
              >
                <HeadphonesIcon className="w-4 h-4" /> 客服报表
              </button>
            </nav>
          </aside>
        )}

        {/* Content Area */}
        {activeTopTab === 'reports' && activeSideTab === 'management' && (
          <div className="flex flex-1 overflow-hidden bg-background">
            {/* Org Selector Sidebar (Left 2) */}
            <OrgSelector value={orgId} onChange={setOrgId} />
            
            {/* Dashboard Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
              <DashboardContent key={orgId} />
            </main>
          </div>
        )}

        {/* Placeholders for other tabs */}
        {(activeTopTab !== 'reports' || activeSideTab !== 'management') && (
          <div className="flex-1 flex items-center justify-center text-slate-400 flex-col gap-4">
            <MonitorPlay className="w-12 h-12 opacity-20" />
            <p>该功能正在开发中 / Not implemented in this prototype</p>
          </div>
        )}
      </div>
    </div>
  );
}

