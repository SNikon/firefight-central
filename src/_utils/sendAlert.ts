import { invoke } from '@tauri-apps/api'

export const sendAlert = (occurrence: string, staff: string[], vehicles: string[]) => {
	invoke('alarm', { occurrence, staff, vehicles })
		.catch(console.error)
}