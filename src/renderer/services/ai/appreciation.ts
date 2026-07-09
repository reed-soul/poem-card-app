/**
 * AI 赏析层：只讲解真诗，绝不生成伪古诗冒充原作。
 * 路由：DeepSeek 偏结构化校验；智谱偏中文赏析文案。
 */

import type { CuratedPoem } from '../../types/poem'

export type AiProviderId = 'zhipu' | 'deepseek'

export interface AppreciationRequest {
  poem: CuratedPoem
  /** 今日推荐理由，帮助模型不跑题 */
  reason?: string
  provider?: AiProviderId
}

export interface AppreciationResult {
  text: string
  source: 'local' | 'cache' | 'zhipu' | 'deepseek'
  model?: string
  poemId: string
}

const CACHE_PREFIX = 'poem-appreciation-v1:'

interface ProviderConfig {
  id: AiProviderId
  endpoint: string
  model: string
  envKey: string
  storageKey: string
}

const PROVIDERS: Record<AiProviderId, ProviderConfig> = {
  zhipu: {
    id: 'zhipu',
    endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    model: 'glm-4-flash',
    envKey: 'VITE_ZHIPU_AI_API_KEY',
    storageKey: 'zhipu_ai_api_key',
  },
  deepseek: {
    id: 'deepseek',
    endpoint: 'https://api.deepseek.com/chat/completions',
    model: 'deepseek-chat',
    envKey: 'VITE_DEEPSEEK_API_KEY',
    storageKey: 'deepseek_api_key',
  },
}

function readEnv(key: string): string {
  try {
    return (import.meta.env as Record<string, string | undefined>)[key] ?? ''
  } catch {
    return ''
  }
}

export function getProviderApiKey(provider: AiProviderId): string {
  const config = PROVIDERS[provider]
  const fromEnv = readEnv(config.envKey)
  if (fromEnv) return fromEnv
  if (typeof localStorage === 'undefined') return ''
  return localStorage.getItem(config.storageKey) ?? ''
}

export function saveProviderApiKey(provider: AiProviderId, key: string): void {
  localStorage.setItem(PROVIDERS[provider].storageKey, key)
}

function cacheKey(poemId: string): string {
  return `${CACHE_PREFIX}${poemId}`
}

export function readCachedAppreciation(poemId: string): string | null {
  try {
    return localStorage.getItem(cacheKey(poemId))
  } catch {
    return null
  }
}

export function writeCachedAppreciation(poemId: string, text: string): void {
  try {
    localStorage.setItem(cacheKey(poemId), text)
  } catch {
    // ignore quota errors
  }
}

function buildAppreciationPrompt(poem: CuratedPoem, reason?: string): string {
  return `你是古典诗词讲解助手。请为下面这首【已有原作】写 2～4 句中文短赏析。

硬性规则：
1. 只讲解，不要改写、续写或「创作」新诗句。
2. 不要伪造作者、朝代或出处。
3. 不要输出 Markdown 代码块。
4. 语气克制、干净，像博物馆展签，不要鸡汤堆砌。
5. 可点出意象、情感或结构，但总字数控制在 80～120 字。

诗词：
标题：${poem.title}
作者：${poem.author}（${poem.dynasty}）
正文：
${poem.content.join('\n')}
${reason ? `今日推荐语境：${reason}` : ''}

只返回赏析正文本身。`
}

async function callChatCompletion(
  provider: AiProviderId,
  prompt: string,
): Promise<{ text: string; model: string }> {
  const config = PROVIDERS[provider]
  const apiKey = getProviderApiKey(provider)
  if (!apiKey) {
    throw new Error(`${provider} API Key 未配置`)
  }

  const response = await fetch(config.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: 'system',
          content:
            '你只讲解已有古诗词原作，绝不生成伪托古人的新诗。输出纯中文短赏析。',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 300,
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    const message =
      (err as { error?: { message?: string } })?.error?.message ||
      `API 请求失败: ${response.status}`
    throw new Error(message)
  }

  const data = await response.json()
  const text = data?.choices?.[0]?.message?.content?.trim()
  if (!text) throw new Error('赏析结果为空')
  return { text, model: config.model }
}

/**
 * 获取赏析：本地预置 → 缓存 → AI（智谱优先，DeepSeek 回退）→ 最终本地。
 */
export async function getAppreciation(
  request: AppreciationRequest,
): Promise<AppreciationResult> {
  const { poem, reason, provider } = request

  const cached = readCachedAppreciation(poem.id)
  if (cached) {
    return { text: cached, source: 'cache', poemId: poem.id }
  }

  if (poem.appreciation) {
    // 本地预置先返回；后台仍可刷新 AI（由调用方决定是否 await AI）
    // 这里同步路径：有本地就先用，避免白屏
  }

  const order: AiProviderId[] = provider
    ? [provider]
    : ['zhipu', 'deepseek']

  for (const id of order) {
    if (!getProviderApiKey(id)) continue
    try {
      const { text, model } = await callChatCompletion(
        id,
        buildAppreciationPrompt(poem, reason),
      )
      writeCachedAppreciation(poem.id, text)
      return { text, source: id, model, poemId: poem.id }
    } catch (error) {
      console.warn(`[appreciation] ${id} failed`, error)
    }
  }

  if (poem.appreciation) {
    return { text: poem.appreciation, source: 'local', poemId: poem.id }
  }

  return {
    text: `《${poem.title}》· ${poem.author}。细读原文，意象自现。`,
    source: 'local',
    poemId: poem.id,
  }
}

/**
 * 即时本地赏析（不发起网络），用于首屏。
 */
export function getLocalAppreciation(poem: CuratedPoem): AppreciationResult {
  const cached = readCachedAppreciation(poem.id)
  if (cached) {
    return { text: cached, source: 'cache', poemId: poem.id }
  }
  if (poem.appreciation) {
    return { text: poem.appreciation, source: 'local', poemId: poem.id }
  }
  return {
    text: `《${poem.title}》· ${poem.author}。细读原文，意象自现。`,
    source: 'local',
    poemId: poem.id,
  }
}

export function getAiConfigSummary() {
  return {
    zhipu: Boolean(getProviderApiKey('zhipu')),
    deepseek: Boolean(getProviderApiKey('deepseek')),
  }
}
