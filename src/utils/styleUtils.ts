/**
 * 样式处理工具函数
 */
import type { ImageConfig } from '@/App'
import { getTextColorForBackground, extractMainColorFromGradient, calculateBrightness } from './colorUtils'

// 渐变方向映射
export const directionMap: Record<string, string> = {
  'to-r': 'to right',
  'to-l': 'to left',
  'to-t': 'to top',
  'to-b': 'to bottom',
  'to-br': 'to bottom right',
  'to-tr': 'to top right',
  'to-bl': 'to bottom left',
  'to-tl': 'to top left'
};

/**
 * 获取背景样式
 * @param config 图片配置
 * @returns 背景样式对象
 */
export const getBackgroundStyle = (config: ImageConfig) => {
  if (config.background.type === 'preset' && config.background.preset) {
    return { className: config.background.preset, style: {} }
  }

  if (config.background.type === 'custom' && config.background.gradient) {
    const { from, to, direction } = config.background.gradient
    return {
      className: '',
      style: {
        background: `linear-gradient(${directionMap[direction] || 'to right'}, ${from}, ${to})`
      }
    }
  }

  return { className: 'bg-gradient-to-r from-blue-500 to-purple-600', style: {} }
}

/**
 * 获取文本颜色
 * @param config 图片配置
 * @param isDarkMode 是否为暗黑模式
 * @returns 文本颜色
 */
export const getTextColor = (config: ImageConfig, isDarkMode: boolean): string => {
  if (!config.textBackground.enabled) {
    return isDarkMode ? '#ffffff' : '#000000'
  }

  if (config.textBackground.type === 'preset' && config.textBackground.preset) {
    // 检查预设是否为浅色（包含-100到-300的颜色）
    const isLightPreset = /-([1-3]00)/.test(config.textBackground.preset);

    // 在暗黑模式下，如果是浅色预设，返回适合深色背景的文本颜色（白色）
    if (isDarkMode && isLightPreset) {
      return '#ffffff'
    }

    // 从预设渐变中提取主要颜色
    const mainColor = extractMainColorFromGradient(config.textBackground.preset)
    return getTextColorForBackground(mainColor)
  }

  if (config.textBackground.type === 'custom' && config.textBackground.gradient) {
    // 对于自定义渐变，我们计算起始颜色和结束颜色的平均亮度
    const { from, to } = config.textBackground.gradient
    const avgBrightness = (calculateBrightness(from) + calculateBrightness(to)) / 2
    return avgBrightness > 128 ? '#000000' : '#ffffff'
  }

  // 默认情况
  return isDarkMode ? '#ffffff' : '#000000'
}

/**
 * 获取文本背景样式
 * @param config 图片配置
 * @param isDarkMode 是否为暗黑模式
 * @returns 文本背景样式对象
 */
export const getTextBackgroundStyle = (config: ImageConfig, isDarkMode: boolean) => {
  if (!config.textBackground.enabled) {
    return { className: isDarkMode ? 'bg-gray-800/95' : 'bg-white/95', style: {} }
  }

  if (config.textBackground.type === 'preset' && config.textBackground.preset) {
    // 检查预设是否为浅色（包含-100到-300的颜色）
    const isLightPreset = /-([1-3]00)/.test(config.textBackground.preset);

    if (isDarkMode && isLightPreset) {
      return { className: 'bg-blue-200/30', style: {} }
    }

    return { className: config.textBackground.preset, style: {} }
  }

  if (config.textBackground.type === 'custom' && config.textBackground.gradient) {
    const { from, to, direction } = config.textBackground.gradient
    return {
      className: '',
      style: {
        background: `linear-gradient(${directionMap[direction] || 'to right'}, ${from}, ${to})`
      }
    }
  }

  // 当文本背景启用但没有具体设置时，返回适合当前模式的默认背景色
  return { className: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50/80', style: {} }
}

/**
 * 获取卡片样式
 * @param config 图片配置
 * @returns 卡片样式对象
 */
export const getCardStyle = (config: ImageConfig) => {
  return {
    width: config.layout.width,
    padding: config.layout.padding,
    margin: config.layout.margin,
    fontSize: config.layout.fontSize,
    lineHeight: config.layout.spacing
  }
}