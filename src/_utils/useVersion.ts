import { invoke } from '@tauri-apps/api/tauri'
import { useEffect, useState } from 'react'

export const useVersion = () => {
	const [version, setVersion] = useState('')

	useEffect(() => {
		invoke('get_version')
			.then(inVersion => { setVersion(inVersion as string) })
			.catch(console.error)
	}, [])

	return version
}
