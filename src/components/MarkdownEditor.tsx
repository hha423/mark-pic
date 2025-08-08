// import MDEditor, { commands } from '@uiw/react-md-editor';
import MDEditor from '@uiw/react-md-editor';
import { useEffect } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onToggleCollapse?: () => void;
  isDarkMode?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onToggleCollapse,
  isDarkMode = false
}) => {
  // 设置暗黑模式
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-color-mode', 'dark');
    } else {
      document.documentElement.setAttribute('data-color-mode', 'light');
    }
  }, [isDarkMode]);

  // 处理值变化
  const handleChange = (newValue: string | undefined) => {
    onChange(newValue || '');
  };

  return (
    <div className={`h-full flex flex-col relative z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
      {/* 编辑器工具栏 */}
      <div className={`h-10 border-b flex items-center justify-between px-3 ${isDarkMode
          ? 'border-gray-700 bg-gray-800'
          : 'border-gray-200 bg-white'
        }`}>
        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>Markdown 编辑器</div>
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`p-1 rounded transition-colors ${isDarkMode
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

      {/* Markdown编辑器 */}
      <div className="flex-1 overflow-hidden">
        <MDEditor
          value={value}
          onChange={handleChange}
          height="100%"
          preview="edit"
          hideToolbar={false}
          enableScroll={true}
          visibleDragbar={false}
          // commands={[
          //   commands.bold, commands.italic, commands.strikethrough,
          //   commands.hr, commands.divider, commands.heading, commands.divider,
          //   commands.quote, commands.divider, commands.link,
          //   commands.image, commands.divider, commands.code, commands.codeBlock
          // ]}
          extraCommands={[
            // commands.divider,
            // commands.fullscreen
          ]}
          textareaProps={{
            placeholder: '请输入Markdown内容...',
            style: {
              fontSize: '14px',
              lineHeight: '1.5',
              padding: '16px',
            }
          }}
          previewOptions={{
            rehypePlugins: [],
            remarkPlugins: []
          }}
        />
      </div>
    </div>
  );
};