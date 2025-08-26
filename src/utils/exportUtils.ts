import { toPng } from 'html-to-image'

type ProgressCallback = (step: string) => void
type ThemeColors = {
	text: string
	background: string
	stroke: string
}

const THEME_COLORS: Record<'light' | 'dark', ThemeColors> = {
	light: {
		text: '#111827',
		background: '#f3f4f6',
		stroke: '#9ca3af',
	},
	dark: {
		text: '#f9fafb',
		background: '#374151',
		stroke: '#6b7280',
	},
}

/**
 * 修复深色模式下 Mermaid SVG 文字颜色的函数
 * @param element 包含 SVG 的 HTML 元素
 * @param isDarkMode 是否为深色模式
 */
export const fixMermaidSVGColors = (element: HTMLElement, isDarkMode: boolean): void => {
	const svgElements = element.querySelectorAll<SVGSVGElement>('svg')
	const theme = isDarkMode ? 'dark' : 'light'
	const colors = THEME_COLORS[theme]

	svgElements.forEach((svg) => {
		// 强制设置 SVG 的样式
		svg.style.color = colors.text

		// 查找所有可能的文本元素，使用更广泛的选择器
		const allTextElements = svg.querySelectorAll<SVGElement>('text, tspan, textPath, .label')
		allTextElements.forEach((text) => {
			// 设置文字颜色
			text.style.fill = `${colors.text} !important`
			text.style.color = `${colors.text} !important`
			text.setAttribute('fill', colors.text)
			text.setAttribute('color', colors.text)
			// 移除可能的黑色样式
			text.style.removeProperty('fill')
			text.style.fill = colors.text
		})

		// 查找所有可能包含文字的元素
		const allElements = svg.querySelectorAll<SVGElement>('*')
		allElements.forEach((element) => {
			// 如果元素有文本内容，也设置颜色
			if (element.textContent?.trim()) {
				element.style.fill = colors.text
				element.style.color = colors.text
				element.setAttribute('fill', colors.text)
			}
		})

		// 修复节点背景色
		const nodeElements = svg.querySelectorAll<SVGElement>('.node rect, .node circle, .node ellipse, .node polygon, rect, circle, ellipse, polygon')
		nodeElements.forEach((node) => {
			// 只修改没有文字的形状元素
			if (!node.textContent?.trim()) {
				node.style.fill = colors.background
				node.setAttribute('fill', colors.background)
				node.style.stroke = colors.stroke
				node.setAttribute('stroke', colors.stroke)
			}
		})

		// 修复边线颜色
		const edgeElements = svg.querySelectorAll<SVGElement>('.edgePath path, path')
		edgeElements.forEach((edge) => {
			edge.style.stroke = colors.stroke
			edge.setAttribute('stroke', colors.stroke)
			edge.style.fill = 'none'
			edge.setAttribute('fill', 'none')
		})
	})
}

// ---------------- 图片处理与加载辅助 ----------------

const isDataUrl = (url: string): boolean => url.startsWith('data:')

const isSameOrigin = (url: string): boolean => {
	try {
		const parsed = new URL(url, window.location.href)
		return parsed.origin === window.location.origin
	} catch {
		return false
	}
}

/**
 * 使用 CORS 代理重写外链图片 URL，以避免画布污染。
 * 说明：使用 wsrv.nl 图片代理，返回带 CORS 头的图片。
 */
const rewriteWithCorsProxy = (url: string): string => {
	// 保持原始协议与域名，交给代理服务抓取
	return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`
}

/**
 * 为克隆的节点中的 <img> 元素设置 CORS 属性，并为外链设置代理。
 * 返回一个 Promise，等待所有图片加载完成（或超时忽略错误）。
 */
const prepareAndWaitForImages = async (root: HTMLElement, timeoutMs = 8000): Promise<void> => {
	const images = root.querySelectorAll<HTMLImageElement>('img')
	if (images.length === 0) return

	const loaders = Array.from(images).map((img) => {
		try {
			// 强制设置跨域属性，减小被污染概率
			img.setAttribute('crossorigin', 'anonymous')
			// 某些站点基于 Referer 防盗链，关闭 Referer
			img.referrerPolicy = 'no-referrer'

			const src = img.getAttribute('src') || ''
			if (!src || isDataUrl(src)) {
				// 空或已是 data URL，直接跳过
				return Promise.resolve()
			}

			// 解析为绝对 URL 以判断同源
			let abs: string
			try {
				abs = new URL(src, window.location.href).toString()
			} catch {
				abs = src
			}

			// 对于非同源的图片，使用 CORS 代理重写
			if (!isSameOrigin(abs)) {
				img.src = rewriteWithCorsProxy(abs)
			}
		} catch {
			// 忽略单个图片处理异常
		}

		return new Promise<void>((resolve) => {
			let done = false
			const finish = (): void => {
				if (done) return
				done = true
				resolve()
			}

			// 若图片已完成加载则立即返回
			if (img.complete && img.naturalWidth > 0) {
				return finish()
			}

			img.addEventListener('load', finish, { once: true })
			img.addEventListener('error', finish, { once: true })
			setTimeout(finish, timeoutMs)
		})
	})

	await Promise.allSettled(loaders)
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
	onProgress?: ProgressCallback
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
		// 处理外链图片，等待加载完成
		onProgress?.('正在处理外链图片...')
		await prepareAndWaitForImages(clonedElement)

		// 等待样式应用
		onProgress?.('正在应用样式...')
		await new Promise<void>(resolve => setTimeout(resolve, 200))

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
			filter: (node): boolean => {
				// 在过滤器中也修复 SVG 文字颜色
				if (node.nodeName === 'svg') {
					const svg = node as unknown as SVGSVGElement
					const textElements = svg.querySelectorAll<SVGElement>('text, tspan, textPath')
					const colors = THEME_COLORS[isDarkMode ? 'dark' : 'light']
					
					textElements.forEach((text) => {
						text.setAttribute('fill', colors.text)
						text.style.fill = colors.text
					})
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
export const downloadImage = (dataUrl: string, filename?: string): void => {
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
