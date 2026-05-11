import React, { useState } from 'react';
import { Search, ChevronRight, ChevronDown, Building2 } from 'lucide-react';
import { cn } from '../../lib/utils';

// Mock Data
const orgData = [
  {
    id: 'grp-1',
    name: '财宝科技集团',
    type: 'group',
    children: [
      {
        id: 'reg-1',
        name: '华东大区',
        type: 'region',
        children: [
          { id: 'sub-1', name: '上海财宝分公司', type: 'subsidiary' },
          { id: 'sub-2', name: '杭州财宝业务部', type: 'subsidiary' },
          { id: 'sub-3', name: '南京交付中心', type: 'subsidiary' },
        ]
      },
      {
        id: 'reg-2',
        name: '华北大区',
        type: 'region',
        children: [
          { id: 'sub-4', name: '北京财宝分公司', type: 'subsidiary' },
          { id: 'sub-5', name: '天津财宝业务部', type: 'subsidiary' },
        ]
      },
      {
        id: 'reg-3',
        name: '华南大区',
        type: 'region',
        children: [
          { id: 'sub-6', name: '深圳测试分公司', type: 'subsidiary' },
          { id: 'sub-7', name: '广州交付部', type: 'subsidiary' },
        ]
      }
    ]
  }
];

// Flatten for search
const allOrgs = orgData.flatMap(g => [
  g, 
  ...g.children.flatMap(r => [r, ...r.children])
]);

export default function OrgSelector({ value, onChange }: { value?: string, onChange?: (val: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>(value || 'grp-1');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(['grp-1', 'reg-1', 'reg-2', 'reg-3']));
  const [searchFocused, setSearchFocused] = useState(false);

  // Sync prop to state
  React.useEffect(() => {
    if (value) setSelectedId(value);
  }, [value]);

  const searchResults = searchTerm 
    ? allOrgs.filter(o => o.name.includes(searchTerm))
    : [];

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);
  };

  const handleSelect = (org: any) => {
    setSelectedId(org.id);
    onChange?.(org.id);
    setSearchTerm('');
    setSearchFocused(false);
    
    // Auto expand parents (mocking simple logic)
    const newExpanded = new Set(expandedIds);
    if (org.type === 'subsidiary') {
      const parentRegion = orgData[0].children.find(r => r.children.some((s:any) => s.id === org.id));
      if (parentRegion) newExpanded.add(parentRegion.id);
      newExpanded.add('grp-1');
    }
    if (org.type === 'region') {
      newExpanded.add('grp-1');
    }
    setExpandedIds(newExpanded);
  };

  const renderTree = (nodes: any[], depth = 0) => {
    return nodes.map(node => {
      const isExpanded = expandedIds.has(node.id);
      const isSelected = selectedId === node.id;
      const hasChildren = node.children && node.children.length > 0;

      return (
        <div key={node.id} className="flex flex-col">
          <div 
            className={cn(
              "flex items-center py-1.5 px-2 cursor-pointer rounded-sm text-xs transition-colors",
              isSelected ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-50"
            )}
            style={{ paddingLeft: `${depth * 16 + 8}px` }}
            onClick={() => handleSelect(node)}
          >
            <div 
              className={cn("w-4 h-4 mr-1 flex items-center justify-center shrink-0", isSelected ? "text-blue-500" : "text-slate-300")}
              onClick={(e) => hasChildren && toggleExpand(node.id, e)}
            >
              {hasChildren ? (isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />) : <span className="w-3 h-3" />}
            </div>
            {node.type === 'group' && <Building2 className="w-3 h-3 mr-1.5 opacity-70" />}
            <span className="truncate">{node.name}</span>
          </div>
          {hasChildren && isExpanded && (
            <div className="flex flex-col">
              {renderTree(node.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <aside className="w-52 bg-white border-r border-slate-200 shrink-0 flex flex-col relative z-0">
      <div className="p-3 border-b border-slate-100">
        <h2 className="font-semibold text-xs text-slate-400 mb-2 px-1">组织架构</h2>
        <div className="relative mb-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute right-2 text-slate-400" />
            <input 
              type="text"
              placeholder="搜索公司..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              className="w-full pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
            />
          </div>
          
          {/* Search Dropdown */}
          {searchFocused && searchTerm && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 shadow-lg rounded-md max-h-60 overflow-y-auto z-50">
              {searchResults.length > 0 ? (
                searchResults.map(res => (
                  <div 
                    key={res.id + '-search'}
                    className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                    onMouseDown={() => handleSelect(res)} // mousedown fires before input blur
                  >
                    <div className="font-medium text-slate-800">{res.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {res.type === 'group' ? '集团' : res.type === 'region' ? '大区' : '子公司'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-slate-500 text-center">
                  暂无匹配结果
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {renderTree(orgData)}
      </div>
    </aside>
  );
}
