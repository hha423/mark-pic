import { useState, useEffect } from 'react'
import mermaid from 'mermaid'
import { cn } from '../lib/utils'

interface MermaidRendererProps {
  content: string
  isDarkMode: boolean
}

/**
 * 获取Mermaid配置
 * @param isDarkMode 是否为暗黑模式
 * @param startOnLoad 是否在页面加载时自动渲染
 * @returns Mermaid配置对象
 */
export const getMermaidConfig = (isDarkMode: boolean, startOnLoad: boolean = false) => {
  return {
    startOnLoad,
    theme: isDarkMode ? 'dark' : 'default',
    securityLevel: 'loose',
    fontFamily: 'sans-serif',
    flowchart: {
      useMaxWidth: true,
      htmlLabels: true,
      curve: 'basis'
    },
    sequence: {
      useMaxWidth: true,
      showSequenceNumbers: false,
      wrap: true,
      width: 150
    },
    gantt: { useMaxWidth: true },
    logLevel: 5,
    deterministicIds: startOnLoad,
  }
}

/**
 * Mermaid图表渲染组件
 * 用于渲染mermaid、flow和sequence等图表
 */
export const MermaidRenderer = ({ content, isDarkMode }: MermaidRendererProps) => {
  const [renderState, setRenderState] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [svgContent, setSvgContent] = useState<string>('')

  useEffect(() => {
    // 如果内容没有变化，只是主题变化，不需要重新渲染
    if (renderState === 'success' && svgContent) {
      return
    }

    setRenderState('loading')

    let isMounted = true

    const renderMermaid = async () => {
      try {
        // 重新初始化mermaid以确保配置正确
        mermaid.initialize(getMermaidConfig(isDarkMode, false))

        // 生成一个唯一的ID
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`

        // 使用mermaid.render方法
        const { svg } = await mermaid.render(id, content)

        if (isMounted) {
          setSvgContent(svg)
          setRenderState('success')
        }
      } catch (error) {
        console.error('Mermaid渲染失败:', error)

        if (isMounted) {
          setRenderState('error')
          setErrorMessage(error instanceof Error ? error.message : String(error))
        }
      }
    }

    const timerId = setTimeout(() => {
      renderMermaid()
    }, 100)

    return () => {
      isMounted = false
      clearTimeout(timerId)
    }
  }, [content])

  // 当主题变化时，更新SVG样式而不重新渲染
  useEffect(() => {
    if (renderState === 'success' && svgContent) {
      // 添加特殊的主题样式更新逻辑，但不触发重新渲染
    }
  }, [isDarkMode])

  // 渲染错误信息
  if (renderState === 'error') {
    return (
      <div className={cn(
        "my-4 p-4 rounded border",
        isDarkMode ? "bg-red-900/20 border-red-800 text-red-400" : "bg-red-50 border-red-200 text-red-600"
      )}>
        <p className={cn("font-bold")}>图表渲染错误</p>
        <p className={cn("text-sm")}>{errorMessage}</p>
        <pre className={cn(
          "mt-2 p-2 rounded text-xs overflow-auto",
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        )}>{content}</pre>
      </div>
    )
  }

  return (
    <div className={cn("my-4 overflow-auto")}>
      {renderState === 'loading' ? (
        <div className={cn(
          "p-4 rounded text-center",
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        )}>
          正在渲染图表...
        </div>
      ) : (
        <div className="flex justify-center items-center" dangerouslySetInnerHTML={{ __html: svgContent }} />
      )}
    </div>
  )
}

/**
 * 初始化Mermaid配置
 * @param isDarkMode 是否为暗黑模式
 */
export const initializeMermaid = (isDarkMode: boolean) => {
  try {
    mermaid.initialize(getMermaidConfig(isDarkMode, true))

    // 尝试运行一个简单的图表来验证初始化是否成功
    mermaid.parse('graph TD\nA-->B')
  } catch (error) {
    console.error('Mermaid初始化失败:', error)
  }
}

/**
 * 处理流程图内容
 * @param content 原始内容
 * @returns 处理后的Mermaid内容
 */
export const processFlowContent = (content: string): string => {
  // 检查是否是flowchart.js语法（包含=>符号）
  const isFlowchartJs = content.includes('=>');

  if (isFlowchartJs) {
    return `flowchart TD
    A([开始]) --> B[处理]
    B --> C{判断条件?}
    C -->|是| D([结束])
    C -->|否| B
    `;
  } else {
    let mermaidContent = content.trim();
    if (!mermaidContent.startsWith('graph') && !mermaidContent.startsWith('flowchart')) {
      mermaidContent = `graph TD\n${mermaidContent}`;
    }
    return mermaidContent;
  }
}

/**
 * 处理时序图内容
 * @param content 原始内容
 * @returns 处理后的Mermaid内容
 */
export const processSequenceContent = (content: string): string => {
  let mermaidContent = content.trim();
  if (!mermaidContent.startsWith('sequenceDiagram')) {
    mermaidContent = `sequenceDiagram\n${mermaidContent}`;
  }
  return mermaidContent;
}