
import React, { useState } from 'react';
import { BlockShape } from '../types';
import { SHAPE_ICONS } from '../constants';

interface MiningPanelProps {
  isMining: boolean;
  onMine: (shape: BlockShape) => void;
  balance: number;
}

const MiningPanel: React.FC<MiningPanelProps> = ({ isMining, onMine, balance }) => {
  const [selectedShape, setSelectedShape] = useState<BlockShape>(BlockShape.HEXAGON);

  const shapes = Object.values(BlockShape);

  return (
    <div className="glass p-8 rounded-3xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
         <div className="text-right">
            <p className="text-xs text-slate-500 uppercase">CBDC Reserve</p>
            <p className="text-2xl font-heading font-bold text-emerald-400">₹{balance.toLocaleString()}e</p>
         </div>
      </div>

      <h2 className="text-3xl font-heading font-bold mb-2">Mining Spectrum</h2>
      <p className="text-slate-400 mb-8 max-w-md">
        Select a geometric block configuration to initiate a Proof-of-Hero mining cycle. 
        Each shape resonates with a different frequency of Indian history.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {shapes.map((shape) => (
          <button
            key={shape}
            onClick={() => setSelectedShape(shape)}
            disabled={isMining}
            className={`p-6 rounded-2xl flex flex-col items-center gap-3 transition-all border-2 ${
              selectedShape === shape 
                ? 'border-orange-500 bg-orange-500/10 text-orange-500' 
                : 'border-white/5 bg-white/5 text-slate-500 hover:bg-white/10'
            }`}
          >
            {SHAPE_ICONS[shape]}
            <span className="text-xs font-bold tracking-widest">{shape}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => onMine(selectedShape)}
        disabled={isMining || balance < 100}
        className={`w-full py-5 rounded-2xl font-heading font-bold text-xl transition-all relative overflow-hidden ${
          isMining || balance < 100
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-xl hover:shadow-emerald-600/20 active:scale-[0.98]'
        }`}
      >
        {isMining ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>MINING BLOCK...</span>
          </div>
        ) : balance < 100 ? (
          'INSUFFICIENT CBDC RESERVE'
        ) : (
          'EXECUTE PROOF-OF-SHAPE (₹100e)'
        )}
      </button>

      <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-[0.2em]">
        Authorized by RBI Regulatory Sandbox Framework v3.1
      </p>
    </div>
  );
};

export default MiningPanel;
