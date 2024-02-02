import { LogicalSize, getCurrent } from "@tauri-apps/api/window"
import { RefObject, useEffect } from "react"

const makeResizeHandler = (addedWidth: number, addedHeight: number): ResizeObserverCallback => entries => {
	const singleContainer = entries[0]
	const { width, height } = singleContainer.contentRect
	getCurrent().setSize(new LogicalSize(width + addedWidth, height + addedHeight)).catch(console.error)
}

export const useResizeWindow = (containerRef: RefObject<HTMLElement>, addedWidth: number, addedHeight: number) => {
	useEffect(() => {
		const obs = new ResizeObserver(makeResizeHandler(addedWidth, addedHeight))
		obs.observe(containerRef.current!, { box: 'device-pixel-content-box' })
		return () => {
			obs.disconnect()
		}
	}, [])
}