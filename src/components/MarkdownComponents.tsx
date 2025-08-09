import type { Components } from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MermaidRenderer, processFlowContent, processSequenceContent } from './MermaidRenderer'
import { cn } from '../lib/utils'

/**
 * 创建自定义Markdown组件
 * @param textColor 文本颜色
 * @param isDarkMode 是否为暗黑模式
 * @param markdown 原始Markdown内容
 * @returns 自定义组件对象
 */
export const createMarkdownComponents = (textColor: string, isDarkMode: boolean, markdown: string): Components => {
  // 目录组件
  const TableOfContents = () => {
    return (
      <div className={cn(
        "mb-6 p-4 rounded-lg border",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
      )}>
        <h3 className="text-lg font-medium mb-2" style={{ color: textColor }}>目录</h3>
        <ul className="space-y-1 list-disc list-inside" style={{ color: textColor }}>
          {/* 提取标题并生成目录 */}
          {markdown.split('\n')
            .filter(line => line.startsWith('#'))
            .map((line, index) => {
              const level = line.match(/^#+/)?.[0].length || 0;
              if (level > 3) return null;

              const title = line.replace(/^#+\s+/, '');
              const indent = (level - 1) * 16;

              return (
                <li key={index} style={{ marginLeft: indent }}>
                  {title}
                </li>
              );
            })}
        </ul>
      </div>
    )
  }

  return {
    p: ({ children, ...props }) => {
      if (children && typeof children === 'string' && children.toString().trim().toLowerCase() === '[toc]') {
        return <TableOfContents />
      }
      return (
        <p className={cn("mb-3 leading-relaxed")} style={{ color: textColor }} {...props}>
          {children}
        </p>
      )
    },
    h1: ({ children, ...props }) => (
      <h1 className={cn("text-2xl font-bold mb-4 leading-tight")} style={{ color: textColor }} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className={cn("text-xl font-semibold mb-3 leading-tight")} style={{ color: textColor }} {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className={cn("text-lg font-medium mb-2 leading-tight")} style={{ color: textColor }} {...props}>
        {children}
      </h3>
    ),
    ul: ({ children, ...props }) => (
      <ul className={cn("list-disc list-inside mb-4 space-y-1")} style={{ color: textColor }} {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className={cn("list-decimal list-inside mb-4 space-y-1")} style={{ color: textColor }} {...props}>
        {children}
      </ol>
    ),
    table: ({ children, ...props }) => (
      <div className={cn("my-4 overflow-x-auto")}>
        <table className={cn(
          "min-w-full border-collapse border",
          isDarkMode ? "border-gray-700 text-white" : "border-gray-300 text-black"
        )} {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className={cn(
        isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"
      )} {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody className={cn(
        "divide-y",
        isDarkMode ? "divide-gray-700 text-white" : "divide-gray-300 text-black"
      )} {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr className={cn(
        isDarkMode ? "hover:bg-gray-800 text-white" : "hover:bg-gray-50 text-black"
      )} {...props}>
        {children}
      </tr>
    ),
    th: ({ children, ...props }) => (
      <th className={cn(
        "border px-4 py-2 text-left font-medium",
        isDarkMode ? "border-gray-700 text-white" : "border-gray-300 text-black"
      )} {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className={cn(
        "border px-4 py-2",
        isDarkMode ? "border-gray-700 text-white" : "border-gray-300 text-black"
      )} {...props}>
        {children}
      </td>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className={cn(
        "border-l-4 pl-4 py-2 my-4 rounded-r",
        isDarkMode ? "border-blue-300 bg-blue-900/30" : "border-blue-400 bg-blue-50/80"
      )} {...props}>
        {children}
      </blockquote>
    ),
    code: ({ node, className, children, ref, ...props }) => {
      const match = /language-(\w+)/.exec(className || '')
      const isInline = !match

      if (!isInline) {
        const language = match ? match[1] : 'text'
        const content = String(children).replace(/\n$/, '')

        if (language === 'mermaid') {
          return <MermaidRenderer content={content} isDarkMode={isDarkMode} />
        }

        if (language === 'flow') {
          const mermaidContent = processFlowContent(content)
          return <MermaidRenderer content={mermaidContent} isDarkMode={isDarkMode} />
        }

        if (language === 'sequence') {
          const mermaidContent = processSequenceContent(content)
          return <MermaidRenderer content={mermaidContent} isDarkMode={isDarkMode} />
        }

        return (
          <div className={cn("my-4")}>
            <SyntaxHighlighter
              style={oneDark as any}
              language={language}
              PreTag="div"
              className={cn("text-sm rounded-md !bg-gray-800")}
              customStyle={{
                background: '#1e293b',
                padding: '1rem',
                borderRadius: '0.375rem'
              }}
            >
              {content}
            </SyntaxHighlighter>
          </div>
        )
      }
      return (
        <code className={cn(
          "px-1.5 py-0.5 rounded text-sm font-mono",
          isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-800 text-gray-100"
        )} {...props}>
          {children}
        </code>
      )
    },
    strong: ({ children, ...props }) => (
      <strong className={cn("font-bold")} style={{ color: textColor }} {...props}>
        {children}
      </strong>
    ),
    em: ({ children, ...props }) => (
      <em className={cn("italic")} style={{ color: textColor }} {...props}>
        {children}
      </em>
    )
  }
}