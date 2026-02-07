
import React from 'react';
import { Block } from '../types';
import { SHAPE_ICONS } from '../constants';

interface BlockVisualizerProps {
  blocks: Block[];
}

const BlockVisualizer: React.FC<BlockVisualizerProps> = ({ blocks }) => {
  return (
    <div className="flex overflow-x-auto pb-6 space-x-6 scrollbar-hide">
      {blocks.map((block, i) => (
        <div 
          key={block.hash} 
          className="flex-shrink-0 w-64 glass p-4 rounded-xl relative group transition-all hover:scale-105 border-l-4 border-l-saffron"
          style={{ borderLeftColor: i % 2 === 0 ? '#FF9933' : '#128807' }}
        >
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono text-slate-400">#BLOCK_{block.index}</span>
            <div className="text-indigo-400">
              {SHAPE_ICONS[block.shape]}
            </div>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Hash</p>
              <p className="text-xs font-mono truncate">{block.hash}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Prev Hash</p>
              <p className="text-xs font-mono truncate">{block.prevHash}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Timestamp</p>
              <p className="text-xs">{new Date(block.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlockVisualizer;
