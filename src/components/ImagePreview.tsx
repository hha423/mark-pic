import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import type { ImageConfig } from '@/App'
import 'katex/dist/katex.min.css'

import { getBackgroundStyle, getTextColor, getTextBackgroundStyle, getCardStyle } from '@/utils/styleUtils'
import { initializeMermaid } from '@/components/MermaidRenderer'
import { createMarkdownComponents } from '@/components/MarkdownComponents'

interface ImagePreviewProps {
  markdown: string
  config: ImageConfig
  isDarkMode?: boolean
  isDesktop?: boolean
}

export interface ImagePreviewRef {
  getPreviewElement: () => HTMLDivElement | null
}

export const ImagePreview = forwardRef<ImagePreviewRef, ImagePreviewProps>(({ markdown, config, isDarkMode = false, isDesktop = true }, ref) => {
  const previewRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeMermaid(isDarkMode)
  }, [isDarkMode])

  useImperativeHandle(ref, () => ({
    getPreviewElement: () => previewRef.current
  }))

  const backgroundStyle = getBackgroundStyle(config)
  const textColor = getTextColor(config, isDarkMode)
  const textBackgroundStyle = getTextBackgroundStyle(config, isDarkMode)
  const cardStyle = getCardStyle(config)

  return (
    <div className={`w-full h-full overflow-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
      <div
        ref={containerRef}
        className={`${isDesktop ? 'justify-center' : ''} items-start p-4 min-h-full ${!isDesktop ? 'overflow-x-auto' : ''}`}
      >
        <div
          ref={previewRef}
          className={`${backgroundStyle.className} rounded-xl shadow-lg inline-block ${isDesktop ? 'mx-auto' : 'ml-0'}`}
          style={{
            ...backgroundStyle.style,
            minHeight: '80%',
            padding: `${Math.max(8, config.layout.margin)}px`,
            width: `${config.layout.width + (config.layout.margin * 2)}px`
          }}
        >
          <div
            style={{
              ...cardStyle,
              width: cardStyle.width,
              padding: cardStyle.padding,
              margin: 0,
              ...textBackgroundStyle.style
            }}
            className={`${textBackgroundStyle.className} backdrop-blur-sm rounded-lg shadow-inner overflow-hidden`}
          >
            <div className={`prose ${isDarkMode ? 'prose-invert' : 'prose-gray'} max-w-none`}>

              <ReactMarkdown
                remarkPlugins={[
                  remarkGfm,
                  remarkBreaks,
                  remarkMath
                ]}
                rehypePlugins={[
                  rehypeKatex,
                  rehypeRaw
                ]}
                components={createMarkdownComponents(textColor, isDarkMode, markdown)}
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