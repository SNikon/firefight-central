import { invoke } from '@tauri-apps/api'

export const openFullViewPanel = () => {
	invoke('open_fvp').catch(console.error)
}