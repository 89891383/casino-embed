export interface Casino {
  id: string;
  name: string;
  logoUrl: string;
  rating: number;
  bonus: string;
  affiliateLink: string;
  minDeposit: string;
  features: string[];
  category: string; // 'slots' | 'live' | 'sports' | 'crypto' | 'all'
  description: string;
  license: string;
  payoutSpeed: string;
  isFeatured?: boolean;
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  path: string;
  branch?: string;
}