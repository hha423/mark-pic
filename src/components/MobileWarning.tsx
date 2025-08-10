import React, { useState, useEffect } from 'react'
import { Monitor, Smartphone, X, Copy, Check } from 'lucide-react'

interface MobileWarningProps {
  isDarkMode?: boolean
}

export const MobileWarning: React.FC<MobileWarningProps> = ({ isDarkMode = false }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [copied, setCopied] = useState(false)
  const [currentUrl, setCurrentUrl] = useState('')
  const [isLandscape, setIsLandscape] = useState(false)

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

      // 检测横屏模式
      const landscape = window.innerWidth > window.innerHeight && window.innerHeight <= 500
      setIsLandscape(landscape)

      // 综合判断
      const mobile = isMobileUA || (isSmallScreen && isTouchDevice)
      setIsMobile(mobile)
    }

    checkMobile()
    setCurrentUrl(window.location.href)

    // 监听窗口大小变化和方向变化
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', checkMobile)
    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', checkMobile)
    }
  }, [])

  const handleCopyUrl = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } else {
        // 对于不支持现代clipboard API的环境，提供手动复制提示
        console.warn('Clipboard API not available')
        // 可以在这里添加一个提示，告诉用户手动复制
        alert('请手动复制链接：' + currentUrl)
      }
    } catch (error) {
      console.error('复制失败:', error)
      // 提供手动复制的提示
      alert('复制失败，请手动复制链接：' + currentUrl)
    }
  }

  if (!isMobile || !isVisible) {
    return null
  }

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm ${isLandscape ? 'p-2' : 'p-3 sm:p-4'
      }`}>
      <div className={`w-full ${isLandscape ? 'max-w-md' : 'max-w-sm'} ${isLandscape ? 'max-h-[95vh]' : 'max-h-[85vh] sm:max-h-[90vh]'
        } overflow-y-auto rounded-lg shadow-2xl ${isLandscape ? 'p-2' : 'p-3 sm:p-4'
        } relative ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}>
        <button
          onClick={() => setIsVisible(false)}
          className={`absolute top-4 right-4 p-1 rounded-md transition-colors ${isDarkMode
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className={`text-center ${isLandscape ? 'space-y-1.5' : 'space-y-2 sm:space-y-3'
          }`}>
          <div className={`flex justify-center space-x-2 sm:space-x-3 ${isLandscape ? 'mb-1.5' : 'mb-2 sm:mb-3'
            }`}>
            <div className={`p-2 sm:p-2.5 rounded-full ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'
              }`}>
              <Smartphone className={`w-6 h-6 sm:w-7 sm:h-7 ${isDarkMode ? 'text-red-400' : 'text-red-600'
                }`} />
            </div>
            <div className="flex items-center">
              <div className={`w-5 sm:w-7 h-0.5 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}></div>
            </div>
            <div className={`p-2 sm:p-2.5 rounded-full ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
              <Monitor className={`w-6 h-6 sm:w-7 sm:h-7 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`} />
            </div>
          </div>

          <h2 className={`${isLandscape ? 'text-sm' : 'text-base sm:text-lg'
            } font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
            请使用电脑访问
          </h2>

          <p className={`${isLandscape ? 'text-xs leading-tight' : 'text-xs sm:text-sm leading-relaxed'
            } ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
            mark-pic 专为桌面端设计，需要较大屏幕空间提供最佳体验。
          </p>

          <div className={`${isLandscape ? 'p-1.5' : 'p-2 sm:p-3'
            } rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
            <h3 className={`text-xs ${isLandscape ? 'font-medium mb-1' : 'sm:text-sm font-medium mb-1 sm:mb-2'
              } ${isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
              推荐使用：
            </h3>
            <ul className={`text-xs ${isLandscape ? 'space-y-0' : 'space-y-0.5 sm:space-y-1'
              } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
              <li>• 桌面电脑或笔记本</li>
              <li>• 屏幕 ≥ 1024px</li>
              <li>• 现代浏览器</li>
            </ul>
          </div>

          <div className={`${isLandscape ? 'p-1.5' : 'p-2 sm:p-3'
            } rounded-lg border ${isDarkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}>
            <div className={`text-xs ${isLandscape ? 'mb-1' : 'mb-1 sm:mb-2'
              } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
              电脑端访问地址：
            </div>
            <button
              onClick={handleCopyUrl}
              className={`w-full flex items-center gap-1 sm:gap-2 ${isLandscape ? 'p-1' : 'p-1.5 sm:p-2'
                } rounded text-xs transition-colors ${isDarkMode
                  ? 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                }`}
              title="点击复制链接"
            >
              <span className="truncate flex-1 text-left min-w-0 break-all">
                {currentUrl}
              </span>
              <div className="flex-shrink-0">
                {copied ? (
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                )}
              </div>
            </button>
            {copied && (
              <div className={`text-xs mt-1 text-center ${isDarkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                已复制到剪贴板
              </div>
            )}
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className={`w-full ${isLandscape ? 'py-1.5 px-3' : 'py-2 px-3 sm:px-4'
              } rounded-md text-xs sm:text-sm font-medium transition-colors ${isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
          >
            我知道了，继续使用
          </button>
        </div>
      </div>
    </div>
  )
}