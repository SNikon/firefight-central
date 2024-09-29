import { useEffect, useRef, useState } from 'react'
import { invoke, updater } from '@tauri-apps/api'
import { relaunch } from '@tauri-apps/api/process'
import { useResizeWindow } from '../_utils/useResizeWindow'
import { Button } from '../_components/Button'
import { useVersion } from '../_utils/useVersion'
import { useLanguageStore } from '../_state/lang'

const onRebuildCache = () => {
	invoke('rebuild_audio_cache').catch(console.error)
}

const onCheck = () => {
	updater.checkUpdate().catch(console.error)
}

const onInstall = () => {
	updater
		.checkUpdate()
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
		updater
			.onUpdaterEvent((event) => {
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

	const { language, languageData, setLanguage } = useLanguageStore()
	const onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setLanguage(e.target.value as 'pt' | 'en')
	}

	const version = useVersion()

	useEffect(() => {
		updater.checkUpdate().catch(console.error)
	}, [])
	const [error, status] = useEventStatus()
	const hasUpdate = status === 'PENDING'
	const hasLatest = status === 'UPTODATE'

	return (
		<div
			className="w-80 h-96 flex flex-col justify-start items-center gap-2 bg-background overflow-hidden p-4"
			ref={containerRef}
		>
			<span className="text-primary">
				{languageData['settings.version']} {version}
			</span>

			<label className="mt-5 text-action">{languageData['terms.language']}</label>
			<select
				className="bg-background text-action mt-1 p-2 rounded border border-[#000]/50"
				onChange={onLanguageChange}
				value={language}
			>
				<option value="en">{languageData['language.en']}</option>
				<option value="pt">{languageData['language.pt']}</option>
			</select>

			<Button onClick={onRebuildCache}>{languageData['settings.rebuild_cache']}</Button>

			<Button onClick={hasUpdate ? onInstall : onCheck}>
				{languageData[hasUpdate ? 'settings.update' : 'settings.check_for_updates']}
			</Button>

			<span className="text-primary">
				{hasLatest && languageData['settings.version_latest']}
				{error && `${languageData['terms.error']}: ${error}`}
			</span>
		</div>
	)
}
