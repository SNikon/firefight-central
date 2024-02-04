import { useState } from 'react'

export const useAlertSelection = (allStaffIds: string[], allVehicleIds: string[]) => {
	const [showSelection, setShowSelection] = useState(false)
	const [selectedStaff, setSelectedStaff] = useState<string[]>([])
	const [selectedVehicles, setSelectedVehicle] = useState<string[]>([])

	const onStartSelection = () => {
		setSelectedStaff(allStaffIds)
		setSelectedVehicle(allVehicleIds)
		setShowSelection(true)
	}

	const onToggleStaff = (staffId: string) => {
		if (selectedStaff.includes(staffId)) {
			setSelectedStaff(selectedStaff.filter(id => id !== staffId))
		} else {
			setSelectedStaff([...selectedStaff, staffId])
		}
	}

	const onToggleVehicle = (vehicleId: string) => {
		if (selectedVehicles.includes(vehicleId)) {
			setSelectedVehicle(selectedVehicles.filter(id => id !== vehicleId))
		} else {
			setSelectedVehicle([...selectedVehicles, vehicleId])
		}
	}

	const onEndSelection = () => {
		setSelectedStaff([])
		setSelectedVehicle([])
		setShowSelection(false)
	}

	return {
		onEndSelection,
		onStartSelection,
		onToggleStaff,
		onToggleVehicle,
		selectedStaff,
		selectedVehicles,
		showSelection,
	}

}