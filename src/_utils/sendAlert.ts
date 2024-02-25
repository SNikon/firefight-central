import { invoke } from '@tauri-apps/api'

export const sendCustomAlert = (occurrence: string, staff: string[], vehicles: string[]) => {
	invoke('alarm', { occurrence, staff, vehicles })
		.catch(console.error)
}

export const sendOccurrenceAlert = (occurrenceId: string, vehicleAssignmentMap: Record<string, string[]>) => {
	invoke('alert', { occurrenceId, vehicleAssignmentMap })
		.catch(console.error)
}