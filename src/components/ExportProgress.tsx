import React from 'react'
import { Download } from 'lucide-react'

interface ExportProgressProps {
  isVisible: boolean
  progress: string
  isDarkMode?: boolean
}

export const ExportProgress: React.FC<ExportProgressProps> = ({ 
  isVisible, 
  progress, 
  isDarkMode = false 
}) => {
  if (!isVisible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-sm p-6 rounded-lg shadow-2xl ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className="text-center space-y-4">
          {/* 图标和动画 */}
          <div className="flex justify-center">
            <div className={`p-3 rounded-full ${
              isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
            }`}>
              <Download className={`w-8 h-8 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`} />
            </div>
          </div>

          {/* 标题 */}
          <h2 className={`text-lg font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            正在导出图片
          </h2>

          {/* 进度文字 */}
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {progress}
          </p>

          {/* 加载动画 */}
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>

          {/* 提示信息 */}
          <div className={`p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <p className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              请稍候，正在处理图表样式并生成高质量图片...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}