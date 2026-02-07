
import React from 'react';
import { Hero, HeroRarity } from '../types';

interface HeroCardProps {
  hero: Hero;
  onRedeem?: () => void;
}

const RARITY_COLORS: Record<HeroRarity, string> = {
  [HeroRarity.LEGENDARY]: 'text-orange-500 border-orange-500/50 bg-orange-500/10',
  [HeroRarity.EPIC]: 'text-purple-500 border-purple-500/50 bg-purple-500/10',
  [HeroRarity.RARE]: 'text-blue-500 border-blue-500/50 bg-blue-500/10',
  [HeroRarity.COMMON]: 'text-slate-400 border-slate-400/50 bg-slate-400/10',
};

const HeroCard: React.FC<HeroCardProps> = ({ hero, onRedeem }) => {
  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col group transition-all hover:shadow-2xl hover:shadow-indigo-500/10">
      <div className="relative aspect-square overflow-hidden bg-slate-900">
        <img 
          src={hero.imageUrl || 'https://picsum.photos/400/400'} 
          alt={hero.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
           <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border ${RARITY_COLORS[hero.rarity]}`}>
            {hero.rarity}
          </span>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border border-white/20 bg-black/40 text-white backdrop-blur-md">
            {hero.type}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading text-xl font-bold">{hero.name}</h3>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Value</span>
            <span className="text-emerald-400 font-bold">₹{hero.cbdcValue}e</span>
          </div>
        </div>
        
        <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">
          {hero.description}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <span className="block text-[10px] uppercase text-slate-500">Bravery</span>
            <span className="font-bold text-sm">{hero.stats.bravery}</span>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <span className="block text-[10px] uppercase text-slate-500">Wisdom</span>
            <span className="font-bold text-sm">{hero.stats.wisdom}</span>
          </div>
          <div className="text-center p-2 bg-white/5 rounded-lg">
            <span className="block text-[10px] uppercase text-slate-500">Power</span>
            <span className="font-bold text-sm">{hero.stats.power}</span>
          </div>
        </div>

        {onRedeem && (
          <button 
            onClick={onRedeem}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl font-bold text-sm transition-transform active:scale-95"
          >
            REGENERATE / EVOLVE
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroCard;
