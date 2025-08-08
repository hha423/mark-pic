import React, { useState } from 'react'
import { Settings, Download, Copy, Moon, Sun, Info, X, Github } from 'lucide-react'

interface HeaderProps {
  onToggleControls: () => void
  onCopy: () => void
  onExport: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export const Header: React.FC<HeaderProps> = ({
  onToggleControls,
  onCopy,
  onExport,
  isDarkMode,
  onToggleDarkMode
}) => {
  const [showAbout, setShowAbout] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setShowAbout(false)
      setIsClosing(false)
    }, 200)
  }

  return (
    <>
    <header className={`h-12 border-b flex items-center justify-between px-4 relative z-50 transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center space-x-2">
        <img src="./mdtopic-icon.svg" alt="MarkPic" width="20" height="20" />
        <h1 className={`text-lg font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>MarkPic</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowAbout(true)}
          className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
            isDarkMode
              ? 'text-gray-300 hover:text-white hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
          title="关于 MarkPic"
        >
          <Info className="w-4 h-4" />
        </button>
        
        <button
          onClick={onToggleDarkMode}
          className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
            isDarkMode
              ? 'text-gray-300 hover:text-white hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
          title={isDarkMode ? '切换到亮色模式' : '切换到暗黑模式'}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        
        <button
          onClick={onToggleControls}
          className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
            isDarkMode
              ? 'text-gray-300 hover:text-white hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>样式设置</span>
        </button>
        
        <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
        
        <button
          onClick={onCopy}
          className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-all duration-200 ${
            isDarkMode
              ? 'text-gray-300 hover:text-white hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
          }`}
        >
          <Copy className="w-4 h-4" />
          <span>复制</span>
        </button>
        
        <button
          onClick={onExport}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-all duration-200 transform hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>导出</span>
        </button>
      </div>
    </header>

    {/* About Modal */}
    {showAbout && (
      <div
        className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-[100] transition-opacity duration-200 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      >
        <div
          className={`max-w-md w-full mx-4 rounded-lg shadow-xl transform transition-all duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } ${
            isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>关于 MarkPic</h2>
            <button
              onClick={handleClose}
              className={`p-1 rounded-md transition-colors ${
                isDarkMode
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex items-center space-x-3">
              <img src="./mdtopic-icon.svg" alt="MarkPic" width="32" height="32" />
              <div>
                <h3 className={`font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>MarkPic</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>Markdown 转图片工具</p>
              </div>
            </div>
            
            <p className={`text-sm leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              将 Markdown 文本转换为精美图片的在线工具。支持实时预览、自定义样式和一键导出。
            </p>
            
            <div className="space-y-2">
              <h4 className={`text-sm font-medium ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>主要功能</h4>
              <ul className={`text-sm space-y-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <li>• 40+ 预设渐变背景</li>
                <li>• 暗黑模式支持</li>
                <li>• 实时预览编辑</li>
                <li>• 图片导出和复制</li>
                <li>• 可调整布局参数</li>
              </ul>
            </div>
            
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <a
                href="https://github.com/alterem/MarkPic"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  isDarkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Github className="w-4 h-4" />
                <span>查看源码</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}