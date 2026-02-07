
export enum BlockShape {
  HEXAGON = 'HEXAGON',
  SQUARE = 'SQUARE',
  CIRCLE = 'CIRCLE',
  TRIANGLE = 'TRIANGLE'
}

export enum HeroRarity {
  LEGENDARY = 'LEGENDARY',
  EPIC = 'EPIC',
  RARE = 'RARE',
  COMMON = 'COMMON'
}

export interface Hero {
  id: string;
  name: string;
  type: 'SUPERHERO' | 'FREEDOM_FIGHTER';
  rarity: HeroRarity;
  description: string;
  imageUrl: string;
  mintedAt: number;
  blockHash: string;
  cbdcValue: number;
  stats: {
    bravery: number;
    wisdom: number;
    power: number;
  };
}

export interface Block {
  index: number;
  timestamp: number;
  shape: BlockShape;
  prevHash: string;
  hash: string;
  nonce: number;
  data: string; // The hero ID minted in this block
}

export interface WalletState {
  balance: number; // In e-RUPI
  heroes: Hero[];
}
