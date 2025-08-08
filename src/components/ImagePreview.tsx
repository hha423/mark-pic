import { useRef, forwardRef, useImperativeHandle } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { ImageConfig } from '@/App'

interface ImagePreviewProps {
  markdown: string
  config: ImageConfig
  isDarkMode?: boolean
}

export interface ImagePreviewRef {
  getPreviewElement: () => HTMLDivElement | null
}

export const ImagePreview = forwardRef<ImagePreviewRef, ImagePreviewProps>(({ markdown, config, isDarkMode = false }, ref) => {
  const previewRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    getPreviewElement: () => previewRef.current
  }))

  const getBackgroundStyle = () => {
    if (config.background.type === 'preset' && config.background.preset) {
      return { className: config.background.preset, style: {} }
    }
    
    if (config.background.type === 'custom' && config.background.gradient) {
      const { from, to, direction } = config.background.gradient
      const directionMap = {
        'to-r': 'to right',
        'to-l': 'to left',
        'to-t': 'to top',
        'to-b': 'to bottom',
        'to-br': 'to bottom right',
        'to-tr': 'to top right',
        'to-bl': 'to bottom left',
        'to-tl': 'to top left'
      }
      return {
        className: '',
        style: {
          background: `linear-gradient(${directionMap[direction] || 'to right'}, ${from}, ${to})`
        }
      }
    }
    
    return { className: 'bg-gradient-to-r from-blue-500 to-purple-600', style: {} }
  }

  const cardStyle = {
    width: config.layout.width,
    padding: config.layout.padding,
    margin: config.layout.margin,
    fontSize: config.layout.fontSize,
    lineHeight: config.layout.spacing
  }

  const backgroundStyle = getBackgroundStyle()
  
  return (
    <div className={`w-full h-full p-6 overflow-auto ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="flex justify-center items-start py-8">
        <div
          ref={previewRef}
          className={`${backgroundStyle.className} rounded-xl shadow-lg p-8 inline-block`}
          style={backgroundStyle.style}
        >
          <div
            style={cardStyle}
            className={`${isDarkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm rounded-lg shadow-inner`}
          >
            <div className={`prose ${isDarkMode ? 'prose-invert' : 'prose-gray'} max-w-none`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  h1: ({ children }) => (
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-4 leading-tight`}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-3 leading-tight`}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} mb-2 leading-tight`}>
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 leading-relaxed`}>
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className={`list-disc list-inside mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className={`list-decimal list-inside mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className={`border-l-4 ${isDarkMode ? 'border-blue-300 bg-blue-900/30' : 'border-blue-400 bg-blue-50/80'} pl-4 py-2 my-4 rounded-r`}>
                      {children}
                    </blockquote>
                  ),
                  code({ node, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    const isInline = !match
                    if (!isInline) {
                      const language = match ? match[1] : 'text'
                      return (
                        <div className="my-4">
                          <SyntaxHighlighter
                            style={oneDark as any}
                            language={language}
                            PreTag="div"
                            className="text-sm rounded-md !bg-gray-800"
                            customStyle={{
                              background: '#1e293b',
                              padding: '1rem',
                              borderRadius: '0.375rem'
                            }}
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                      )
                    }
                    return (
                      <code className={`${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-gray-100'} px-1.5 py-0.5 rounded text-sm font-mono`} {...props}>
                        {children}
                      </code>
                    )
                  },
                  strong: ({ children }) => (
                    <strong className={`font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className={`italic ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{children}</em>
                  )
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})