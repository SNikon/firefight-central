import { useEffect, useRef, useState } from 'react'
import { invoke, updater } from '@tauri-apps/api'
import { relaunch } from '@tauri-apps/api/process'
import { useResizeWindow } from '../_utils/useResizeWindow'
import { Button } from '../_components/Button'
import { useVersion } from '../_utils/useVersion'

const onRebuildCache = () => {
	invoke('rebuild_audio_cache')
		.catch(console.error)
}

const onCheck = () => {
	updater.checkUpdate()
		.catch(console.error)
}

const onInstall = () => {
	updater.checkUpdate()
		.then(async ({ shouldUpdate }) => {
			if (shouldUpdate) {
				await updater.installUpdate()
				await relaunch()
			}
		})
		.catch(console.error)
}

const useEventStatus = () => {
	const [error, setError] = useState('')
	const [status, setStatus] = useState<updater.UpdateStatus | undefined>(undefined)

	useEffect(() => {
		updater.onUpdaterEvent(event => {
			setError(event.error ?? '')
			setStatus(event.status)
		})
			.catch(console.error)
	}, [])

	return [error, status]
}

export const Settings = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	useResizeWindow(containerRef, 32, 32)
	
	const version = useVersion()

	useEffect(() => {
		updater.checkUpdate()
			.catch(console.error)
	}, [])
	const [error, status] = useEventStatus()
	const hasUpdate = status === 'PENDING'
	const hasLatest = status === 'UPTODATE'

	return (
		<div
			className='w-80 h-96 flex flex-col justify-start items-center gap-2 bg-background overflow-hidden p-4'
			ref={containerRef}
		>		
			
			<span className='text-primary'>Versão {version}</span>

			<Button onClick={onRebuildCache}>Recriar cache de áudio</Button>

			<Button onClick={hasUpdate ? onInstall : onCheck}>{hasUpdate
				? 'Clique para actualizar'
				: 'Verificar atualização' }
			</Button>

			<span className='text-primary'>
				{hasLatest && 'Versão mais recente instalada'}
				{error && `Erro: ${error}`}
			</span>
		</div>
	)
}
