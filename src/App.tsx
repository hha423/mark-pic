import { useState, useRef, useEffect } from 'react'
import { toPng } from 'html-to-image'
import { MarkdownEditor } from '@/components/MarkdownEditor'
import { ImagePreview, type ImagePreviewRef } from '@/components/ImagePreview'
import { Header } from '@/components/Header'
import { ControlPanel, LIGHT_GRADIENTS, DARK_GRADIENTS } from '@/components/ControlPanel'
import { ToastContainer, type ToastProps } from '@/components/Toast'

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
  const [markdown, setMarkdown] = useState(`# 春江花月夜

> 春江潮水连海平，海上明月共潮生。
> 滟滟随波千万里，何处春江无月明！

江流宛转绕芳甸，月照花林皆似霰。
空里流霜不觉飞，汀上白沙看不见。

## 诗韵悠长

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

*愿君多采撷，此物最相思。*`)
  const [config, setConfig] = useState<ImageConfig>(defaultConfig)
  const [showControls, setShowControls] = useState(false)
  const [editorCollapsed, setEditorCollapsed] = useState(false)
  const [editorWidth, setEditorWidth] = useState(LAYOUT_CONSTANTS.DEFAULT_EDITOR_WIDTH)
  const [isDragging, setIsDragging] = useState(false)
  const [showCollapseWarning, setShowCollapseWarning] = useState(false)
  const [collapseTimer, setCollapseTimer] = useState<NodeJS.Timeout | null>(null)
  const [toasts, setToasts] = useState<ToastProps[]>([])
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // 检查用户是否有保存的偏好设置
    const savedTheme = localStorage.getItem('markpic-theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    // 如果没有保存的设置，则根据系统偏好设置
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const previewRef = useRef<ImagePreviewRef>(null)

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
    if (config.background.type === 'preset' && config.background.preset) {
      // 查找当前预设在亮色模式下的索引
      const lightIndex = LIGHT_GRADIENTS.findIndex((g: any) => g.class === config.background.preset)
      // 查找当前预设在暗色模式下的索引
      const darkIndex = DARK_GRADIENTS.findIndex((g: any) => g.class === config.background.preset)
      
      // 如果找到了对应的索引，则切换到对应模式的相同索引预设
      if (isDarkMode && lightIndex !== -1 && lightIndex < DARK_GRADIENTS.length) {
        setConfig(prev => ({
          ...prev,
          background: {
            ...prev.background,
            preset: DARK_GRADIENTS[lightIndex].class
          }
        }))
      } else if (!isDarkMode && darkIndex !== -1 && darkIndex < LIGHT_GRADIENTS.length) {
        setConfig(prev => ({
          ...prev,
          background: {
            ...prev.background,
            preset: LIGHT_GRADIENTS[darkIndex].class
          }
        }))
      }
    }
  }, [isDarkMode])

  const handleToggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    // 保存用户的主题偏好
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

  const handleCopy = async () => {
    try {
      const element = previewRef.current?.getPreviewElement()
      if (!element) return
      
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        skipFonts: true,
        filter: (node) => {
          const linkElement = node as HTMLLinkElement
          if (node.tagName === 'LINK' && linkElement.href && linkElement.href.includes('monaco-editor')) {
            return false
          }
          return true
        }
      })
      
      // 将data URL转换为blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
      // 复制到剪贴板
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      
      showToast('success', '复制成功', '图片已复制到剪贴板！')
    } catch (error) {
      console.error('复制失败:', error)
      showToast('error', '复制失败', '请重试或检查浏览器权限')
    }
  }

  const handleExport = async () => {
    try {
      const element = previewRef.current?.getPreviewElement()
      if (!element) return
      
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        skipFonts: true,
        filter: (node) => {
          const linkElement = node as HTMLLinkElement
          if (node.tagName === 'LINK' && linkElement.href && linkElement.href.includes('monaco-editor')) {
            return false
          }
          return true
        }
      })
      
      // 创建下载链接
      const link = document.createElement('a')
      link.download = `markpic-${Date.now()}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      showToast('success', '导出成功', '图片已保存到下载文件夹')
    } catch (error) {
      console.error('导出失败:', error)
      showToast('error', '导出失败', '请重试或检查浏览器权限')
    }
  }

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
      />
      
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
          <div className={`w-12 border-r flex-shrink-0 flex flex-col items-center justify-start pt-4 ${
            isDarkMode
              ? 'border-gray-700 bg-gray-800'
              : 'border-gray-200 bg-white'
          }`}>
            <button
              onClick={() => {
                setEditorCollapsed(false)
                setEditorWidth(LAYOUT_CONSTANTS.DEFAULT_EDITOR_WIDTH)
              }}
              className={`p-2 rounded-md transition-colors ${
                isDarkMode
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
              className={`w-1 h-full cursor-col-resize flex-shrink-0 transition-all duration-200 relative group ${
                showCollapseWarning
                  ? 'bg-orange-400 hover:bg-orange-500'
                  : isDarkMode
                    ? 'bg-gray-600 hover:bg-blue-400'
                    : 'bg-gray-200 hover:bg-blue-400'
              }`}
              onMouseDown={handleMouseDown}
            >
              <div
                className={`absolute inset-y-0 -left-2 -right-2 transition-colors ${
                  showCollapseWarning
                    ? 'group-hover:bg-orange-400/20'
                    : 'group-hover:bg-blue-400/20'
                }`}
                onMouseDown={handleMouseDown}
              ></div>
            </div>
            
            {/* 折叠警告提示 */}
            {showCollapseWarning && (
              <div className={`absolute top-1/2 left-2 transform -translate-y-1/2 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 pointer-events-none transition-colors ${
                collapseTimer ? 'bg-red-500' : 'bg-orange-500'
              }`}>
                {collapseTimer ? '即将折叠编辑器...' : '继续向左拖动将折叠编辑器'}
                <div className={`absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent ${
                  collapseTimer ? 'border-r-red-500' : 'border-r-orange-500'
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
      
      {/* Toast 通知容器 */}
      <ToastContainer toasts={toasts} onClose={removeToast} isDarkMode={isDarkMode} />
    </div>
  )
}

export default App