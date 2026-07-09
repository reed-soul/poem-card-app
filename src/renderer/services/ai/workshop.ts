/**
 * AI 创作工坊：明确现代新作，禁止伪托唐宋，永不进入每日真诗池。
 */

import {
  getProviderApiKey,
  type AiProviderId,
} from './appreciation'

export interface WorkshopConfig {
  style: string
  season: string
  theme: string
  length: 4 | 8
  provider?: AiProviderId
}

export interface WorkshopPoem {
  id: string
  title: string
  author: string
  dynasty: '当代'
  content: string[]
  ai_generated: true
  style: string
  season: string
  theme: string
  createdAt: string
  model: string
  provider: AiProviderId
}

const DRAFTS_KEY = 'poem-workshop-drafts-v1'
const MAX_DRAFTS = 20

const PROVIDERS: Record<
  AiProviderId,
  { endpoint: string; model: string }
> = {
  zhipu: {
    endpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    model: 'glm-4-flash',
  },
  deepseek: {
    endpoint: 'https://api.deepseek.com/chat/completions',
    model: 'deepseek-chat',
  },
}

function buildWorkshopPrompt(config: WorkshopConfig): string {
  const lengthLabel = config.length === 4 ? '四句短章' : '八句篇章'
  return `请创作一首【现代中文诗词新作】（${lengthLabel}），仅供欣赏。

硬性规则：
1. 这是当代原创，绝不能伪托李白、杜甫等古人，也不能标注唐/宋等古代朝代。
2. 作者字段必须是「AI · 新作」，朝代必须是「当代」。
3. 可以借鉴古典意象与节奏，但必须是新作品。
4. 只返回纯 JSON，不要 Markdown 代码块，不要解释。

创作倾向：
- 风格：${config.style}
- 季节：${config.season || '不限'}
- 主题：${config.theme || '不限'}

JSON 格式：
{
  "title": "标题",
  "author": "AI · 新作",
  "dynasty": "当代",
  "content": ["句1", "句2", ...]
}`
}

function makeId(): string {
  return `ai-workshop-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

async function callProvider(
  provider: AiProviderId,
  prompt: string,
): Promise<{ text: string; model: string }> {
  const apiKey = getProviderApiKey(provider)
  if (!apiKey) throw new Error(`${provider === 'zhipu' ? '智谱' : 'DeepSeek'} API Key 未配置`)

  const config = PROVIDERS[provider]
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
            '你是当代诗词创作者。只创作标明为现代新作的诗词，绝不伪托古人或古代朝代。',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.85,
      max_tokens: 800,
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
  if (!text) throw new Error('生成结果为空')
  return { text, model: config.model }
}

function parseWorkshopJson(raw: string): {
  title: string
  content: string[]
} {
  const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim()
  let data: unknown
  try {
    data = JSON.parse(cleaned)
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('无法解析生成结果')
    data = JSON.parse(match[0])
  }
  const obj = data as { title?: string; content?: unknown }
  if (!obj.title || !Array.isArray(obj.content) || obj.content.length === 0) {
    throw new Error('生成格式不正确')
  }
  return {
    title: String(obj.title),
    content: obj.content.map((line) => String(line)),
  }
}

/** 强制规范化：无论模型返回什么，作者/朝代/标记都锁定为 AI 新作 */
export function normalizeWorkshopPoem(
  partial: { title: string; content: string[] },
  config: WorkshopConfig,
  meta: { provider: AiProviderId; model: string },
): WorkshopPoem {
  return {
    id: makeId(),
    title: partial.title,
    author: 'AI · 新作',
    dynasty: '当代',
    content: partial.content,
    ai_generated: true,
    style: config.style,
    season: config.season,
    theme: config.theme,
    createdAt: new Date().toISOString(),
    model: meta.model,
    provider: meta.provider,
  }
}

export async function createWorkshopPoem(
  config: WorkshopConfig,
): Promise<WorkshopPoem> {
  const prompt = buildWorkshopPrompt(config)
  const order: AiProviderId[] = config.provider
    ? [config.provider]
    : ['zhipu', 'deepseek']

  let lastError: Error | null = null
  for (const provider of order) {
    if (!getProviderApiKey(provider)) continue
    try {
      const { text, model } = await callProvider(provider, prompt)
      const parsed = parseWorkshopJson(text)
      const poem = normalizeWorkshopPoem(parsed, config, { provider, model })
      saveWorkshopDraft(poem)
      return poem
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
    }
  }

  throw lastError ?? new Error('请先在设置中配置智谱或 DeepSeek API Key')
}

export function loadWorkshopDrafts(): WorkshopPoem[] {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (p) => p && p.ai_generated === true && p.dynasty === '当代',
    ) as WorkshopPoem[]
  } catch {
    return []
  }
}

export function saveWorkshopDraft(poem: WorkshopPoem): void {
  const current = loadWorkshopDrafts().filter((p) => p.id !== poem.id)
  const next = [poem, ...current].slice(0, MAX_DRAFTS)
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(next))
}

export function clearWorkshopDrafts(): void {
  localStorage.removeItem(DRAFTS_KEY)
}

/** 供校验：确保工坊诗不会被误认为精校真诗字段 */
export function assertWorkshopIsolation(poem: WorkshopPoem): boolean {
  return (
    poem.ai_generated === true &&
    poem.author === 'AI · 新作' &&
    poem.dynasty === '当代' &&
    poem.id.startsWith('ai-workshop-')
  )
}
