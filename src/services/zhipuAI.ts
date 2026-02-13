/**
 * 智谱 AI 服务
 * 参考项目：taoli-ai
 * 文档：https://open.bigmodel.cn/dev/api#chat/completions
 */

export interface PoemGenerationConfig {
  style?: string          // 风格：豪放、婉约、清新、深沉等
  season?: string         // 季节：春、夏、秋、冬
  theme?: string          // 主题：山水、田园、边塞、思乡等
  length?: number          // 长度：4句、8句等
}

export interface GeneratedPoem {
  title: string
  author: string
  dynasty: string
  content: string[]
  ai_generated: boolean
}

// API 端点
const API_ENDPOINT = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const MODEL_ID = 'glm-4'; // 智谱 GLM-4 模型

/**
 * 获取 API Key
 * 从环境变量或配置中获取
 */
export function getApiKey(): string {
  // 优先从环境变量获取
  const envKey = import.meta.env.VITE_ZHIPU_AI_API_KEY;
  if (envKey) {
    return envKey;
  }

  // 从 localStorage 获取（用户手动配置）
  const storedKey = localStorage.getItem('zhipu_ai_api_key');
  if (storedKey) {
    return storedKey;
  }

  return '';
}

/**
 * 保存 API Key
 */
export function setApiKey(key: string): void {
  localStorage.setItem('zhipu_ai_api_key', key);
}

/**
 * 构建生成诗词的提示词
 */
export function buildPoemPrompt(config: PoemGenerationConfig): string {
  const { style = '清新', season = '不限', theme = '不限', length = 4 } = config;

  const prompt = `请生成一首${season !== '不限' ? season : ''}${theme !== '不限' ? theme : ''}风格的${style}古诗词。

要求：
1. 格式为五言或七言绝句（${length}句）
2. 每句字数要相同（五言每句5字，七言每句7字）
3. 用词要典雅，符合古诗词的特点
4. 韵律要优美，平仄要协调
5. 不要使用现代口语和网络用语

请按照以下 JSON 格式返回（不要有其他文字）：
{
  "title": "诗词标题（4-8字）",
  "author": "作者名（可以使用著名诗人或编造）",
  "dynasty": "朝代（唐、宋、五代等）",
  "content": ["第一句", "第二句", "第三句", "第四句"]
}

注意：
- 只返回 JSON，不要有任何说明文字
- title 字段要有意义，符合诗词内容
- author 和 dynasty 要匹配`;

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
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,  // 稍高的创造性
        top_p: 0.9,       // 多样性
        max_tokens: 500,   // 生成的最大 token 数
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData?.error?.message || `API 请求失败: ${response.status}`;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';

    if (!content) {
      throw new Error('生成结果为空');
    }

    // 解析 JSON 响应
    let poemData: any;
    try {
      // 尝试提取 JSON（可能被其他文字包裹）
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        poemData = JSON.parse(jsonMatch[0]);
      } else {
        // 如果没有 JSON，尝试直接解析
        poemData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('AI 响应格式不正确，请重试');
    }

    // 验证数据结构
    if (!poemData.title || !poemData.content || !Array.isArray(poemData.content)) {
      throw new Error('AI 生成的诗词格式不正确');
    }

    return {
      title: poemData.title,
      author: poemData.author || 'AI',
      dynasty: poemData.dynasty || '现代',
      content: poemData.content,
      ai_generated: true,
    };
  } catch (error: any) {
    if (error.message.includes('fetch')) {
      throw new Error('网络请求失败，请检查网络连接');
    }
    throw error;
  }
}

/**
 * 模拟生成诗词（用于开发和测试）
 */
export async function generatePoemMock(config: PoemGenerationConfig = {}): Promise<GeneratedPoem> {
  const { style = '清新', season = '春', theme = '山水' } = config;

  // 简单的模拟逻辑
  const mockPoems: Record<string, GeneratedPoem> = {
    '春山水': {
      title: '春日山水',
      author: 'AI诗人',
      dynasty: '现代',
      content: ['春山如黛草如烟', '绿水潺潺绕客船', '鸟语花香春意暖', '清风拂面柳丝连'],
      ai_generated: true,
    },
    '夏田园': {
      title: '夏夜田园',
      author: 'AI诗人',
      dynasty: '现代',
      content: ['夏夜微风拂面来', '稻花香气满庭开', '蛙声一片田间闹', '月影婆娑上楼台'],
      ai_generated: true,
    },
    '秋边塞': {
      title: '秋日边塞',
      author: 'AI诗人',
      dynasty: '现代',
      content: ['边塞秋霜染草黄', '孤烟落日照残阳', '征人望断家山路', '铁马冰河梦故乡'],
      ai_generated: true,
    },
    '冬思乡': {
      title: '冬日思乡',
      author: 'AI诗人',
      dynasty: '现代',
      content: ['雪花飞舞满庭院', '寒风凛冽透衣衫', '游子天涯思故土', '梦回故里泪阑干'],
      ai_generated: true,
    },
  };

  const key = `${season}${theme}`;
  return mockPoems[key] || mockPoems['春山水'];
}

/**
 * 检查 API Key 是否配置
 */
export function isApiKeyConfigured(): boolean {
  return !!getApiKey();
}

/**
 * 检查是否使用模拟模式
 */
export function useMockMode(): boolean {
  // 从环境变量或配置中读取
  return import.meta.env.VITE_USE_MOCK_AI === 'true' || false;
}
