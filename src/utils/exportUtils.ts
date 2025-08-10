import { toPng } from 'html-to-image'

/**
 * 修复深色模式下 Mermaid SVG 文字颜色的函数
 * @param element 包含 SVG 的 HTML 元素
 * @param isDarkMode 是否为深色模式
 */
export const fixMermaidSVGColors = (element: HTMLElement, isDarkMode: boolean) => {
  const svgElements = element.querySelectorAll('svg')
  svgElements.forEach((svg) => {
    // 强制设置 SVG 的样式
    if (isDarkMode) {
      svg.style.color = '#f9fafb'
    } else {
      svg.style.color = '#111827'
    }

    // 查找所有可能的文本元素，使用更广泛的选择器
    const allTextElements = svg.querySelectorAll('text, tspan, textPath, .label')
    allTextElements.forEach((textEl) => {
      const text = textEl as SVGElement
      // 在深色模式下，强制设置文字颜色
      if (isDarkMode) {
        text.style.fill = '#f9fafb !important'
        text.style.color = '#f9fafb !important'
        text.setAttribute('fill', '#f9fafb')
        text.setAttribute('color', '#f9fafb')
        // 移除可能的黑色样式
        text.style.removeProperty('fill')
        text.style.fill = '#f9fafb'
      } else {
        text.style.fill = '#111827 !important'
        text.style.color = '#111827 !important'
        text.setAttribute('fill', '#111827')
        text.setAttribute('color', '#111827')
      }
    })

    // 查找所有可能包含文字的元素
    const allElements = svg.querySelectorAll('*')
    allElements.forEach((el) => {
      const element = el as SVGElement
      // 如果元素有文本内容，也设置颜色
      if (element.textContent && element.textContent.trim()) {
        if (isDarkMode) {
          element.style.fill = '#f9fafb'
          element.style.color = '#f9fafb'
          element.setAttribute('fill', '#f9fafb')
        } else {
          element.style.fill = '#111827'
          element.style.color = '#111827'
          element.setAttribute('fill', '#111827')
        }
      }
    })

    // 修复节点背景色
    const nodeElements = svg.querySelectorAll('.node rect, .node circle, .node ellipse, .node polygon, rect, circle, ellipse, polygon')
    nodeElements.forEach((nodeEl) => {
      const node = nodeEl as SVGElement
      // 只修改没有文字的形状元素
      if (!node.textContent || !node.textContent.trim()) {
        if (isDarkMode) {
          node.style.fill = '#374151'
          node.setAttribute('fill', '#374151')
          node.style.stroke = '#6b7280'
          node.setAttribute('stroke', '#6b7280')
        } else {
          node.style.fill = '#f3f4f6'
          node.setAttribute('fill', '#f3f4f6')
          node.style.stroke = '#9ca3af'
          node.setAttribute('stroke', '#9ca3af')
        }
      }
    })

    // 修复边线颜色
    const edgeElements = svg.querySelectorAll('.edgePath path, path')
    edgeElements.forEach((edgeEl) => {
      const edge = edgeEl as SVGElement
      if (isDarkMode) {
        edge.style.stroke = '#9ca3af'
        edge.setAttribute('stroke', '#9ca3af')
        edge.style.fill = 'none'
        edge.setAttribute('fill', 'none')
      } else {
        edge.style.stroke = '#6b7280'
        edge.setAttribute('stroke', '#6b7280')
        edge.style.fill = 'none'
        edge.setAttribute('fill', 'none')
      }
    })
  })
}

/**
 * 导出元素为 PNG 图片
 * @param element 要导出的 HTML 元素
 * @param isDarkMode 是否为深色模式
 * @param onProgress 进度回调函数
 * @returns Promise<string> 返回图片的 data URL
 */
export const exportElementToPng = async (
  element: HTMLElement,
  isDarkMode: boolean,
  onProgress?: (step: string) => void
): Promise<string> => {
  // 克隆元素以避免影响原始DOM
  onProgress?.('正在准备导出...')
  const clonedElement = element.cloneNode(true) as HTMLElement
  
  // 在克隆的元素上修复 SVG 颜色
  onProgress?.('正在优化图表样式...')
  fixMermaidSVGColors(clonedElement, isDarkMode)

  // 创建临时容器
  const tempContainer = document.createElement('div')
  tempContainer.style.position = 'absolute'
  tempContainer.style.left = '-9999px'
  tempContainer.style.top = '-9999px'
  tempContainer.style.width = `${element.offsetWidth}px`
  tempContainer.style.height = `${element.offsetHeight}px`
  tempContainer.appendChild(clonedElement)
  document.body.appendChild(tempContainer)

  try {
    // 等待样式应用
    onProgress?.('正在应用样式...')
    await new Promise(resolve => setTimeout(resolve, 200))

    // 生成图片
    onProgress?.('正在生成图片...')
    const dataUrl = await toPng(clonedElement, {
      quality: 1,
      pixelRatio: 2,
      skipFonts: false,
      cacheBust: true,
      canvasWidth: element.offsetWidth,
      canvasHeight: element.offsetHeight,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      },
      filter: (node) => {
        // 在过滤器中也修复 SVG 文字颜色
        if (node.nodeName === 'svg') {
          const svg = node as unknown as SVGSVGElement
          const textElements = svg.querySelectorAll('text, tspan, textPath')
          textElements.forEach((textEl) => {
            const text = textEl as SVGElement
            if (isDarkMode) {
              text.setAttribute('fill', '#f9fafb')
              text.style.fill = '#f9fafb'
            } else {
              text.setAttribute('fill', '#111827')
              text.style.fill = '#111827'
            }
          })
          return true
        }
        return true
      }
    })

    onProgress?.('导出完成！')
    return dataUrl
  } finally {
    // 清理临时容器
    document.body.removeChild(tempContainer)
  }
}

/**
 * 下载图片文件
 * @param dataUrl 图片的 data URL
 * @param filename 文件名（可选）
 */
export const downloadImage = (dataUrl: string, filename?: string) => {
  const link = document.createElement('a')
  link.download = filename || `mark-pic-${Date.now()}.png`
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 复制图片到剪贴板
 * @param dataUrl 图片的 data URL
 * @returns Promise<boolean> 是否复制成功
 */
export const copyImageToClipboard = async (dataUrl: string): Promise<boolean> => {
  try {
    // 将data URL转换为blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()

    // 复制到剪贴板
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ])

    return true
  } catch (error) {
    console.error('剪贴板操作失败:', error)
    return false
  }
}
