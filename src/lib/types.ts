export interface DepositBonus {
  deposit: number
  percent: number
  maxBonus: number
  freeSpins: number
}

export interface Casino {
  id: string
  name: string
  logo: string
  bonusText: string
  bonusAmount: number
  currency: string
  freeSpins: number
  rating: number
  ratingCount: string
  url: string
  featured: boolean
  badge?: string
  tags: string[]
  depositBonuses: DepositBonus[]
  active: boolean
  order: number
  createdAt: string
}

export interface SiteData {
  casinos: Casino[]
  lastUpdated: string
  version: string
}

export interface GithubConfig {
  token: string
  owner: string
  repo: string
  branch: string
  path: string
}

export const DEFAULT_CASINO: Casino = {
  id: 'spinbetter',
  name: 'SpinBetter',
  logo: 'https://i.nuuls.com/0O2Ld.png',
  bonusText: '6350 PLN + 150 FS',
  bonusAmount: 6350,
  currency: 'PLN',
  freeSpins: 150,
  rating: 4.8,
  ratingCount: '2.4k',
  url: 'https://spinbetter.com',
  featured: true,
  badge: 'Polecane',
  tags: ['Szybkie wypłaty', 'Licencja', 'Live Casino', 'Support 24/7'],
  depositBonuses: [
    { deposit: 1, percent: 100, maxBonus: 1500, freeSpins: 50 },
    { deposit: 2, percent: 75,  maxBonus: 1600, freeSpins: 50 },
    { deposit: 3, percent: 75,  maxBonus: 1850, freeSpins: 25 },
    { deposit: 4, percent: 75,  maxBonus: 1400, freeSpins: 25 },
  ],
  active: true,
  order: 1,
  createdAt: new Date().toISOString(),
}

export function getDefaultData(): SiteData {
  return {
    version: '1.0',
    lastUpdated: new Date().toISOString(),
    casinos: [DEFAULT_CASINO],
  }
}
