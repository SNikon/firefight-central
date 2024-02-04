import { useEffect } from 'react'

export const useEscapeKey = (onEscape: () => void, disable?: boolean) => useEffect(
	() => {
		if (onEscape && !disable) {
			const keyHandler = (evt: KeyboardEvent) => {
				if (evt.key === 'Escape') {
					onEscape()
				}
			}

			window.addEventListener('keydown', keyHandler)
			return () => window.removeEventListener('keydown', keyHandler)
		}
	}, [disable, onEscape])
