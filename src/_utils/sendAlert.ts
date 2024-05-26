import { invoke } from '@tauri-apps/api'

export const sendOccurrenceAlert = (occurrenceId: string, vehicleAssignmentMap: Record<string, string[]>) => {
	invoke('alert', { occurrenceId, vehicleAssignmentMap })
		.catch(console.error)
}