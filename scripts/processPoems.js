const fs = require('fs');
const path = require('path');

// 生僻字列表（需要过滤的）
const rareChars = new Set([
  '貞', '妝', '蕪', '澆', '夤', '妤', '遜', '麴', '榘', '鎮',
  '嵐', '徑', '煙', '鏡', '繡', '鵥', '齲', '麺', '鸂', '鵼',
  '驥', '巇', '霪', '徠', '驚', '鍡', '魚', '鸤', '鴟',
  '籴', '蕡', '蕢', '鍉', '犧', '麭', '鵙',
  '覓', '憒', '櫛', '巖', '隈', '岞', '嶾', '巘', '嶫',
  '澀', '澗', '瀹', '澢', '澹', '灋', '灔', '瀍', '瀎',
  '蟪', '蟬', '蜙', '蜴', '蜠', '螮', '蟞', '蟡', '蟠',
  '獲', '獪', '獼', '獽', '獮', '獵', '獹', '獺', '獻',
  '罵', '羈', '羉', '羋', '羌',
  '聯', '聹', '聺', '聻', '聼', '聽', '聾',
  '駭', '駮', '駲', '駯', '駰', '駱',
  '驟', '驃', '驪', '驫', '驩',
]);

// 关键词映射（用于自动打标签）
const keywordTags = {
  // 季节
  '春': ['春天'],
  '夏': ['夏天'],
  '秋': ['秋天'],
  '冬': ['冬天'],
  
  // 主题
  '花': ['花卉'],
  '月': ['月亮'],
  '雨': ['雨'],
  '雪': ['雪'],
  '风': ['风'],
  '云': ['云'],
  '山': ['山林'],
  '水': ['水'],
  '河': ['江河'],
  '湖': ['湖泊'],
  '海': ['大海'],
  '楼': ['登高'],
  '亭': ['建筑'],
  '寺': ['寺庙'],
  '桥': ['桥梁'],
  '梅': ['梅花'],
  '荷': ['荷花'],
  '菊': ['菊花'],
  '枫': ['枫叶'],
  '柳': ['柳树'],
  '松': ['松树'],
  '竹': ['竹子'],
  '桃': ['桃花'],
  '李': ['花卉'],
  '燕': ['鸟类'],
  '鵰': ['鸟类'],
  '雁': ['鸟类'],
  '鶯': ['鸟类'],
  '蝶': ['昆虫'],
  '蜂': ['昆虫'],
  
  // 情感
  '思': ['相思', '思乡'],
  '愁': ['忧愁'],
  '悲': ['悲伤'],
  '喜': ['欢乐'],
  '乐': ['欢乐'],
  '欢': ['欢乐'],
  '恨': ['恨'],
  '别': ['离别'],
  '离': ['离别'],
  '归': ['思乡'],
  '梦': ['梦境'],
  '忆': ['怀旧'],
  '念': ['相思'],
  '情': ['情感'],
  '爱': ['爱情'],
  '醉': ['醉意'],
  '醒': ['清醒'],
  '泪': ['悲伤'],
  
  // 时间
  '夜': ['夜晚'],
  '晚': ['傍晚'],
  '朝': ['清晨'],
  '晨': ['清晨'],
  '夕': ['傍晚'],
  '暮': ['傍晚'],
  '旦': ['清晨'],
  '午': ['中午'],
  
  // 状态
  '独': ['孤独'],
  '孤': ['孤独'],
  '闲': ['闲适'],
  '忙': ['忙碌'],
  '静': ['幽静'],
  '动': ['动态'],
  '远': ['遥远'],
  '近': ['亲近'],
  '高': ['高远'],
  '低': ['低矮'],
  
  // 意象
  '酒': ['酒'],
  '茶': ['茶'],
  '琴': ['音乐'],
  '歌': ['音乐'],
  '舞': ['舞蹈'],
  '诗': ['诗词'],
  '书': ['书籍'],
  '画': ['绘画'],
  '棋': ['下棋'],
  
  // 自然
  '天': ['天空'],
  '地': ['大地'],
  '日': ['太阳'],
  '星': ['星星'],
  '霜': ['霜'],
  '雾': ['雾'],
  '雷': ['雷'],
  '电': ['闪电'],
  
  // 动物
  '牛': ['动物'],
  '马': ['动物'],
  '羊': ['动物'],
  '猪': ['动物'],
  '狗': ['动物'],
  '猫': ['动物'],
  '鸡': ['动物'],
  '鸭': ['动物'],
  '鹅': ['动物'],
  '鸟': ['鸟类'],
  '鱼': ['鱼类'],
  '虫': ['昆虫'],
};

/**
 * 检查诗词是否包含生僻字
 */
function hasRareChar(content) {
  for (let char of content) {
    if (rareChars.has(char)) {
      return true;
    }
  }
  return false;
}

/**
 * 提取标签
 */
function extractTags(poem) {
  const tags = new Set();
  const content = poem.paragraphs.join('');
  
  // 检查标题
  const title = poem.title || '';
  for (const [keyword, tagList] of Object.entries(keywordTags)) {
    if (title.includes(keyword) || content.includes(keyword)) {
      tagList.forEach(tag => tags.add(tag));
    }
  }
  
  // 如果没有匹配到标签，添加默认标签
  if (tags.size === 0) {
    tags.add('日常');
  }
  
  return Array.from(tags);
}

/**
 * 处理诗词数据
 */
function processPoem(poem) {
  // 过滤条件
  const content = poem.paragraphs.join('');
  
  // 1. 过滤掉生僻字
  if (hasRareChar(content)) {
    return null;
  }
  
  // 2. 过滤掉"句"（残句）
  if (poem.title.includes('句')) {
    return null;
  }
  
  // 3. 过滤掉太长的诗（超过8句）
  if (poem.paragraphs.length > 8) {
    return null;
  }
  
  // 4. 过滤掉太短的词牌（少于3句）
  if (poem.paragraphs.length < 2) {
    return null;
  }
  
  // 提取标签
  const tags = extractTags(poem);
  
  return {
    title: poem.title,
    author: poem.author,
    dynasty: '唐', // 默认为唐，后续可以根据文件判断
    content: poem.paragraphs,
    tags: tags
  };
}

/**
 * 主函数
 */
async function main() {
  console.log('开始处理诗词数据...');
  
  // 读取现有数据
  const existingFile = path.join(__dirname, '../src/data/poems精选.json');
  const existingPoems = JSON.parse(fs.readFileSync(existingFile, 'utf-8'));
  console.log(`现有诗词: ${existingPoems.length}首`);
  
  // 从GitHub获取更多数据
  const urls = [
    'https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/%E5%85%A8%E5%94%90%E8%AF%97/poet.song.0.json',
    'https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/%E5%85%A8%E5%94%90%E8%AF%97/poet.song.1000.json',
    'https://raw.githubusercontent.com/chinese-poetry/chinese-poetry/master/%E5%85%A8%E5%94%90%E8%AF%97/poet.song.2000.json'
  ];
  
  const allPoems = [...existingPoems];
  
  for (const url of urls) {
    console.log(`正在处理: ${url}`);
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      for (const poem of data) {
        const processed = processPoem(poem);
        if (processed) {
          allPoems.push(processed);
        }
      }
      
      console.log(`已处理: ${data.length}首, 新增: ${allPoems.length - existingPoems.length}首`);
      
      // 限制总数，避免过多
      if (allPoems.length >= 500) {
        break;
      }
    } catch (error) {
      console.error(`处理失败: ${url}`, error);
    }
  }
  
  // 去重（基于标题和作者）
  const uniquePoems = [];
  const seen = new Set();
  
  for (const poem of allPoems) {
    const key = `${poem.title}-${poem.author}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniquePoems.push(poem);
    }
  }
  
  console.log(`去重后总计: ${uniquePoems.length}首`);
  
  // 保存数据
  const outputFile = path.join(__dirname, '../src/data/poems精选.json');
  fs.writeFileSync(outputFile, JSON.stringify(uniquePoems, null, 2), 'utf-8');
  
  console.log(`数据已保存到: ${outputFile}`);
  console.log('处理完成！');
}

main().catch(console.error);
