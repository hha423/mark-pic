import { useState, useRef, useEffect } from 'react'
import { MarkdownEditor } from '@/components/MarkdownEditor'
import { ImagePreview, type ImagePreviewRef } from '@/components/ImagePreview'
import { Header } from '@/components/Header'
import { ControlPanel, LIGHT_GRADIENTS, DARK_GRADIENTS } from '@/components/ControlPanel'
import { ToastContainer, type ToastProps } from '@/components/Toast'
import { MobileWarning } from '@/components/MobileWarning'
import { ExportProgress } from '@/components/ExportProgress'
import { exportElementToPng, downloadImage, copyImageToClipboard } from '@/utils/exportUtils'
import { Edit, Eye, Settings, Copy, Download } from 'lucide-react'

export interface ImageConfig {
  background: {
    type: 'preset' | 'custom'
    preset?: string
    gradient?: {
      from: string
      to: string
      direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-tr' | 'to-bl' | 'to-tl'
    }
  }
  textBackground: {
    enabled: boolean
    type: 'preset' | 'custom'
    preset?: string
    gradient?: {
      from: string
      to: string
      direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-tr' | 'to-bl' | 'to-tl'
    }
  }
  layout: {
    width: number
    padding: number
    margin: number
    fontSize: number
    spacing: number
  }
}

const defaultConfig: ImageConfig = {
  background: {
    type: 'preset',
    preset: 'bg-gradient-to-r from-blue-500 to-purple-600'
  },
  textBackground: {
    enabled: false,
    type: 'preset',
    preset: 'bg-gradient-to-r from-blue-100 to-purple-200'
  },
  layout: {
    width: 800,
    padding: 40,
    margin: 20,
    fontSize: 16,
    spacing: 1.5
  }
}

// 布局常量
const LAYOUT_CONSTANTS = {
  DEFAULT_EDITOR_WIDTH: 30,
  MIN_EDITOR_WIDTH: 20,
  MAX_EDITOR_WIDTH: 60,
  COLLAPSE_THRESHOLD: 20,
  WARNING_THRESHOLD: 23,
  COLLAPSE_DELAY: 5000,
}

function App() {
  const [markdown, setMarkdown] = useState(`## 春江花月夜

> 春江潮水连海平，海上明月共潮生。
> 滟滟随波千万里，何处春江无月明！

江流宛转绕芳甸，月照花林皆似霰。
空里流霜不觉飞，汀上白沙看不见。

### 诗韵悠长

- **江天一色无纤尘**，皎皎空中孤月轮
- **江畔何人初见月**，江月何年初照人
- **人生代代无穷已**，江月年年只相似

\`\`\`javascript
// 用代码诠释诗意
const poetry = {
  title: "春江花月夜",
  author: "张若虚",
  beauty: "永恒与瞬间的对话"
};
\`\`\`

![e1604019539295.jpg](https://static-cse.canva.cn/blob/239388/e1604019539295.jpg)

*愿君多采撷，此物最相思。*

### 流程图测试

### 测试流程图导出功能

下面是一个测试流程图，用于验证导出功能是否正常：

\`\`\`mermaid
flowchart TD
    A([开始]) --> B[处理]
    B --> C{判断条件?}
    C -->|是| D([结束])
    C -->|否| B
\`\`\`

### 另一个流程图示例

\`\`\`mermaid
graph LR
    A[用户输入] --> B{验证数据}
    B -->|有效| C[保存数据]
    B -->|无效| D[显示错误]
    C --> E[返回成功]
    D --> F[返回失败]
\`\`\`

### 时序图示例

\`\`\`mermaid
sequenceDiagram
    participant U as 用户
    participant S as 系统
    participant D as 数据库
    
    U->>S: 提交请求
    S->>D: 查询数据
    D-->>S: 返回结果
    S-->>U: 显示结果
\`\`\`

## ☕ 赞赏支持

如果这个项目对你有帮助，欢迎请我喝杯咖啡 ☕

<img src="https://github.com/alterem/MarkPic/blob/main/docs/reward-code.jpg?raw=true" alt="赞赏码" width="300" />

*"一杯咖啡，一声鼓励。"*
`)
  const [config, setConfig] = useState<ImageConfig>(defaultConfig)
  const [showControls, setShowControls] = useState(false)
  const [editorCollapsed, setEditorCollapsed] = useState(false)
  const [editorWidth, setEditorWidth] = useState(LAYOUT_CONSTANTS.DEFAULT_EDITOR_WIDTH)
  const [isDragging, setIsDragging] = useState(false)
  const [showCollapseWarning, setShowCollapseWarning] = useState(false)
  const [collapseTimer, setCollapseTimer] = useState<NodeJS.Timeout | null>(null)
  const [toasts, setToasts] = useState<ToastProps[]>([])
  const [exportProgress, setExportProgress] = useState<string>('')
  const [isExporting, setIsExporting] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 检查用户是否有保存的偏好设置
    const savedTheme = localStorage.getItem('markpic-theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    // 如果没有保存的设置，则根据系统偏好设置
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'settings'>('editor')
  const previewRef = useRef<ImagePreviewRef>(null)

  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      // 检测移动设备的多种方法
      const userAgent = navigator.userAgent.toLowerCase()
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone']
      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword))

      // 检测屏幕尺寸
      const isSmallScreen = window.innerWidth <= 768

      // 检测触摸设备
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

      // 综合判断
      const mobile = isMobileUA || (isSmallScreen && isTouchDevice)
      setIsMobile(mobile)
    }

    checkMobile()

    // 监听窗口大小变化和方向变化
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在用户没有手动设置过主题时才自动跟随系统
      const savedTheme = localStorage.getItem('markpic-theme')
      if (!savedTheme) {
        setIsDarkMode(e.matches)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // 智能切换预设背景：当暗黑模式切换时，自动切换到对应的预设
  useEffect(() => {
    let updatedConfig = { ...config }
    let needsUpdate = false

    // 切换卡片背景
    if (config.background.type === 'preset' && config.background.preset) {
      const lightIndex = LIGHT_GRADIENTS.findIndex((g: any) => g.class === config.background.preset)
      const darkIndex = DARK_GRADIENTS.findIndex((g: any) => g.class === config.background.preset)

      if (isDarkMode && lightIndex !== -1 && lightIndex < DARK_GRADIENTS.length) {
        updatedConfig.background = {
          ...updatedConfig.background,
          preset: DARK_GRADIENTS[lightIndex].class
        }
        needsUpdate = true
      } else if (!isDarkMode && darkIndex !== -1 && darkIndex < LIGHT_GRADIENTS.length) {
        updatedConfig.background = {
          ...updatedConfig.background,
          preset: LIGHT_GRADIENTS[darkIndex].class
        }
        needsUpdate = true
      }
    }

    // 切换文本背景
    if (config.textBackground.enabled && config.textBackground.type === 'preset' && config.textBackground.preset) {
      const lightIndex = LIGHT_GRADIENTS.findIndex((g: any) => g.class === config.textBackground.preset)
      const darkIndex = DARK_GRADIENTS.findIndex((g: any) => g.class === config.textBackground.preset)

      if (isDarkMode && lightIndex !== -1 && lightIndex < DARK_GRADIENTS.length) {
        updatedConfig.textBackground = {
          ...updatedConfig.textBackground,
          preset: DARK_GRADIENTS[lightIndex].class
        }
        needsUpdate = true
      } else if (!isDarkMode && darkIndex !== -1 && darkIndex < LIGHT_GRADIENTS.length) {
        updatedConfig.textBackground = {
          ...updatedConfig.textBackground,
          preset: LIGHT_GRADIENTS[darkIndex].class
        }
        needsUpdate = true
      }
    }

    // 只有在需要更新时才调用setConfig
    if (needsUpdate) {
      setConfig(updatedConfig)
    }
  }, [isDarkMode])

  const handleToggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('markpic-theme', newDarkMode ? 'dark' : 'light')
  }

  const showToast = (type: 'success' | 'error' | 'warning' | 'info', title: string, message?: string, duration = 3000) => {
    const id = Date.now().toString()
    const newToast: ToastProps = {
      id,
      type,
      title,
      message,
      duration,
      onClose: removeToast
    }
    setToasts(prev => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  // 生成图片并执行后续操作的通用函数
  const handleImageAction = async (actionType: 'copy' | 'export') => {
    try {
      const element = previewRef.current?.getPreviewElement()
      if (!element) return

      setIsExporting(true)
      setExportProgress('开始导出...')

      // 使用工具函数导出图片，带进度回调
      const dataUrl = await exportElementToPng(element, isDarkMode, (step) => {
        setExportProgress(step)
      })

      // 根据操作类型和设备类型执行不同操作
      if (actionType === 'export' || isMobile) {
        // 导出操作或移动设备：直接下载
        downloadImage(dataUrl)
        showToast('success', actionType === 'export' ? '导出成功' : '图片已生成', '已保存到下载文件夹')
      } else {
        // 复制操作（桌面端）：尝试复制到剪贴板
        const copySuccess = await copyImageToClipboard(dataUrl)

        if (copySuccess) {
          showToast('success', '复制成功', '图片已复制到剪贴板！')
        } else {
          // 剪贴板API失败时，提供下载选项作为备选
          downloadImage(dataUrl)
          showToast('warning', '复制失败，已下载图片', '请检查浏览器权限')
        }
      }
    } catch (error) {
      console.error(`${actionType === 'copy' ? '复制' : '导出'}失败:`, error)
      showToast('error', `${actionType === 'copy' ? '复制' : '导出'}失败`, '请重试或检查浏览器兼容性')
    } finally {
      setIsExporting(false)
      setExportProgress('')
    }
  }

  const handleCopy = () => handleImageAction('copy')
  const handleExport = () => handleImageAction('export')

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const container = document.querySelector('.main-container') as HTMLElement
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

    // 如果拖动到折叠阈值以下，启动延迟折叠
    if (newWidth < LAYOUT_CONSTANTS.COLLAPSE_THRESHOLD) {
      if (!collapseTimer) {
        const timer = setTimeout(() => {
          setEditorCollapsed(true)
          setIsDragging(false)
          setShowCollapseWarning(false)
          setCollapseTimer(null)
        }, LAYOUT_CONSTANTS.COLLAPSE_DELAY)
        setCollapseTimer(timer)
      }
      return
    } else {
      // 如果移出折叠区域，取消延迟折叠
      if (collapseTimer) {
        clearTimeout(collapseTimer)
        setCollapseTimer(null)
      }
    }

    // 显示/隐藏折叠警告
    setShowCollapseWarning(newWidth < LAYOUT_CONSTANTS.WARNING_THRESHOLD)

    // 限制宽度在最小值到最大值之间
    const clampedWidth = Math.max(
      LAYOUT_CONSTANTS.MIN_EDITOR_WIDTH,
      Math.min(LAYOUT_CONSTANTS.MAX_EDITOR_WIDTH, newWidth)
    )
    setEditorWidth(clampedWidth)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setShowCollapseWarning(false)
    // 清除折叠定时器
    if (collapseTimer) {
      clearTimeout(collapseTimer)
      setCollapseTimer(null)
    }
  }

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging])

  return (
    <div className={`h-screen flex flex-col relative transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header
        onToggleControls={() => setShowControls(!showControls)}
        onCopy={handleCopy}
        onExport={handleExport}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        isMobile={isMobile}
      />

      {/* 桌面端布局 */}
      {!isMobile && (
        <div className="flex-1 flex overflow-hidden main-container">
          {/* 左侧编辑器 */}
          {!editorCollapsed && (
            <div
              className={`flex-shrink-0 border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
              style={{ width: `${editorWidth}%` }}
            >
              <MarkdownEditor
                value={markdown}
                onChange={setMarkdown}
                onToggleCollapse={() => setEditorCollapsed(true)}
                isDarkMode={isDarkMode}
              />
            </div>
          )}

          {/* 折叠后的编辑器按钮 */}
          {editorCollapsed && (
            <div className={`w-12 border-r flex-shrink-0 flex flex-col items-center justify-start pt-4 ${isDarkMode
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-200 bg-white'
              }`}>
              <button
                onClick={() => {
                  setEditorCollapsed(false)
                  setEditorWidth(LAYOUT_CONSTANTS.DEFAULT_EDITOR_WIDTH)
                }}
                className={`p-2 rounded-md transition-colors ${isDarkMode
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                title="展开编辑器"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* 可拖动的分隔条 */}
          {!editorCollapsed && (
            <div className="relative flex-shrink-0">
              <div
                className={`w-1 h-full cursor-col-resize flex-shrink-0 transition-all duration-200 relative group ${showCollapseWarning
                  ? 'bg-orange-400 hover:bg-orange-500'
                  : isDarkMode
                    ? 'bg-gray-600 hover:bg-blue-400'
                    : 'bg-gray-200 hover:bg-blue-400'
                  }`}
                onMouseDown={handleMouseDown}
              >
                <div
                  className={`absolute inset-y-0 -left-2 -right-2 transition-colors ${showCollapseWarning
                    ? 'group-hover:bg-orange-400/20'
                    : 'group-hover:bg-blue-400/20'
                    }`}
                  onMouseDown={handleMouseDown}
                ></div>
              </div>

              {/* 折叠警告提示 */}
              {showCollapseWarning && (
                <div className={`absolute top-1/2 left-2 transform -translate-y-1/2 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 pointer-events-none transition-colors ${collapseTimer ? 'bg-red-500' : 'bg-orange-500'
                  }`}>
                  {collapseTimer ? '即将折叠编辑器...' : '继续向左拖动将折叠编辑器'}
                  <div className={`absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent ${collapseTimer ? 'border-r-red-500' : 'border-r-orange-500'
                    }`}></div>
                </div>
              )}
            </div>
          )}

          {/* 右侧预览 */}
          <div className="flex-1 min-w-0">
            <ImagePreview
              ref={previewRef}
              markdown={markdown}
              config={config}
              isDarkMode={isDarkMode}
              isDesktop={true}
            />
          </div>

          {/* 右侧控制面板 */}
          {showControls && (
            <div className={`w-80 border-l flex-shrink-0 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <ControlPanel
                config={config}
                onChange={setConfig}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
        </div>
      )}

      {/* 移动端Tab布局 */}
      {isMobile && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab内容区域 */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'editor' && (
              <div className="h-full">
                <MarkdownEditor
                  value={markdown}
                  onChange={setMarkdown}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="h-full flex flex-col">
                <div className={`flex justify-between items-center px-3 py-2 border-b border-gray-300 bg-opacity-80 backdrop-blur-sm sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    预览
                  </div>
                  <div className="flex space-x-2">
                    {
                      false && (
                        <button
                          onClick={handleCopy}
                          className={`flex items-center space-x-1 px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${isDarkMode
                            ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>复制</span>
                        </button>
                      )
                    }
                    <button
                      onClick={handleExport}
                      className="flex items-center space-x-1 px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all duration-200"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>导出</span>
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <ImagePreview
                    ref={previewRef}
                    markdown={markdown}
                    config={config}
                    isDarkMode={isDarkMode}
                    isDesktop={false}
                  />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="h-full">
                <ControlPanel
                  config={config}
                  onChange={setConfig}
                  isDarkMode={isDarkMode}
                />
              </div>
            )}
          </div>

          {/* 底部Tab导航 */}
          <div className={`flex border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex-1 py-3 flex flex-col items-center justify-center space-y-1 transition-colors ${activeTab === 'editor'
                ? isDarkMode
                  ? 'text-blue-400 bg-gray-700'
                  : 'text-blue-600 bg-gray-100'
                : isDarkMode
                  ? 'text-gray-400'
                  : 'text-gray-500'
                }`}
            >
              <Edit className="w-5 h-5" />
              <span className="text-xs">编辑</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-3 flex flex-col items-center justify-center space-y-1 transition-colors ${activeTab === 'preview'
                ? isDarkMode
                  ? 'text-blue-400 bg-gray-700'
                  : 'text-blue-600 bg-gray-100'
                : isDarkMode
                  ? 'text-gray-400'
                  : 'text-gray-500'
                }`}
            >
              <Eye className="w-5 h-5" />
              <span className="text-xs">预览</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-3 flex flex-col items-center justify-center space-y-1 transition-colors ${activeTab === 'settings'
                ? isDarkMode
                  ? 'text-blue-400 bg-gray-700'
                  : 'text-blue-600 bg-gray-100'
                : isDarkMode
                  ? 'text-gray-400'
                  : 'text-gray-500'
                }`}
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs">设置</span>
            </button>
          </div>
        </div>
      )}

      {/* 导出进度提示 */}
      <ExportProgress
        isVisible={isExporting}
        progress={exportProgress}
        isDarkMode={isDarkMode}
      />

      {/* Toast 通知容器 */}
      <ToastContainer toasts={toasts} onClose={removeToast} isDarkMode={isDarkMode} />

      {/* 移动端访问提示 */}
      <MobileWarning isDarkMode={isDarkMode} />
    </div>
  )
}

export default App