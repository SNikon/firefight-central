import { type FunctionComponent, useCallback, useState, useEffect } from 'react'
import { useObservable } from 'react-use'
import { activeOccurrences$, createActiveOccurrence$, staff$, updateActiveOccurrence$, vehicles$ } from '../../../_state/store'
import { FullscreenOverlay } from '../../../_components/FullScreenOverlay'
import { useEscapeKey } from '../../../_utils/useEscapeKey'
import { OccurrenceInfo, Vehicle } from '../../../_consts/native'
import { PickOccurrence } from './PickOccurrence'
import { PickVehicles } from './PickVehicles'
import { PickStaff } from './PickStaff'
import { ConfirmOccurrence } from './ConfirmOccurrence'
import { InformationPanel } from './InformationPanel'

enum Section {
	Confirm,
	Occurrence,
	Information,
	Staff,
	Vehicles
}

/**
 * Given the vehicle index, return that or a following (next or prev) vehicle that has valid capacity for staff
 */
const getVehicleWithCapacityIdx = (vehicleMap: Record<string, Vehicle>, vehicleIds: string[], vehicleIdx: number, increment: 1 | -1): number => {
	let nextIdx = -1

	for(let i = vehicleIdx; i < vehicleIds.length && i >= 0; i += increment) {
		if (vehicleMap[vehicleIds[i]].capacity ?? 1 > 0) {
			nextIdx = i
			break
		}
	}

	return nextIdx
}

type ActiveOccurrenceWizardProps = {
	internalId?: string
	onClose: () => void
}

export const ActiveOccurrenceWizard: FunctionComponent<ActiveOccurrenceWizardProps> = ({ internalId, onClose }) => {
	const [activeSection, setActiveSection] = useState(internalId ? Section.Vehicles: Section.Information)

	const staffMap = useObservable(staff$, {})
	const vehicleMap = useObservable(vehicles$, {})

	const [ocurrenceInfo, setOccurrenceInfo] = useState<OccurrenceInfo>({
		address: '',
		description: '',
		location: '',
		coduNumber: '',
		referencePoint: '',
		vmerSiv: false
	})
	const [occurrenceId, setOccurrenceId] = useState('')
	const [vehicleIds, setVehicleIds] = useState<string[]>([])
	const [staffIds, setStaffIds] = useState<string[]>([])
	const [vehicleAssignmentMap, setVehicleAssignmentMap] = useState<Record<string, string[]>>({})

	// Initial Values
	const activeOccurrenceMap = useObservable(activeOccurrences$, {})
	const activeOccurrence = internalId ? activeOccurrenceMap[internalId] : undefined
	useEffect(() => {
		if (activeOccurrence) {
			setOccurrenceId(activeOccurrence.occurrenceId)
			setVehicleAssignmentMap(activeOccurrence.vehicleAssignmentMap)
			setVehicleIds(activeOccurrence.vehicleIds)
			setStaffIds(activeOccurrence.staffIds)
		}
	}, [activeOccurrence])

	const [vehicleIdx, setVehicleIdx] = useState(0)

	const onInformationNext = useCallback((nextInfo: OccurrenceInfo) => {
		setOccurrenceInfo(nextInfo)
		setActiveSection(Section.Occurrence)
	}, [])

	const onOccurrencePrev = useCallback(setActiveSection.bind(null, Section.Information), [])
	const onOccurrenceNext = useCallback((occurrenceId: string) => {
		setOccurrenceId(occurrenceId)
		setActiveSection(Section.Vehicles)
	}, [])

	const onVehiclesPrev = useCallback(setActiveSection.bind(null, Section.Occurrence), [])
	const onVehiclesNext = useCallback((vehicleIds: string[]) => {
		// Do not allow creating an occurrence without vehicles
		if (vehicleIds.length === 0) { return }
		
		// Do not allow creating an occurrence wherein the vehicle assignment would not have any staff
		const nextVehicleIdx = getVehicleWithCapacityIdx(vehicleMap, vehicleIds, 0, +1)
		if (nextVehicleIdx < 0) { return }

		setVehicleIds(vehicleIds)

		const nextVehicleAssignmentMap = vehicleIds.reduce((acc: Record<string, string[]>, vehicleId) => {
			acc[vehicleId] = vehicleAssignmentMap[vehicleId] ?? []
			return acc
		}, {})
		setVehicleAssignmentMap(nextVehicleAssignmentMap)
		
		const nextStaffIds = Array.from(new Set(Object.values<string[]>(nextVehicleAssignmentMap!).flat()))
		setStaffIds(nextStaffIds)

		setVehicleIdx(nextVehicleIdx)
		setActiveSection(Section.Staff)
	}, [vehicleMap, vehicleAssignmentMap])
	
	const onStaffPrev = useCallback(() => {
		const nextVehicleIdx = getVehicleWithCapacityIdx(vehicleMap, vehicleIds, vehicleIdx - 1, -1)
		if (nextVehicleIdx >= 0) {
			setVehicleIdx(nextVehicleIdx)
		} else {
			setActiveSection(Section.Vehicles)
		}
	}, [vehicleIdx])
	
	const onStaffNext = useCallback((vehicleId: string, staff: string[]) => {
		const nextVehicleAssignmentMap = { ...vehicleAssignmentMap, [vehicleId]: staff }
		setVehicleAssignmentMap(nextVehicleAssignmentMap)

		const nextStaffIds = Array.from(new Set(Object.values<string[]>(nextVehicleAssignmentMap!).flat()))
		setStaffIds(nextStaffIds)

		const nextVehicleIdx = getVehicleWithCapacityIdx(vehicleMap, vehicleIds, vehicleIdx + 1, +1)
		if (nextVehicleIdx >= 0) {
			setVehicleIdx(nextVehicleIdx)
		} else {
			setActiveSection(Section.Confirm)
		}
	}, [vehicleIdx, vehicleAssignmentMap])

	const onConfirmPrev = useCallback(setActiveSection.bind(null, Section.Staff), [])
	const onConfirm = () => {
		const target$ = internalId ? updateActiveOccurrence$ : createActiveOccurrence$
		target$.next({
			...activeOccurrence,
			...ocurrenceInfo,
			internalId: internalId ?? '',
			occurrenceId,
			staffIds,
			vehicleAssignmentMap,
			vehicleIds
		})
		onClose()
	}

	useEscapeKey(onClose)

	const selectedThusFar = new Array(vehicleIdx).fill(null).map((_, idx) => vehicleAssignmentMap[vehicleIds[idx]]).flat()

	return (
		<FullscreenOverlay className='flex flex-col justify-center items-center'>
			<div className='absolute top-0 left-0 w-full h-full backdrop-blur-md' />

			<div className='flex bg-[#000] rounded-xl z-10 w-full max-w-7xl max-h-full p-5 pb-10'>
				{!internalId && (activeSection === Section.Information) && <InformationPanel
					initialValue={ocurrenceInfo}
					onCancel={onClose}
					onNext={onInformationNext} 
				/>}

				{!internalId && (activeSection === Section.Occurrence) && <PickOccurrence
					initialValue={occurrenceId}
					onCancel={onClose}
					onPrevious={onOccurrencePrev}
					onNext={onOccurrenceNext}
				/>}

				{(activeSection === Section.Vehicles) && <PickVehicles
					initialValue={vehicleIds}
					onCancel={onClose}
					onNext={onVehiclesNext}
					onPrevious={internalId ? undefined : onVehiclesPrev}
					vehicles={vehicleMap}
				/>}

				{(activeSection === Section.Staff) && <PickStaff
					alreadySelectedStaffIds={selectedThusFar}
					capacity={vehicleMap[vehicleIds[vehicleIdx]].capacity}
					initialValue={vehicleAssignmentMap[vehicleIds[vehicleIdx]]}
					onCancel={onClose}
					onNext={onStaffNext}
					onPrevious={onStaffPrev}
					staff={staffMap}
					vehicleId={vehicleIds[vehicleIdx]}
					vehicleLabel={vehicleMap[vehicleIds[vehicleIdx]].label}
				/>}

				{(activeSection === Section.Confirm) && <ConfirmOccurrence
					activeOccurrence={activeOccurrence}
					allowAlert={!internalId}
					occurrenceId={occurrenceId}
					onCancel={onClose}
					onNext={onConfirm}
					onPrevious={onConfirmPrev}
					staff={staffMap}
					staffIds={staffIds}
					vehicleAssignmentMap={vehicleAssignmentMap}
					vehicleIds={vehicleIds}
					vehicles={vehicleMap}
				/>}
			</div>
		</FullscreenOverlay>
	)
}
