import { Editor } from '@monaco-editor/react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  onToggleCollapse?: () => void
  isDarkMode?: boolean
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onToggleCollapse,
  isDarkMode = false
}) => {
  const handleEditorChange = (newValue: string | undefined) => {
    onChange(newValue || '')
  }

  return (
    <div className={`h-full flex flex-col relative z-10 ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* 编辑器工具栏 */}
      <div className={`h-10 border-b flex items-center justify-between px-3 ${
        isDarkMode
          ? 'border-gray-700 bg-gray-800'
          : 'border-gray-200 bg-white'
      }`}>
        <div className={`text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>Markdown 编辑器</div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`p-1 rounded transition-colors ${
              isDarkMode
                ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="折叠编辑器"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Monaco编辑器 */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="markdown"
          value={value}
          onChange={handleEditorChange}
          theme={isDarkMode ? "vs-dark" : "vs-light"}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 24,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            renderLineHighlight: 'none',
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            overviewRulerLanes: 0,
            padding: { top: 16, bottom: 16 },
            automaticLayout: true
          }}
        />
      </div>
    </div>
  )
}