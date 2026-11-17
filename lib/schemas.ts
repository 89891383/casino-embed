import { z } from 'zod';

export const CasinoSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nazwa jest wymagana'),
  logoUrl: z.string().optional().default(''),
  rating: z.number().min(1).max(5),
  bonus: z.string(),
  affiliateLink: z.string().url('Nieprawidłowy URL'),
  minDeposit: z.string(),
  features: z.array(z.string()),
  category: z.enum(['slots', 'live', 'crypto', 'sports']),
  description: z.string().optional().default(''),
  license: z.string().optional().default(''),
  payoutSpeed: z.string().optional().default(''),
  isFeatured: z.boolean().optional().default(false),
});

export type CasinoInput = z.infer<typeof CasinoSchema>;

export const GitHubConfigSchema = z.object({
  token: z.string().min(1),
  owner: z.string().min(1),
  repo: z.string().min(1),
  path: z.string().min(1),
  branch: z.string().optional().default('main'),
});