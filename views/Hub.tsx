
import React, { useState } from 'react';
import { AppDefinition, AppRoute } from '../types';
import { ManifestoModal } from '../components/ManifestoModal';

interface HubProps {
  onNavigate: (route: AppRoute) => void;
}

const APPS: AppDefinition[] = [
  {
    id: 'DEVILS_ADVOCATE',
    title: '逻辑异端裁判所',
    description: '对你的观点进行残酷的逻辑刑讯逼供。',
    icon: '⛓️',
    colorClass: 'group-hover:text-red-800 group-hover:border-red-800'
  },
  {
    id: 'CYBER_DEBATE',
    title: '认知角斗场',
    description: '红蓝 AI 针对议题进行极限逻辑互搏。',
    icon: '⚔️',
    colorClass: 'group-hover:text-red-500 group-hover:border-red-500'
  },
  {
    id: 'SUBTEXT',
    title: '真相审讯室',
    description: '拆解话语背后的真实意图和权力关系。',
    icon: '👁️',
    colorClass: 'group-hover:text-zinc-300 group-hover:border-zinc-300'
  },
  {
    id: 'DECISION_PATH',
    title: '决策推演矩阵',
    description: '理性拆解复杂决策，权衡收益与不可逆风险。',
    icon: '📊',
    colorClass: 'group-hover:text-cyan group-hover:border-cyan'
  },
  {
    id: 'ANTI_LIFE',
    title: '项目验尸官',
    description: '假设项目已失败，进行事前验尸分析。',
    icon: '☠️',
    colorClass: 'group-hover:text-red-600 group-hover:border-red-600'
  },
  {
    id: 'CONCEPT_STITCHER',
    title: '独角兽孵化器',
    description: '强行缝合无关概念，生成荒诞商业计划书。',
    icon: '🦄',
    colorClass: 'group-hover:text-fuchsia-500 group-hover:border-fuchsia-500'
  },
  {
    id: 'CODE_ARCH',
    title: '数字遗迹博物馆',
    description: '像考古一样分析陈旧代码的历史层次。',
    icon: '🏺',
    colorClass: 'group-hover:text-stone-400 group-hover:border-stone-400'
  },
  {
    id: 'COST_CALC',
    title: '因果发票',
    description: '计算选择背后的隐性代价和灵魂损耗。',
    icon: '🧾',
    colorClass: 'group-hover:text-zinc-100 group-hover:border-zinc-100'
  },
  {
    id: 'BIAS_DETECTOR',
    title: '认知生化扫描',
    description: '像检测病毒一样扫描文本中的逻辑谬误。',
    icon: '☣️',
    colorClass: 'group-hover:text-green-500 group-hover:border-green-500'
  },
  {
    id: 'WORLD_SIM',
    title: '平行宇宙观测站',
    description: '推演异变点引发的蝴蝶效应和新世界法则。',
    icon: '🌌',
    colorClass: 'group-hover:text-purple-400 group-hover:border-purple-400'
  },
  {
    id: 'EGO_BOUNDARY',
    title: '精神结构风洞',
    description: '对人格进行高压测试，寻找崩溃点。',
    icon: '🏗️',
    colorClass: 'group-hover:text-cyan group-hover:border-cyan'
  },
  {
    id: 'LANG_SMELL',
    title: '语义光谱仪',
    description: '分析文本的化学成分、阶层气味和毒性。',
    icon: '⚗️',
    colorClass: 'group-hover:text-indigo-400 group-hover:border-indigo-400'
  },
  {
    id: 'DECEPTION',
    title: '红丸终端',
    description: '撕碎自我欺骗的幻象，直面残酷真相。',
    icon: '💊',
    colorClass: 'group-hover:text-green-500 group-hover:border-green-500'
  },
  {
    id: 'EXTREME_SIM',
    title: '混沌计算器',
    description: '模拟微小坏习惯引发的灾难性后果。',
    icon: '🦋',
    colorClass: 'group-hover:text-orange-500 group-hover:border-orange-500'
  },
  {
    id: 'JURY',
    title: '原型议会',
    description: '脑内不同欲望人格对议题进行投票辩论。',
    icon: '🏛️',
    colorClass: 'group-hover:text-lime-400 group-hover:border-lime-400'
  }
];

export const Hub: React.FC<HubProps> = ({ onNavigate }) => {
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);

  const handleRandom = () => {
    // Exclude offline/dev tools if any
    const available = APPS.filter(a => !a.isDev);
    const randomApp = available[Math.floor(Math.random() * available.length)];
    onNavigate(randomApp.id);
  };

  return (
    <div className="space-y-12 animate-fade-in pb-12 relative">
      <ManifestoModal isOpen={isManifestoOpen} onClose={() => setIsManifestoOpen(false)} />
      
      {/* Top Section with Title and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 max-w-full">
        <div className="relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-cyan to-transparent opacity-50"></div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight font-sans">
            DEEP DISSECT <span className="text-cyan animate-pulse">_LAB</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base font-mono leading-relaxed max-w-xl">
            &gt; SYSTEM_READY: {APPS.length} MODULES LOADED.<br/>
            &gt; 选择下方工具，开始认知解剖。
          </p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setIsManifestoOpen(true)}
            className="group flex items-center gap-2 px-4 py-2 border border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-500 transition-all text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white"
          >
            <span className="text-lg leading-none">?</span>
            <span>Protocol</span>
          </button>
          
          <button 
            onClick={handleRandom}
            className="group flex items-center gap-2 px-6 py-2 border border-cyan/30 bg-cyan/10 hover:bg-cyan/20 hover:border-cyan text-cyan text-xs font-mono uppercase tracking-widest transition-all"
            title="I'm Feeling Lucky"
          >
             <span className="animate-spin group-hover:animate-none">⚄</span>
             <span>Neural Shuffle</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {APPS.map((app, idx) => (
          <button
            key={idx}
            disabled={app.isDev}
            onClick={() => !app.isDev && onNavigate(app.id)}
            className={`
              group relative flex flex-col items-start p-6 
              border border-zinc-800 bg-black/40 backdrop-blur-sm
              transition-all duration-300 text-left
              hover:border-cyan/50 hover:bg-black/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]
              ${app.isDev ? 'opacity-30 grayscale cursor-not-allowed' : ''}
            `}
          >
            {/* Corner Markers */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-600 group-hover:border-cyan transition-colors"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-600 group-hover:border-cyan transition-colors"></div>

            <div className="flex justify-between w-full mb-4">
              <span className="text-2xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{app.icon}</span>
              <span className="text-[10px] font-mono text-zinc-600 group-hover:text-cyan transition-colors">0{idx + 1}</span>
            </div>
            
            <h3 className={`text-lg font-bold mb-2 text-zinc-200 font-sans tracking-wide transition-colors ${app.colorClass}`}>
              {app.title}
            </h3>
            <p className="text-xs text-zinc-500 font-mono leading-relaxed group-hover:text-zinc-400 transition-colors">
              {app.description}
            </p>
            
            {app.isDev && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-[1px]">
                <span className="text-xs font-mono text-red-500 border border-red-500/50 px-2 py-1">OFFLINE</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
