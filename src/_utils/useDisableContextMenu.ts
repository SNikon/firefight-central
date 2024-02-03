import { invoke } from '@tauri-apps/api/tauri'
import { useEffect } from 'react'

export const useDisableContextMenu = () => {
	useEffect(() => {
		invoke('get_environment')
			.then(environment => {
				if (environment !== 'production') {
					return
				}

				const defaultHandler: EventListener = evt => {
					evt.preventDefault()
				}

				window.addEventListener('contextmenu', defaultHandler)
				return () => {
					window.removeEventListener('contextmenu', defaultHandler)
				}
			})
			.catch(console.error)
	}, [])
}
