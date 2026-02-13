import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { motion } from 'framer-motion'
import { 
  UserSettings, 
  DEFAULT_SETTINGS, 
  loadSettings, 
  saveSettings, 
  resetSettings,
  exportSettings 
} from '../types/settings'
import { 
  GeneratedPoem,
  testApiKey, 
  saveApiKey, 
  getApiConfig 
} from '../services/zhipuAI'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

// 常见诗人列表
const POPULAR_AUTHORS = [
  '李白', '杜甫', "王维", '白居易', '苏轼', 
  '李清照', '辛弃疾', '柳永', '杜牧', '李煜',
  '陆游', '王安石', '杨万里', '文天祥', '欧阳修'
]

// 季节列表
const SEASONS = ['春天', '夏天', '秋天', '冬天']

// 主题列表
const THEMES = [
  '山水', '田园', '边塞', '思乡', '爱情', 
  '离别', '忧愁', '爱国', '壮志', '自然'
]

// AI 风格列表
const AI_STYLES = ['清新', '豪放', '婉约', '深沉', '灵动']

// AI 长度列表
const AI_LENGTHS = [
  { value: 4, label: '四句绝句' },
  { value: 8, label: '八句律诗' },
]

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState<'preferences' | 'display' | 'background' | 'ai'>('preferences')
  const [isTestingApiKey, setIsTestingApiKey] = useState(false)
  const [apiKeyTestResult, setApiKeyTestResult] = useState<{ success: boolean; message: string; samplePoem?: GeneratedPoem } | null>(null)

  useEffect(() => {
    if (isOpen) {
      const loaded = loadSettings()
      setSettings(loaded)
    }
  }, [isOpen])

  const handleSave = () => {
    saveSettings(settings)
    window.electronAPI?.leaveSettings()
    onClose()
    window.location.reload()
  }

  const handleClose = () => {
    window.electronAPI?.leaveSettings()
    onClose()
  }

  const handleReset = () => {
    if (confirm('确定要重置所有设置吗？')) {
      resetSettings()
      setSettings(DEFAULT_SETTINGS)
      setApiKeyTestResult(null)
    }
  }

  const handleExport = () => {
    exportSettings(settings)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)
          if (imported.ai?.apiKey) {
            saveApiKey(imported.ai.apiKey)
          }
          setSettings({
            ...DEFAULT_SETTINGS,
            ...imported,
          })
        } catch (error) {
          alert('导入设置失败：文件格式不正确')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleTestApiKey = async () => {
    if (!settings.ai.apiKey) {
      setApiKeyTestResult({
        success: false,
        message: '请先输入 API Key'
      })
      return
    }

    setIsTestingApiKey(true)
    setApiKeyTestResult(null)

    try {
      const result = await testApiKey(settings.ai.apiKey)
      setApiKeyTestResult(result)
      if (result.success) {
        saveApiKey(settings.ai.apiKey)
      }
    } catch (error: any) {
      setApiKeyTestResult({
        success: false,
        message: error.message || '测试失败'
      })
    } finally {
      setIsTestingApiKey(false)
    }
  }

  if (!isOpen) return null

  const apiConfig = getApiConfig()

  return ReactDOM.createPortal(
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-0 z-[9999] bg-paper text-ink flex flex-col font-serif"
    >
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-muted/10">
          <h2 className="text-2xl font-bold tracking-wide text-ink">
            设置
          </h2>
          <button
            onClick={handleClose}
            className="text-muted hover:text-ink transition-colors p-2 rounded-full hover:bg-muted/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 选项卡 */}
        <div className="flex px-8 border-b border-muted/10 gap-8 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden">
          {[
            { id: 'preferences', label: '偏好' },
            { id: 'display', label: '显示' },
            { id: 'background', label: '背景' },
            { id: 'ai', label: '智能' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 text-base tracking-widest transition-all relative ${
                activeTab === tab.id
                  ? 'text-ink font-bold'
                  : 'text-muted hover:text-ink/80'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" 
                />
              )}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="p-8 overflow-y-auto flex-1 bg-white/30 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-muted/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted/40">
          {/* 偏好设置 */}
          {activeTab === 'preferences' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <section>
                <label className="block text-lg font-medium text-ink mb-4 flex items-center gap-2">
                   <span className="w-1 h-4 bg-accent rounded-full inline-block"></span>
                   喜欢的诗人
                </label>
                <div className="flex flex-wrap gap-3">
                  {POPULAR_AUTHORS.map((author) => (
                    <button
                      key={author}
                      onClick={() => {
                        const newAuthors = settings.preferences.favoriteAuthors.includes(author)
                          ? settings.preferences.favoriteAuthors.filter(a => a !== author)
                          : [...settings.preferences.favoriteAuthors, author];
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, favoriteAuthors: newAuthors },
                        });
                      }}
                      className={`px-4 py-1.5 rounded-full text-sm transition-all border ${
                        settings.preferences.favoriteAuthors.includes(author)
                          ? 'bg-ink text-paper border-ink shadow-md'
                          : 'bg-white/50 text-ink/70 border-muted/20 hover:border-ink/50'
                      }`}
                    >
                      {author}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="block text-lg font-medium text-ink mb-4 flex items-center gap-2">
                   <span className="w-1 h-4 bg-accent rounded-full inline-block"></span>
                   季节主题
                </label>
                <div className="flex gap-4 mb-6">
                  {SEASONS.map((season) => (
                    <button
                      key={season}
                      onClick={() => {
                        const newSeasons = settings.preferences.favoriteSeasons.includes(season)
                          ? settings.preferences.favoriteSeasons.filter(s => s !== season)
                          : [...settings.preferences.favoriteSeasons, season];
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, favoriteSeasons: newSeasons },
                        });
                      }}
                      className={`px-6 py-2 rounded-lg text-sm transition-all border ${
                        settings.preferences.favoriteSeasons.includes(season)
                          ? 'bg-secondary text-white border-secondary shadow-md'
                          : 'bg-white/50 text-ink/70 border-muted/20 hover:border-secondary/50'
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {THEMES.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => {
                        const newThemes = settings.preferences.favoriteThemes.includes(theme)
                          ? settings.preferences.favoriteThemes.filter(t => t !== theme)
                          : [...settings.preferences.favoriteThemes, theme];
                        setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, favoriteThemes: newThemes },
                        });
                      }}
                      className={`px-3 py-2 rounded-lg text-sm transition-all border ${
                        settings.preferences.favoriteThemes.includes(theme)
                          ? 'bg-accent text-white border-accent shadow-sm'
                          : 'bg-white/50 text-ink/70 border-muted/20 hover:border-accent/50'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* 显示设置 */}
          {activeTab === 'display' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <section>
                <label className="block text-lg font-medium text-ink mb-4">诗词来源</label>
                <div className="flex gap-4 p-1 bg-muted/10 rounded-xl">
                  <button
                    onClick={() => setSettings({ ...settings, ai: { ...settings.ai, enabled: false } })}
                    className={`flex-1 px-6 py-3 rounded-lg text-sm transition-all ${
                      !settings.ai.enabled
                        ? 'bg-white shadow-sm text-ink font-bold'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    本地精选
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, ai: { ...settings.ai, enabled: true } })}
                    className={`flex-1 px-6 py-3 rounded-lg text-sm transition-all ${
                      settings.ai.enabled
                        ? 'bg-white shadow-sm text-secondary font-bold'
                        : 'text-muted hover:text-ink'
                      }`}
                  >
                    AI 智能生成
                  </button>
                </div>
               </section>

               <section>
                 <label className="block text-lg font-medium text-ink mb-4">显示元素</label>
                 <div className="space-y-3">
                    {[
                      { key: 'showSolarTerm', label: '显示节气' },
                      { key: 'showDynasty', label: '显示朝代' },
                      { key: 'showAuthor', label: '显示作者' }
                    ].map(item => (
                       <label key={item.key} className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-muted/10 cursor-pointer hover:bg-white/80 transition-colors">
                          <span className="text-ink">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={(settings.display as any)[item.key]}
                            onChange={(e) => setSettings({
                              ...settings,
                              display: { ...settings.display, [item.key]: e.target.checked }
                            })}
                            className="w-5 h-5 accent-secondary"
                          />
                       </label>
                    ))}
                 </div>
               </section>
            </div>
          )}

          {/* 背景设置 */}
          {activeTab === 'background' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <section className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">背景模糊度</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.background.blur}
                      onChange={(e) => setSettings({
                        ...settings,
                        background: { ...settings.background, blur: parseInt(e.target.value) }
                      })}
                      className="w-full h-2 bg-muted/20 rounded-lg appearance-none cursor-pointer accent-ink"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-2">遮罩透明度</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.background.opacity}
                      onChange={(e) => setSettings({
                        ...settings,
                        background: { ...settings.background, opacity: parseInt(e.target.value) }
                      })}
                      className="w-full h-2 bg-muted/20 rounded-lg appearance-none cursor-pointer accent-ink"
                    />
                  </div>
               </section>
            </div>
          )}

          {/* AI 设置 */}
          {activeTab === 'ai' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <section>
                 <label className="block text-lg font-medium text-ink mb-4">API 配置</label>
                 <div className="space-y-4">
                    <input
                      type="password"
                      placeholder="sk-..."
                      value={settings.ai.apiKey}
                      onChange={(e) => setSettings({ ...settings, ai: { ...settings.ai, apiKey: e.target.value } })}
                      disabled={apiConfig.isFromEnv}
                      className="w-full px-4 py-3 bg-white/50 border border-muted/20 rounded-lg focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-all"
                    />
                    <div className="flex justify-between items-center">
                       <a href="https://open.bigmodel.cn/usercenter/apikeys" target="_blank" className="text-xs text-accent hover:underline">获取 API Key</a>
                       <button
                        onClick={handleTestApiKey}
                        disabled={isTestingApiKey || !settings.ai.apiKey}
                        className="px-6 py-2 bg-ink text-paper rounded-lg hover:bg-ink/90 transition-colors disabled:opacity-50 text-sm"
                       >
                         {isTestingApiKey ? '连接中...' : '测试连通性'}
                       </button>
                    </div>
                    {/* 测试结果反馈区 */}
                    {apiKeyTestResult && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className={`p-4 rounded-lg text-sm border ${
                          apiKeyTestResult.success ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'
                        }`}
                      >
                        {apiKeyTestResult.message}
                      </motion.div>
                    )}
                 </div>
               </section>

               {settings.ai.enabled && (
                 <section className="space-y-6 pt-6 border-t border-muted/10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3 className="text-lg font-medium text-ink mb-4 flex items-center gap-2">
                      <span className="w-1 h-4 bg-secondary rounded-full inline-block"></span>
                      生成配置
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">风格</label>
                        <select
                          value={settings.ai.generation.style}
                          onChange={(e) => setSettings({
                            ...settings,
                            ai: { ...settings.ai, generation: { ...settings.ai.generation, style: e.target.value } }
                          })}
                          className="w-full px-3 py-2 bg-white/50 border border-muted/20 rounded-lg focus:outline-none focus:border-secondary transition-colors"
                        >
                          {AI_STYLES.map(style => <option key={style} value={style}>{style}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">季节</label>
                        <select
                          value={settings.ai.generation.season}
                          onChange={(e) => setSettings({
                            ...settings,
                            ai: { ...settings.ai, generation: { ...settings.ai.generation, season: e.target.value } }
                          })}
                          className="w-full px-3 py-2 bg-white/50 border border-muted/20 rounded-lg focus:outline-none focus:border-secondary transition-colors"
                        >
                          <option value="不限">不限</option>
                          {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">主题</label>
                        <select
                          value={settings.ai.generation.theme}
                          onChange={(e) => setSettings({
                            ...settings,
                            ai: { ...settings.ai, generation: { ...settings.ai.generation, theme: e.target.value } }
                          })}
                          className="w-full px-3 py-2 bg-white/50 border border-muted/20 rounded-lg focus:outline-none focus:border-secondary transition-colors"
                        >
                          <option value="不限">不限</option>
                          {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">长度</label>
                        <div className="flex gap-2">
                          {AI_LENGTHS.map(len => (
                            <button
                              key={len.value}
                              onClick={() => setSettings({
                                ...settings,
                                ai: { ...settings.ai, generation: { ...settings.ai.generation, length: len.value } }
                              })}
                              className={`flex-1 py-2 text-xs rounded-lg border transition-all ${
                                settings.ai.generation.length === len.value
                                  ? 'bg-secondary text-white border-secondary'
                                  : 'bg-white/50 text-muted border-muted/20 hover:border-secondary/50'
                              }`}
                            >
                              {len.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                 </section>
               )}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-between px-8 py-6 border-t border-muted/10 bg-white/40 backdrop-blur-sm">
          <div className="flex gap-4">
            <button onClick={handleReset} className="text-sm text-muted hover:text-red-600 transition-colors">重置</button>
            <button onClick={handleExport} className="text-sm text-muted hover:text-ink transition-colors">导出配置</button>
            <label className="text-sm text-muted hover:text-ink transition-colors cursor-pointer">
               导入配置
               <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
          <button
            onClick={handleSave}
            className="px-8 py-2.5 bg-ink text-paper rounded-lg hover:bg-ink/90 hover:scale-105 transition-all shadow-lg font-medium tracking-wide"
          >
            保存生效
          </button>
        </div>
      </motion.div>,
    document.body
  )
}
