import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
  isDarkMode?: boolean
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 3000,
  onClose,
  isDarkMode = false
}) => {
  const [isVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, id, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'info':
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const getBackgroundColor = () => {
    if (isDarkMode) {
      switch (type) {
        case 'success':
          return 'bg-green-900/80 border-green-700 backdrop-blur-sm'
        case 'error':
          return 'bg-red-900/80 border-red-700 backdrop-blur-sm'
        case 'warning':
          return 'bg-yellow-900/80 border-yellow-700 backdrop-blur-sm'
        case 'info':
        default:
          return 'bg-blue-900/80 border-blue-700 backdrop-blur-sm'
      }
    } else {
      switch (type) {
        case 'success':
          return 'bg-green-50 border-green-200'
        case 'error':
          return 'bg-red-50 border-red-200'
        case 'warning':
          return 'bg-yellow-50 border-yellow-200'
        case 'info':
        default:
          return 'bg-blue-50 border-blue-200'
      }
    }
  }

  if (!isVisible) return null

  return (
    <div className={`
      ${getBackgroundColor()}
      border rounded-lg shadow-lg p-4 mb-3 max-w-sm w-full
      animate-in slide-in-from-right duration-300
    `}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
            {title}
          </p>
          {message && (
            <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
              {message}
            </p>
          )}
        </div>
        <button
          onClick={() => onClose(id)}
          className={`flex-shrink-0 ml-2 transition-colors ${isDarkMode
              ? 'text-gray-400 hover:text-gray-200'
              : 'text-gray-400 hover:text-gray-600'
            }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export const ToastContainer: React.FC<{
  toasts: ToastProps[],
  onClose: (id: string) => void,
  isDarkMode?: boolean
}> = ({
  toasts,
  onClose,
  isDarkMode = false
}) => {
    if (toasts.length === 0) return null

    return (
      <div className="fixed top-4 right-4 z-[9999] max-w-sm">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} isDarkMode={isDarkMode} />
        ))}
      </div>
    )
  }