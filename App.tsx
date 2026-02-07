
import React, { useState, useEffect, useCallback } from 'react';
import { Block, BlockShape, Hero, WalletState, HeroRarity } from './types';
import { generateHeroMetadata, generateHeroImage } from './services/geminiService';
import BlockVisualizer from './components/BlockVisualizer';
import HeroCard from './components/HeroCard';
import MiningPanel from './components/MiningPanel';

const INITIAL_WALLET: WalletState = {
  balance: 2500,
  heroes: []
};

const GENESIS_BLOCK: Block = {
  index: 0,
  timestamp: Date.now(),
  shape: BlockShape.CIRCLE,
  prevHash: "0000000000000000",
  hash: "BHARAT_GENESIS_647289",
  nonce: 42,
  data: "GENESIS"
};

const App: React.FC = () => {
  const [chain, setChain] = useState<Block[]>([GENESIS_BLOCK]);
  const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET);
  const [isMining, setIsMining] = useState(false);
  const [activeTab, setActiveTab] = useState<'COLLECTION' | 'MINING' | 'SANDBOX'>('MINING');
  const [miningStatus, setMiningStatus] = useState('');

  // Simple hashing simulator
  const simulateHash = (prevHash: string, shape: string) => {
    return Math.random().toString(36).substring(2, 15).toUpperCase();
  };

  const handleMine = async (shape: BlockShape) => {
    if (wallet.balance < 100) return;

    setIsMining(true);
    setMiningStatus('Connecting to BharatChain nodes...');

    try {
      // 1. Spend CBDC
      setWallet(prev => ({ ...prev, balance: prev.balance - 100 }));

      // 2. Generate Hero Metadata via Gemini
      setMiningStatus('Decoding historical spectrum...');
      const metadata = await generateHeroMetadata(shape);
      
      // 3. Generate Image
      setMiningStatus('Synthesizing heroic form...');
      const imageUrl = await generateHeroImage(metadata.name || 'Hero', metadata.description || '');

      // 4. Create Hero Object
      const newHero: Hero = {
        id: `hero_${Date.now()}`,
        name: metadata.name || 'Unknown Legend',
        type: metadata.type || 'SUPERHERO',
        rarity: metadata.rarity || HeroRarity.COMMON,
        description: metadata.description || '',
        imageUrl: imageUrl || `https://picsum.photos/seed/${Date.now()}/400/400`,
        mintedAt: Date.now(),
        blockHash: '', // Will be set after block mining
        cbdcValue: metadata.cbdcValue || 150,
        stats: metadata.stats || { bravery: 50, wisdom: 50, power: 50 }
      };

      // 5. Create Block
      const prevBlock = chain[chain.length - 1];
      const newHash = simulateHash(prevBlock.hash, shape);
      const newBlock: Block = {
        index: chain.length,
        timestamp: Date.now(),
        shape: shape,
        prevHash: prevBlock.hash,
        hash: newHash,
        nonce: Math.floor(Math.random() * 10000),
        data: newHero.id
      };

      newHero.blockHash = newHash;

      // Update States
      setChain(prev => [...prev, newBlock]);
      setWallet(prev => ({ ...prev, heroes: [newHero, ...prev.heroes] }));
      
      setMiningStatus('Minting successful!');
      setTimeout(() => {
        setIsMining(false);
        setMiningStatus('');
        setActiveTab('COLLECTION');
      }, 1500);

    } catch (error) {
      console.error('Mining failed:', error);
      setIsMining(false);
      setMiningStatus('Spectrum connection lost. CBDC refunded.');
      setWallet(prev => ({ ...prev, balance: prev.balance + 100 }));
    }
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-white to-green-600 rounded-lg p-[2px]">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center font-bold text-xl">B</div>
          </div>
          <h1 className="font-heading font-bold text-xl tracking-tight hidden sm:block">BHARAT<span className="text-orange-500">CHAIN</span></h1>
        </div>
        
        <nav className="flex gap-6">
          <button 
            onClick={() => setActiveTab('MINING')}
            className={`text-sm font-medium transition-colors ${activeTab === 'MINING' ? 'text-orange-500' : 'text-slate-400 hover:text-white'}`}
          >
            MINING
          </button>
          <button 
            onClick={() => setActiveTab('COLLECTION')}
            className={`text-sm font-medium transition-colors ${activeTab === 'COLLECTION' ? 'text-orange-500' : 'text-slate-400 hover:text-white'}`}
          >
            COLLECTION ({wallet.heroes.length})
          </button>
          <button 
            onClick={() => setActiveTab('SANDBOX')}
            className={`text-sm font-medium transition-colors ${activeTab === 'SANDBOX' ? 'text-orange-500' : 'text-slate-400 hover:text-white'}`}
          >
            RBI SANDBOX
          </button>
        </nav>

        <div className="flex items-center gap-4">
           <div className="hidden md:flex flex-col items-end">
             <span className="text-[10px] text-slate-500">CBDC WALLET</span>
             <span className="text-emerald-400 font-bold">₹{wallet.balance.toLocaleString()}e</span>
           </div>
           <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
             <img src="https://picsum.photos/100/100" alt="avatar" />
           </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* Blockchain Bar */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xs font-bold text-slate-500 tracking-[0.3em] uppercase">Live Ledger Stream</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-slate-400">SYNCED WITH RBI NODES</span>
            </div>
          </div>
          <BlockVisualizer blocks={chain} />
        </section>

        {activeTab === 'MINING' && (
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <MiningPanel 
                isMining={isMining} 
                onMine={handleMine} 
                balance={wallet.balance} 
              />
              
              {isMining && (
                <div className="mt-8 p-6 rounded-2xl border border-orange-500/30 bg-orange-500/5 animate-pulse-slow">
                   <p className="text-center font-mono text-orange-500">{miningStatus}</p>
                   <div className="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
                   </div>
                </div>
              )}
            </div>

            <aside className="glass p-6 rounded-3xl">
              <h3 className="font-heading font-bold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {chain.slice(-3).reverse().map((b, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-3 rounded-xl bg-white/5">
                    <div className="text-slate-500 w-8 h-8 flex items-center justify-center bg-slate-900 rounded-lg">
                      {b.index}
                    </div>
                    <div>
                      <p className="text-xs font-medium">New Block Forged</p>
                      <p className="text-[10px] text-slate-500 font-mono">{b.hash.substring(0, 12)}...</p>
                    </div>
                  </div>
                ))}
                {wallet.heroes.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-4">No hero activity yet.</p>
                )}
              </div>
              <hr className="my-6 border-white/5" />
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <p className="text-xs text-indigo-300">
                  <span className="font-bold">Did you know?</span> BharatChain uses an Indigenous Proof-of-Shape algorithm that is 98% more energy efficient than traditional PoW.
                </p>
              </div>
            </aside>
          </div>
        )}

        {activeTab === 'COLLECTION' && (
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-4xl font-heading font-bold mb-2">My Heroic Assets</h2>
                <p className="text-slate-400">Digital ownership of Indian legacy and future imagination.</p>
              </div>
              <div className="flex gap-4">
                <select className="bg-slate-900 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500">
                  <option>Newest First</option>
                  <option>Highest Value</option>
                  <option>Legendary Only</option>
                </select>
              </div>
            </div>

            {wallet.heroes.length === 0 ? (
              <div className="py-20 text-center glass rounded-3xl border-dashed">
                <div className="text-slate-600 mb-4 flex justify-center">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-heading font-medium text-slate-400">Vault is Empty</h3>
                <p className="text-slate-500 mb-6">Start mining in the spectrum to populate your collection.</p>
                <button 
                  onClick={() => setActiveTab('MINING')}
                  className="px-8 py-3 bg-orange-500 rounded-xl font-bold hover:bg-orange-600 transition-colors"
                >
                  GOTO MINING PANEL
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wallet.heroes.map(hero => (
                  <HeroCard 
                    key={hero.id} 
                    hero={hero} 
                    onRedeem={() => {
                      alert(`Regeneration feature for ${hero.name} requires a Tier 2 RBI License. (Concept demo)`);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'SANDBOX' && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="glass p-8 rounded-3xl border-l-4 border-l-green-600">
              <h2 className="text-3xl font-heading font-bold mb-4">RBI Regulatory Framework</h2>
              <div className="prose prose-invert text-slate-400 text-sm leading-relaxed">
                <p className="mb-4">
                  BharatChain operates under the <span className="text-white font-bold">Special Economic Zone (SEZ) Digital Asset Circular 2025</span>. 
                  Every minted hero is a unique cryptographic proof of contribution to the cultural ledger.
                </p>
                <h4 className="text-white font-bold mb-2 mt-6">Compliance Rules:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Exchange is strictly limited to authorized e-RUPI wallets.</li>
                  <li>"Freedom Fighter" assets are classified as National Digital Heritage.</li>
                  <li>Smart contracts enforce a 2% royalty to the Bharat Tech-Education Fund.</li>
                  <li>Proof-of-Shape mining prevents hash-monopolization by large data centers.</li>
                </ul>
                <div className="mt-8 p-4 bg-green-500/10 rounded-xl flex items-start gap-4">
                  <div className="text-green-500 mt-1">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <h5 className="text-green-500 font-bold uppercase text-[10px] tracking-widest">Active License</h5>
                    <p className="text-xs text-slate-300">RBI-TS-BC-2024-001928 - Experimental Marketplace Approved</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-8 rounded-3xl">
               <h3 className="text-xl font-heading font-bold mb-6">Digital Economy Simulation</h3>
               <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500 uppercase">System Liquidity</span>
                      <span className="text-white">94.2%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full">
                       <div className="h-full bg-blue-500 w-[94.2%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-500 uppercase">Mining Difficulty Factor</span>
                      <span className="text-white">Low - Subsidized</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full">
                       <div className="h-full bg-orange-500 w-[20%]" />
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Persistent Call-to-Action / Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/5 p-4 flex justify-center z-50">
        <div className="flex items-center gap-8 text-xs font-mono">
           <div className="flex items-center gap-2">
             <span className="text-slate-500 uppercase">Chain Height</span>
             <span className="text-white">#{chain.length - 1}</span>
           </div>
           <div className="w-px h-4 bg-white/10" />
           <div className="flex items-center gap-2">
             <span className="text-slate-500 uppercase">Avg Gas</span>
             <span className="text-emerald-400">0.0001 ₹e</span>
           </div>
           <div className="w-px h-4 bg-white/10 hidden sm:block" />
           <div className="hidden sm:flex items-center gap-2">
             <span className="text-slate-500 uppercase">Node Provider</span>
             <span className="text-orange-400">ISRO-Quant-Node-7</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;
