import { useState } from 'react'
import { Palette, Sliders, Type } from 'lucide-react'
import type { ImageConfig } from '@/App'

interface ControlPanelProps {
  config: ImageConfig
  onChange: (config: ImageConfig) => void
  isDarkMode?: boolean
}

const LIGHT_GRADIENTS = [
  { name: '蓝紫渐变', class: 'bg-gradient-to-r from-blue-500 to-purple-600' },
  { name: '橙红渐变', class: 'bg-gradient-to-br from-orange-400 to-red-500' },
  { name: '绿青渐变', class: 'bg-gradient-to-tr from-green-400 to-cyan-500' },
  { name: '粉紫渐变', class: 'bg-gradient-to-bl from-pink-400 to-purple-500' },
  { name: '黄橙渐变', class: 'bg-gradient-to-tl from-yellow-400 to-orange-500' },
  { name: '夜空渐变', class: 'bg-gradient-to-b from-gray-900 to-blue-900' },
  { name: '日出渐变', class: 'bg-gradient-to-t from-yellow-300 to-pink-400' },
  { name: '海洋渐变', class: 'bg-gradient-to-r from-blue-400 to-teal-500' },
  { name: '森林渐变', class: 'bg-gradient-to-br from-green-500 to-emerald-600' },
  { name: '薰衣草渐变', class: 'bg-gradient-to-tr from-purple-300 to-indigo-400' },
  { name: '火焰渐变', class: 'bg-gradient-to-bl from-red-500 to-yellow-500' },
  { name: '冰雪渐变', class: 'bg-gradient-to-tl from-blue-100 to-cyan-200' },
  { name: '彩虹渐变', class: 'bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400' },
  { name: '玫瑰金渐变', class: 'bg-gradient-to-b from-pink-300 to-rose-400' },
  { name: '深海渐变', class: 'bg-gradient-to-t from-indigo-800 to-blue-800' },
  { name: '秋叶渐变', class: 'bg-gradient-to-br from-orange-500 to-red-600' },
  { name: '薄荷渐变', class: 'bg-gradient-to-tr from-green-300 to-teal-300' },
  { name: '紫罗兰渐变', class: 'bg-gradient-to-bl from-violet-400 to-purple-600' },
  { name: '金色渐变', class: 'bg-gradient-to-tl from-yellow-500 to-amber-600' },
  { name: '银河渐变', class: 'bg-gradient-to-r from-slate-800 to-purple-900' },
  { name: '樱花渐变', class: 'bg-gradient-to-b from-pink-200 to-rose-300' },
  { name: '极光渐变', class: 'bg-gradient-to-t from-green-400 to-blue-500' },
  { name: '珊瑚渐变', class: 'bg-gradient-to-br from-orange-300 to-pink-400' },
  { name: '暮色渐变', class: 'bg-gradient-to-tr from-purple-600 to-pink-600' },
  { name: '翡翠渐变', class: 'bg-gradient-to-bl from-emerald-400 to-green-500' },
  { name: '琥珀渐变', class: 'bg-gradient-to-tl from-amber-400 to-yellow-600' },
  { name: '钢蓝渐变', class: 'bg-gradient-to-r from-slate-500 to-blue-600' },
  { name: '梦幻渐变', class: 'bg-gradient-to-b from-purple-400 to-pink-400' },
  { name: '春天渐变', class: 'bg-gradient-to-t from-lime-300 to-green-400' },
  { name: '夏日渐变', class: 'bg-gradient-to-br from-yellow-400 to-red-400' },
  { name: '秋意渐变', class: 'bg-gradient-to-tr from-orange-400 to-amber-500' },
  { name: '冬雪渐变', class: 'bg-gradient-to-bl from-blue-200 to-indigo-300' },
  { name: '热带渐变', class: 'bg-gradient-to-tl from-teal-400 to-cyan-400' },
  { name: '沙漠渐变', class: 'bg-gradient-to-r from-yellow-600 to-orange-600' },
  { name: '星空渐变', class: 'bg-gradient-to-b from-indigo-900 to-purple-800' },
  { name: '晨曦渐变', class: 'bg-gradient-to-t from-orange-300 to-yellow-300' },
  { name: '黄昏渐变', class: 'bg-gradient-to-br from-red-400 to-purple-500' },
  { name: '月光渐变', class: 'bg-gradient-to-tr from-blue-300 to-indigo-400' },
  { name: '霓虹渐变', class: 'bg-gradient-to-bl from-pink-500 to-cyan-500' },
  { name: '宝石渐变', class: 'bg-gradient-to-tl from-emerald-500 to-blue-500' }
]

const DARK_GRADIENTS = [
  { name: '深蓝紫渐变', class: 'bg-gradient-to-r from-blue-800 to-purple-900' },
  { name: '暗橙红渐变', class: 'bg-gradient-to-br from-orange-700 to-red-800' },
  { name: '深绿青渐变', class: 'bg-gradient-to-tr from-green-700 to-cyan-800' },
  { name: '暗粉紫渐变', class: 'bg-gradient-to-bl from-pink-700 to-purple-800' },
  { name: '深黄橙渐变', class: 'bg-gradient-to-tl from-yellow-700 to-orange-800' },
  { name: '深夜渐变', class: 'bg-gradient-to-b from-gray-900 to-black' },
  { name: '暗日出渐变', class: 'bg-gradient-to-t from-yellow-800 to-pink-800' },
  { name: '深海渐变', class: 'bg-gradient-to-r from-blue-900 to-teal-900' },
  { name: '暗森林渐变', class: 'bg-gradient-to-br from-green-800 to-emerald-900' },
  { name: '深薰衣草渐变', class: 'bg-gradient-to-tr from-purple-800 to-indigo-900' },
  { name: '暗火焰渐变', class: 'bg-gradient-to-bl from-red-800 to-yellow-800' },
  { name: '深冰雪渐变', class: 'bg-gradient-to-tl from-blue-800 to-cyan-900' },
  { name: '暗彩虹渐变', class: 'bg-gradient-to-r from-red-800 via-yellow-800 to-blue-800' },
  { name: '深玫瑰金渐变', class: 'bg-gradient-to-b from-pink-800 to-rose-900' },
  { name: '深海渊渐变', class: 'bg-gradient-to-t from-indigo-900 to-blue-900' },
  { name: '暗秋叶渐变', class: 'bg-gradient-to-br from-orange-800 to-red-900' },
  { name: '深薄荷渐变', class: 'bg-gradient-to-tr from-green-800 to-teal-900' },
  { name: '暗紫罗兰渐变', class: 'bg-gradient-to-bl from-violet-800 to-purple-900' },
  { name: '深金色渐变', class: 'bg-gradient-to-tl from-yellow-800 to-amber-900' },
  { name: '深银河渐变', class: 'bg-gradient-to-r from-slate-900 to-purple-900' },
  { name: '暗樱花渐变', class: 'bg-gradient-to-b from-pink-500 to-rose-900' },
  { name: '深极光渐变', class: 'bg-gradient-to-t from-green-800 to-blue-900' },
  { name: '暗珊瑚渐变', class: 'bg-gradient-to-br from-orange-800 to-pink-900' },
  { name: '深暮色渐变', class: 'bg-gradient-to-tr from-purple-900 to-pink-900' },
  { name: '暗翡翠渐变', class: 'bg-gradient-to-bl from-emerald-800 to-green-900' },
  { name: '深琥珀渐变', class: 'bg-gradient-to-tl from-amber-800 to-yellow-900' },
  { name: '暗钢蓝渐变', class: 'bg-gradient-to-r from-slate-800 to-blue-900' },
  { name: '深梦幻渐变', class: 'bg-gradient-to-b from-purple-800 to-pink-900' },
  { name: '暗春天渐变', class: 'bg-gradient-to-t from-lime-800 to-green-900' },
  { name: '深夏日渐变', class: 'bg-gradient-to-br from-yellow-800 to-red-900' },
  { name: '暗秋意渐变', class: 'bg-gradient-to-tr from-orange-800 to-amber-900' },
  { name: '深冬雪渐变', class: 'bg-gradient-to-bl from-blue-800 to-indigo-900' },
  { name: '暗热带渐变', class: 'bg-gradient-to-tl from-teal-800 to-cyan-900' },
  { name: '深沙漠渐变', class: 'bg-gradient-to-r from-yellow-900 to-orange-900' },
  { name: '深星空渐变', class: 'bg-gradient-to-b from-indigo-900 to-purple-900' },
  { name: '暗晨曦渐变', class: 'bg-gradient-to-t from-orange-800 to-yellow-800' },
  { name: '深黄昏渐变', class: 'bg-gradient-to-br from-red-800 to-purple-900' },
  { name: '暗月光渐变', class: 'bg-gradient-to-tr from-blue-800 to-indigo-900' },
  { name: '深霓虹渐变', class: 'bg-gradient-to-bl from-pink-800 to-cyan-900' },
  { name: '暗宝石渐变', class: 'bg-gradient-to-tl from-emerald-800 to-blue-900' }
]

export { LIGHT_GRADIENTS, DARK_GRADIENTS }

const GRADIENT_DIRECTIONS = [
  { name: '向右', value: 'to-r' as const },
  { name: '向左', value: 'to-l' as const },
  { name: '向上', value: 'to-t' as const },
  { name: '向下', value: 'to-b' as const },
  { name: '右下', value: 'to-br' as const },
  { name: '右上', value: 'to-tr' as const }
]

export const ControlPanel: React.FC<ControlPanelProps> = ({ config, onChange, isDarkMode = false }) => {
  const [activeTab, setActiveTab] = useState<'background' | 'textBackground' | 'layout'>('background')

  const PRESET_GRADIENTS = isDarkMode ? DARK_GRADIENTS : LIGHT_GRADIENTS

  const updateConfig = (updates: Partial<ImageConfig>) => {
    onChange({ ...config, ...updates })
  }

  const updateBackground = (background: Partial<ImageConfig['background']>) => {
    updateConfig({ background: { ...config.background, ...background } })
  }

  const updateLayout = (layout: Partial<ImageConfig['layout']>) => {
    updateConfig({ layout: { ...config.layout, ...layout } })
  }

  const updateTextBackground = (textBackground: Partial<ImageConfig['textBackground']>) => {
    updateConfig({ textBackground: { ...config.textBackground, ...textBackground } })
  }

  return (
    <div className={`h-full flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* 标签页 */}
      <div className={`flex border-b transition-colors duration-300 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={() => setActiveTab('background')}
          className={`flex-1 flex items-center justify-center space-x-1 md:space-x-2 py-3 text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === 'background'
            ? `text-blue-600 border-b-2 border-blue-600 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`
            : isDarkMode
              ? 'text-gray-400 hover:text-gray-200'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <Palette className="w-3 h-3 md:w-4 md:h-4" />
          <span>背景样式</span>
        </button>
        <button
          onClick={() => setActiveTab('textBackground')}
          className={`flex-1 flex items-center justify-center space-x-1 md:space-x-2 py-3 text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === 'textBackground'
            ? `text-blue-600 border-b-2 border-blue-600 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`
            : isDarkMode
              ? 'text-gray-400 hover:text-gray-200'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <Type className="w-3 h-3 md:w-4 md:h-4" />
          <span>文本背景</span>
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex-1 flex items-center justify-center space-x-1 md:space-x-2 py-3 text-xs md:text-sm font-medium transition-all duration-200 ${activeTab === 'layout'
            ? `text-blue-600 border-b-2 border-blue-600 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`
            : isDarkMode
              ? 'text-gray-400 hover:text-gray-200'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <Sliders className="w-3 h-3 md:w-4 md:h-4" />
          <span>布局设置</span>
        </button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 p-3 md:p-4 overflow-y-auto">
        {activeTab === 'background' && (
          <div className="space-y-6">
            {/* 背景类型选择 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>背景类型</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateBackground({ type: 'preset' })}
                  className={`px-3 py-2 text-sm rounded transition-all duration-200 ${config.background.type === 'preset'
                    ? 'bg-blue-500 text-white shadow-md'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  预设渐变
                </button>
                <button
                  onClick={() => updateBackground({ type: 'custom' })}
                  className={`px-3 py-2 text-sm rounded transition-all duration-200 ${config.background.type === 'custom'
                    ? 'bg-blue-500 text-white shadow-md'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  自定义渐变
                </button>
              </div>
            </div>

            {/* 预设渐变 */}
            {config.background.type === 'preset' && (
              <div>
                <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>选择预设</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                  {PRESET_GRADIENTS.map((gradient, index) => (
                    <button
                      key={index}
                      onClick={() => updateBackground({ preset: gradient.class })}
                      className={`relative h-12 rounded-lg overflow-hidden transition-all duration-200 transform hover:scale-105 ${gradient.class} ${config.background.preset === gradient.class
                        ? 'ring-2 ring-blue-500 ring-offset-2 scale-105'
                        : 'hover:ring-2 hover:ring-gray-300'
                        }`}
                      title={gradient.name}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold text-center px-2 py-1 rounded bg-black/40 backdrop-blur-sm border border-white/20">
                          {gradient.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 自定义渐变 */}
            {config.background.type === 'custom' && (
              <div className="space-y-3 md:space-y-4">
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>起始颜色</label>
                    <input
                      type="color"
                      value={config.background.gradient?.from || '#3b82f6'}
                      onChange={(e) => updateBackground({
                        gradient: {
                          ...config.background.gradient,
                          from: e.target.value,
                          to: config.background.gradient?.to || '#8b5cf6',
                          direction: config.background.gradient?.direction || 'to-r'
                        }
                      })}
                      className={`w-full h-8 rounded border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'
                        }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>结束颜色</label>
                    <input
                      type="color"
                      value={config.background.gradient?.to || '#8b5cf6'}
                      onChange={(e) => updateBackground({
                        gradient: {
                          ...config.background.gradient,
                          from: config.background.gradient?.from || '#3b82f6',
                          to: e.target.value,
                          direction: config.background.gradient?.direction || 'to-r'
                        }
                      })}
                      className={`w-full h-8 rounded border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'
                        }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>渐变方向</label>
                  <div className="grid grid-cols-3 gap-1 md:gap-2">
                    {GRADIENT_DIRECTIONS.map((dir) => (
                      <button
                        key={dir.value}
                        onClick={() => updateBackground({
                          gradient: {
                            ...config.background.gradient,
                            from: config.background.gradient?.from || '#3b82f6',
                            to: config.background.gradient?.to || '#8b5cf6',
                            direction: dir.value
                          }
                        })}
                        className={`px-2 py-1 text-xs rounded transition-all duration-200 ${config.background.gradient?.direction === dir.value
                          ? 'bg-blue-500 text-white'
                          : isDarkMode
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {dir.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'textBackground' && (
          <div className="space-y-6">
            {/* 启用/禁用文本背景 */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>文本背景</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateTextBackground({ enabled: true })}
                  className={`px-3 py-2 text-sm rounded transition-all duration-200 ${config.textBackground.enabled
                    ? 'bg-blue-500 text-white shadow-md'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  启用
                </button>
                <button
                  onClick={() => updateTextBackground({ enabled: false })}
                  className={`px-3 py-2 text-sm rounded transition-all duration-200 ${!config.textBackground.enabled
                    ? 'bg-blue-500 text-white shadow-md'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  禁用
                </button>
              </div>
            </div>

            {/* 文本背景设置（仅在启用时显示） */}
            {config.textBackground.enabled && (
              <>
                {/* 背景类型选择 */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>背景类型</label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateTextBackground({ type: 'preset' })}
                      className={`px-3 py-2 text-sm rounded transition-all duration-200 ${config.textBackground.type === 'preset'
                        ? 'bg-blue-500 text-white shadow-md'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      预设渐变
                    </button>
                    <button
                      onClick={() => updateTextBackground({ type: 'custom' })}
                      className={`px-3 py-2 text-sm rounded transition-all duration-200 ${config.textBackground.type === 'custom'
                        ? 'bg-blue-500 text-white shadow-md'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      自定义渐变
                    </button>
                  </div>
                </div>

                {/* 预设渐变 */}
                {config.textBackground.type === 'preset' && (
                  <div>
                    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>选择预设</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                      {PRESET_GRADIENTS.map((gradient, index) => (
                        <button
                          key={index}
                          onClick={() => updateTextBackground({ preset: gradient.class })}
                          className={`relative h-12 rounded-lg overflow-hidden transition-all duration-200 transform hover:scale-105 ${gradient.class} ${config.textBackground.preset === gradient.class
                            ? 'ring-2 ring-blue-500 ring-offset-2 scale-105'
                            : 'hover:ring-2 hover:ring-gray-300'
                            }`}
                          title={gradient.name}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-xs font-bold text-center px-2 py-1 rounded bg-black/40 backdrop-blur-sm border border-white/20">
                              {gradient.name}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 自定义渐变 */}
                {config.textBackground.type === 'custom' && (
                  <div className="space-y-3 md:space-y-4">
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>起始颜色</label>
                        <input
                          type="color"
                          value={config.textBackground.gradient?.from || '#3b82f6'}
                          onChange={(e) => updateTextBackground({
                            gradient: {
                              ...config.textBackground.gradient,
                              from: e.target.value,
                              to: config.textBackground.gradient?.to || '#8b5cf6',
                              direction: config.textBackground.gradient?.direction || 'to-r'
                            }
                          })}
                          className={`w-full h-8 rounded border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'
                            }`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>结束颜色</label>
                        <input
                          type="color"
                          value={config.textBackground.gradient?.to || '#8b5cf6'}
                          onChange={(e) => updateTextBackground({
                            gradient: {
                              ...config.textBackground.gradient,
                              from: config.textBackground.gradient?.from || '#3b82f6',
                              to: e.target.value,
                              direction: config.textBackground.gradient?.direction || 'to-r'
                            }
                          })}
                          className={`w-full h-8 rounded border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'
                            }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>渐变方向</label>
                      <div className="grid grid-cols-3 gap-1 md:gap-2">
                        {GRADIENT_DIRECTIONS.map((dir) => (
                          <button
                            key={dir.value}
                            onClick={() => updateTextBackground({
                              gradient: {
                                ...config.textBackground.gradient,
                                from: config.textBackground.gradient?.from || '#3b82f6',
                                to: config.textBackground.gradient?.to || '#8b5cf6',
                                direction: dir.value
                              }
                            })}
                            className={`px-2 py-1 text-xs rounded transition-all duration-200 ${config.textBackground.gradient?.direction === dir.value
                              ? 'bg-blue-500 text-white'
                              : isDarkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                          >
                            {dir.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4 md:space-y-6">
            {/* 宽度设置 */}
            <div>
              <label className={`flex justify-between text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                <span>卡片宽度</span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{config.layout.width}px</span>
              </label>
              <input
                type="range"
                min="400"
                max="1200"
                step="50"
                value={config.layout.width}
                onChange={(e) => updateLayout({ width: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* 内边距设置 */}
            <div>
              <label className={`flex justify-between text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                <span>内边距</span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{config.layout.padding}px</span>
              </label>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={config.layout.padding}
                onChange={(e) => updateLayout({ padding: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* 外边距设置 */}
            <div>
              <label className={`flex justify-between text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                <span>外边距</span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{config.layout.margin}px</span>
              </label>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={config.layout.margin}
                onChange={(e) => updateLayout({ margin: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* 字体大小设置 */}
            <div>
              <label className={`flex justify-between text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                <span>字体大小</span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{config.layout.fontSize}px</span>
              </label>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={config.layout.fontSize}
                onChange={(e) => updateLayout({ fontSize: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            {/* 行距设置 */}
            <div>
              <label className={`flex justify-between text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                <span>行距</span>
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{config.layout.spacing}</span>
              </label>
              <input
                type="range"
                min="1"
                max="2"
                step="0.1"
                value={config.layout.spacing}
                onChange={(e) => updateLayout({ spacing: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}