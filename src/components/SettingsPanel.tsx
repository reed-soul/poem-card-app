import React, { useState, useEffect } from 'react'
import { 
  UserSettings, 
  DEFAULT_SETTINGS, 
  loadSettings, 
  saveSettings, 
  resetSettings,
  exportSettings 
} from '../types/settings'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

// 常见诗人列表
const POPULAR_AUTHORS = [
  '李白', '杜甫', '王维', '白居易', '苏轼', 
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

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [activeTab, setActiveTab] = useState<'preferences' | 'display' | 'background'>('preferences')

  // 加载设置
  useEffect(() => {
    const loaded = loadSettings()
    setSettings(loaded)
  }, [])

  // 保存设置
  const handleSave = () => {
    saveSettings(settings)
    onClose()
    window.location.reload() // 重新加载以应用设置
  }

  // 重置设置
  const handleReset = () => {
    if (confirm('确定要重置所有设置吗？')) {
      resetSettings()
      setSettings(DEFAULT_SETTINGS)
    }
  }

  // 导出设置
  const handleExport = () => {
    exportSettings(settings)
  }

  // 导入设置
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)
          setSettings({
            ...DEFAULT_SETTINGS,
            ...imported,
          })
          saveSettings({
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            ⚙️ 设置
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 选项卡 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'preferences', label: '🎯 偏好' },
            { id: 'display', label: '🖥️ 显示' },
            { id: 'background', label: '🎨 背景' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
              )}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* 偏好设置 */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* 喜欢的诗人 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  喜欢的诗人
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {POPULAR_AUTHORS.map((author) => (
                    <button
                      key={author}
                      onClick={() => {
                        const newAuthors = settings.preferences.favoriteAuthors.includes(author)
                          ? settings.preferences.favoriteAuthors.filter(a => a !== author)
                          : [...settings.preferences.favoriteAuthors, author];
                        setSettings({
                          ...settings,
                          preferences: {
                            ...settings.preferences,
                            favoriteAuthors: newAuthors,
                          },
                        });
                      }}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        settings.preferences.favoriteAuthors.includes(author)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {author}
                    </button>
                  ))}
                </div>
              </div>

              {/* 喜欢的季节 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  喜欢的季节
                </label>
                <div className="flex gap-2">
                  {SEASONS.map((season) => (
                    <button
                      key={season}
                      onClick={() => {
                        const newSeasons = settings.preferences.favoriteSeasons.includes(season)
                          ? settings.preferences.favoriteSeasons.filter(s => s !== season)
                          : [...settings.preferences.favoriteSeasons, season];
                        setSettings({
                          ...settings,
                          preferences: {
                            ...settings.preferences,
                            favoriteSeasons: newSeasons,
                          },
                        });
                      }}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        settings.preferences.favoriteSeasons.includes(season)
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {season}
                    </button>
                  ))}
                </div>
              </div>

              {/* 喜欢的主题 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  喜欢的主题
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => {
                        const newThemes = settings.preferences.favoriteThemes.includes(theme)
                          ? settings.preferences.favoriteThemes.filter(t => t !== theme)
                          : [...settings.preferences.favoriteThemes, theme];
                        setSettings({
                          ...settings,
                          preferences: {
                            ...settings.preferences,
                            favoriteThemes: newThemes,
                          },
                        });
                      }}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        settings.preferences.favoriteThemes.includes(theme)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 显示设置 */}
          {activeTab === 'display' && (
            <div className="space-y-6">
              {/* 每天显示的诗词数量 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  每天显示的诗词数量
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.display.poemsPerDay}
                  onChange={(e) => {
                    const value = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                    setSettings({
                      ...settings,
                      display: {
                        ...settings.display,
                        poemsPerDay: value,
                      },
                    });
                  }}
                  className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* 显示选项 */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.display.showSolarTerm}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        display: {
                          ...settings.display,
                          showSolarTerm: e.target.checked,
                        },
                      });
                    }}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">显示节气信息</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.display.showDynasty}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        display: {
                          ...settings.display,
                          showDynasty: e.target.checked,
                        },
                      });
                    }}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">显示朝代</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.display.showAuthor}
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        display: {
                          ...settings.display,
                          showAuthor: e.target.checked,
                        },
                      });
                    }}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">显示作者</span>
                </label>
              </div>
            </div>
          )}

          {/* 背景设置 */}
          {activeTab === 'background' && (
            <div className="space-y-6">
              {/* 背景来源 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  背景图片来源
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSettings({
                        ...settings,
                        background: {
                          ...settings.background,
                          source: 'online',
                        },
                      });
                    }}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      settings.background.source === 'online'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    在线图片
                  </button>
                  <button
                    onClick={() => {
                      setSettings({
                        ...settings,
                        background: {
                          ...settings.background,
                          source: 'local',
                        },
                      });
                    }}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      settings.background.source === 'local'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    本地图片
                  </button>
                </div>
              </div>

              {/* 背景模糊度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  背景模糊度: {settings.background.blur}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.background.blur}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      background: {
                        ...settings.background,
                        blur: parseInt(e.target.value),
                      },
                    });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* 背景透明度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  背景透明度: {settings.background.opacity}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.background.opacity}
                  onChange={(e) => {
                    setSettings({
                      ...settings,
                      background: {
                        ...settings.background,
                        opacity: parseInt(e.target.value),
                      },
                    });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              重置
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              导出
            </button>
            <label className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">
              导入
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  )
}
