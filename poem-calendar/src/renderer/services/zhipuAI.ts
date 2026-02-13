/**
 * 智谱 AI 服务
 * 参考：https://open.bigmodel.cn/dev/api#chat/completions
 */

/// <reference types="vite/client" />

export interface PoemGenerationConfig {
  style?: string          // 风格：豪放、婉约、清新、深沉
  season?: string         // 季节：春、夏、秋、冬
  theme?: string          // 主题：山水、田园、边塞、思乡等
  length?: number          // 长度：4句、8句
}

export interface GeneratedPoem {
  title: string
  author: string
  dynasty: string
  content: string[]
  ai_generated: boolean
  tags?: string[]
}

// API 端点
const API_ENDPOINT = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const MODEL_ID = 'glm-4'; // 智谱 GLM-4 模型

/**
 * 获取 API Key
 * 优先级：环境变量 > 安全存储 > localStorage（降级）
 */
let _cachedApiKey: string = ''

export function getApiKey(): string {
  // 1. 从环境变量获取
  if (import.meta.env.VITE_ZHIPU_AI_API_KEY) {
    return import.meta.env.VITE_ZHIPU_AI_API_KEY;
  }
  
  // 2. 从缓存获取（由 loadApiKeyFromSecureStorage 填充）
  if (_cachedApiKey) {
    return _cachedApiKey;
  }
  
  // 3. 降级：从 localStorage 获取（非 Electron 环境）
  const storedKey = localStorage.getItem('zhipu_ai_api_key');
  if (storedKey) {
    return storedKey;
  }
  
  return '';
}

/**
 * 从安全存储异步加载 API Key（应用启动时调用）
 */
export async function loadApiKeyFromSecureStorage(): Promise<string> {
  if (window.electronAPI?.loadApiKey) {
    _cachedApiKey = await window.electronAPI.loadApiKey();
    return _cachedApiKey;
  }
  return getApiKey();
}

/**
 * 保存 API Key（优先使用安全存储）
 */
export async function saveApiKey(key: string): Promise<void> {
  _cachedApiKey = key;
  if (window.electronAPI?.saveApiKey) {
    await window.electronAPI.saveApiKey(key);
  } else {
    // 降级：非 Electron 环境使用 localStorage
    localStorage.setItem('zhipu_ai_api_key', key);
  }
}

/**
 * 清除 API Key
 */
export async function clearApiKey(): Promise<void> {
  _cachedApiKey = '';
  if (window.electronAPI?.clearApiKey) {
    await window.electronAPI.clearApiKey();
  } else {
    localStorage.removeItem('zhipu_ai_api_key');
  }
}

/**
 * 构建 AI 生成诗词的提示词
 */
export function buildPoemPrompt(config: PoemGenerationConfig): string {
  const { style = '清新', season = '', theme = '', length = 4 } = config;
  
  const styleDesc = {
    '豪放': '气势磅礴，意境雄浑',
    '婉约': '词藻华丽，情感细腻',
    '清新': '自然流畅，意境明快',
    '深沉': '意蕴深远，耐人寻味',
    '灵动': '活泼轻快，生机盎然',
  }[style] || style;
  
  const seasonDesc = season ? `反映${season}的景色和感受` : '符合时令特点';
  const themeDesc = theme ? `以${theme}为主题` : '';
  
  const lengthDesc = length === 4 ? '绝句（四句）' : '律诗（八句）';
  
  const prompt = `请创作一首${season}${theme}${styleDesc}风格的古诗词${lengthDesc}。

具体要求：
1. 每句字数相同（五言每句5字，七言每句7字）
2. 用词典雅，符合古诗词的语言特点
3. 押韵要优美，符合格律
4. 意境要${themeDesc}，体现${styleDesc}的美感
5. ${seasonDesc}
6. 创作要有新意，不要完全抄袭古人作品

请按照以下严格的 JSON 格式返回（不要有任何额外的文字说明）：
{
  "title": "诗词标题（2-8个汉字）",
  "author": "作者名（可以是古诗人名字或 AI 诗人）",
  "dynasty": "朝代（如 唐、宋、元 等）",
  "content": ["第一句", "第二句", "第三句", "第四句"${length === 8 ? ', "第五句", "第六句", "第七句", "第八句"' : ''}]
}

注意：
- 只返回纯 JSON，不要有任何 Markdown 格式标记
- 不要有代码块标记
- 不要有任何解释或说明文字
- 确保可以被 JSON.parse() 直接解析`;

  return prompt;
}

/**
 * 调用智谱 AI 生成诗词
 */
export async function generatePoem(config: PoemGenerationConfig = {}): Promise<GeneratedPoem> {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('请先配置智谱 AI API Key');
  }

  const prompt = buildPoemPrompt(config);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          {
            role: 'system',
            content: '你是一位精通古诗词创作的 AI 诗人。请根据用户的要求创作古诗词，并严格按照 JSON 格式返回。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,  // 稍高的创造性
        top_p: 0.9,       // 多样性
        max_tokens: 1000,  // 生成的最大 token 数
        stream: false,       // 非流式，便于解析
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || `API 请求失败: ${response.status}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';

    if (!content) {
      throw new Error('AI 生成结果为空');
    }

    // 清理返回内容，移除可能的 Markdown 标记
    const cleanedContent = content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // 解析 JSON 响应
    let poemData: any;
    try {
      poemData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse AI response:', cleanedContent);
      
      // 尝试从内容中提取 JSON
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        poemData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('AI 响应格式不正确，无法解析为 JSON');
      }
    }

    // 验证数据结构
    if (!poemData.title || !poemData.content || !Array.isArray(poemData.content)) {
      throw new Error('AI 生成的诗词格式不正确');
    }

    // 为 AI 生成的诗词添加标签
    const tags: string[] = [];
    if (config.style) tags.push(config.style);
    if (config.season && config.season !== '' && config.season !== '不限') tags.push(config.season);
    if (config.theme && config.theme !== '' && config.theme !== '不限') tags.push(config.theme);
    tags.push('AI生成');

    return {
      title: poemData.title,
      author: poemData.author || 'AI诗人',
      dynasty: poemData.dynasty || '现代',
      content: poemData.content,
      ai_generated: true,
      tags,
    };
  } catch (error: any) {
    if (error.message.includes('fetch') || error.message.includes('network')) {
      throw new Error('网络请求失败，请检查网络连接');
    }
    throw error;
  }
}

/**
 * 测试 API Key 是否有效
 */
export async function testApiKey(apiKey: string): Promise<{ success: boolean; message: string; samplePoem?: GeneratedPoem }> {
  if (!apiKey) {
    return {
      success: false,
      message: '请输入 API Key',
    };
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          {
            role: 'user',
            content: '请生成一首五言绝句风格的古诗词（4句），按照严格的 JSON 格式返回，包括 title、author、dynasty、content 字段。',
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData?.error?.message || `API 请求失败 (${response.status})`,
      };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';

    if (!content) {
      return {
        success: false,
        message: 'API 响应为空',
      };
    }

    // 尝试解析返回的诗词
    let samplePoem: GeneratedPoem | undefined;
    try {
      const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      const poemData = JSON.parse(cleanedContent);
      
      samplePoem = {
        title: poemData.title || '测试诗词',
        author: poemData.author || 'AI',
        dynasty: poemData.dynasty || '现代',
        content: Array.isArray(poemData.content) ? poemData.content : ['测试第一句', '测试第二句', '测试第三句', '测试第四句'],
        ai_generated: true,
        tags: ['测试', 'AI生成'],
      };
    } catch {
      // 忽略解析错误，只验证 API Key 有效
    }

    return {
      success: true,
      message: 'API Key 有效，智谱 AI 连接成功！',
      samplePoem,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || '测试失败',
    };
  }
}

/**
 * 检查 API Key 是否已配置
 */
export function isApiKeyConfigured(): boolean {
  return !!getApiKey();
}

/**
 * 检查 API Key 是否来自环境变量（不可更改）
 */
export function isApiKeyFromEnv(): boolean {
  return !!import.meta.env.VITE_ZHIPU_AI_API_KEY;
}

/**
 * 获取 API 配置信息
 */
export function getApiConfig() {
  return {
    isConfigured: isApiKeyConfigured(),
    isFromEnv: isApiKeyFromEnv(),
    canEdit: !isApiKeyFromEnv(),
  };
}
