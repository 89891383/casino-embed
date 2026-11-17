import type { GithubConfig, SiteData } from './types'
import { getDefaultData } from './types'

const OWNER  = process.env.NEXT_PUBLIC_GITHUB_OWNER  ?? ''
const REPO   = process.env.NEXT_PUBLIC_GITHUB_REPO   ?? ''
const BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH ?? 'main'
const PATH   = process.env.NEXT_PUBLIC_DATA_PATH     ?? 'data/casinos.json'

function decodeContent(b64: string): string {
  return decodeURIComponent(
    Array.from(atob(b64.replace(/\n/g, '')))
      .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
  )
}

function encodeContent(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  )
}

/** Fetch site data for the public page (no auth, uses env vars) */
export async function fetchSiteData(): Promise<SiteData> {
  if (!OWNER || !REPO) return getDefaultData()
  try {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}?ref=${BRANCH}&ts=${Date.now()}`
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github.v3+json' },
      cache: 'no-store',
    })
    if (!res.ok) return getDefaultData()
    const json = await res.json()
    return JSON.parse(decodeContent(json.content))
  } catch {
    return getDefaultData()
  }
}

/** Fetch site data with auth token (admin panel) */
export async function fetchSiteDataAuth(cfg: GithubConfig): Promise<SiteData | null> {
  try {
    const path = cfg.path || PATH
    const url  = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}&ts=${Date.now()}`
    const res  = await fetch(url, {
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
    if (!res.ok) return null
    const json = await res.json()
    return JSON.parse(decodeContent(json.content))
  } catch {
    return null
  }
}

/** Commit updated data back to GitHub */
export async function saveSiteData(
  cfg: GithubConfig,
  data: SiteData
): Promise<{ ok: boolean; message: string }> {
  try {
    const path = cfg.path || PATH
    const url  = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}`
    const auth = { Authorization: `Bearer ${cfg.token}`, Accept: 'application/vnd.github.v3+json' }

    // Get current SHA so we can update
    let sha: string | undefined
    const getRes = await fetch(`${url}?ref=${cfg.branch}`, { headers: auth })
    if (getRes.ok) {
      const existing = await getRes.json()
      sha = existing.sha
    }

    const updated: SiteData = { ...data, lastUpdated: new Date().toISOString() }
    const content = encodeContent(JSON.stringify(updated, null, 2))
    const body: Record<string, unknown> = {
      message: `chore: update casino data [${new Date().toLocaleString('pl-PL')}]`,
      content,
      branch: cfg.branch,
    }
    if (sha) body.sha = sha

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!putRes.ok) {
      const err = await putRes.json()
      return { ok: false, message: err.message ?? 'GitHub API error' }
    }
    return { ok: true, message: 'Zapisano i wysłano do GitHub ✓' }
  } catch (e) {
    return { ok: false, message: `Błąd: ${(e as Error).message}` }
  }
}
