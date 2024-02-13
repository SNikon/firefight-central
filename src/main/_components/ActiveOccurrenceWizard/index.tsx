import { type FunctionComponent, useCallback, useMemo, useState, useEffect } from 'react'
import { useObservable } from 'react-use'
import { CardGrid } from '../../../_components/CardGrid'
import { Scrollable } from '../../../_components/Scrollable'
import { Header, HeaderSection } from '../../../_components/Header'
import { Button } from '../../../_components/Button'
import { activeOccurrences$, createActiveOccurrence$, occurrences$, staff$, updateActiveOccurrence$, vehicles$ } from '../../../_state/store'
import { OccurrenceCard } from '../../../_components/OccurrenceCard'
import { vehicleSortByOcurrenceState } from '../../../_utils/vehicleSort'
import { occurrenceSortByLabel } from '../../../_utils/occurrenceSort'
import { staffSortByOccurrenceState } from '../../../_utils/staffSort'
import { FullscreenOverlay } from '../../../_components/FullScreenOverlay'
import { ActiveOccurrence, Staff, StaffState, Vehicle, VehicleState } from '../../../_consts/native'
import { useEscapeKey } from '../../../_utils/useEscapeKey'
import { sendAlert } from '../../../_utils/sendAlert'
import { VehicleTag } from '../../../_components/VehicleTag'
import { TagGrid } from '../../../_components/TagGrid'
import { StaffTag } from '../../../_components/StaffTag'

type SectionProps<T> = {
	initialValue: T
	onCancel: () => void
	onNext: (value: T) => void
	onPrevious?: () => void
}

type PickOccurrenceProps = SectionProps<string>
const PickOccurrence: FunctionComponent<PickOccurrenceProps> = ({ initialValue, onCancel, onNext }) => {
	const occurrences = useObservable(occurrences$, {})
	const sortedOccurrences = useMemo(() => {
		const entries = Object.values(occurrences)
		entries.sort(occurrenceSortByLabel)
		return entries
	}, [occurrences])

	return (
		<div className='w-full text-action flex flex-col overflow-hidden'>
			<Header className="px-0 pt-0 mb-5">
				<Button onClick={onCancel}>Cancelar</Button>
			</Header>

			<Scrollable>
				<CardGrid>
					{sortedOccurrences.map(occurrence => (
						<OccurrenceCard
							key={occurrence.internalId}
							internalId={occurrence.internalId}
							name={occurrence.name}
							onClick={onNext}
							selected={occurrence.internalId === initialValue}
						/>
					))}
				</CardGrid>
			</Scrollable>
		</div>
	)
}

type PickVehiclesProps = {
	vehicles: Record<string, Vehicle>
} & SectionProps<string[]>
const PickVehicles: FunctionComponent<PickVehiclesProps> = ({ initialValue, onCancel, onPrevious, onNext, vehicles }) => {
	const sortedVehicles = useMemo(() => {
		const entries = Object.values(vehicles).filter(vehicle => vehicle.state === VehicleState.Available)
		entries.sort(vehicleSortByOcurrenceState)
		return entries
	}, [vehicles])

	const [selected, setSelected] = useState<string[]>(initialValue)
	useEffect(() => setSelected(initialValue), [initialValue])

	const onSelect = (vehicleId: string) => {
		setSelected(prevSelected => {
			const foundIdx = prevSelected.indexOf(vehicleId)
			if (foundIdx >= 0) {
				const nextSelected = prevSelected.slice()
				nextSelected.splice(foundIdx, 1)
				return nextSelected
			}

			return [...prevSelected, vehicleId]
		}) }

	return (
		<div className='w-full text-action flex flex-col overflow-hidden'>
			<Header className="px-0 pt-0 mb-5">
				<HeaderSection>
					<Button onClick={onCancel}>Cancelar</Button>
				</HeaderSection>
				
				<HeaderSection>
					{onPrevious && <Button onClick={onPrevious}>Voltar</Button>}
					<Button onClick={onNext.bind(null, selected)}>Seguinte</Button>
				</HeaderSection>
			</Header>

			<Scrollable>
				<TagGrid>
					{sortedVehicles.map((vehicle, index) => (
						<VehicleTag
							key={vehicle.internalId}
							index={index}
							label={vehicle.label}
							internalId={vehicle.internalId}
							onClick={onSelect}
							selected={selected.includes(vehicle.internalId)}
							state={vehicle.state}
						/>
					))}
				</TagGrid>
			</Scrollable>
		</div>
	)
}

type PickStaffProps = {
	staff: Record<string, Staff>
} & SectionProps<string[]>
const PickStaff: FunctionComponent<PickStaffProps> = ({ initialValue, onCancel, onPrevious, onNext, staff }) => {
	const sortedStaff = useMemo(() => {
		const entries = Object.values(staff).filter(staff => staff.state === StaffState.Available)
		entries.sort(staffSortByOccurrenceState)
		return entries
	}, [staff])

	const [selected, setSelected] = useState<string[]>(initialValue)
	useEffect(() => setSelected(initialValue), [initialValue])

	const onSelect = (vehicleId: string) => {
		setSelected(prevSelected => {
			const foundIdx = prevSelected.indexOf(vehicleId)
			if (foundIdx >= 0) {
				const nextSelected = prevSelected.slice()
				nextSelected.splice(foundIdx, 1)
				return nextSelected
			}

			return [...prevSelected, vehicleId]
		})
	}

	return (
		<div className='w-full text-action flex flex-col overflow-hidden'>
			<Header className="px-0 pt-0 mb-5">
				<HeaderSection>
					<Button onClick={onCancel}>Cancelar</Button>
				</HeaderSection>
				
				<HeaderSection>
					{onPrevious && <Button onClick={onPrevious}>Voltar</Button>}
					<Button onClick={onNext.bind(null, selected)}>Seguinte</Button>
				</HeaderSection>
			</Header>

			<Scrollable>
				<TagGrid>
					{sortedStaff.map((staff, index) => (
						<StaffTag
							key={staff.internalId}
							index={index}
							label={staff.label}
							internalId={staff.internalId}
							onClick={onSelect}
							rank={staff.rank}
							selected={selected.includes(staff.internalId)}
							state={staff.state}
						/>
					))}
				</TagGrid>
			</Scrollable>
		</div>
	)
}

type ConfirmOccurrenceProps = {
	activeOccurrence?: ActiveOccurrence
	allowAlert: boolean
	occurrenceId: string
	vehicleIds: string[]
	vehicles: Record<string, Vehicle>
	staff: Record<string, Staff>
	staffIds: string[]
} & Omit<SectionProps<void>, 'initialValue'>

const ConfirmOccurrence: FunctionComponent<ConfirmOccurrenceProps> = ({
	activeOccurrence,
	allowAlert,
	occurrenceId,
	onCancel,
	onNext,
	onPrevious,
	staff,
	staffIds,
	vehicleIds,
	vehicles,
}) => {
	const occurrences = useObservable(occurrences$, {})
	const occurrence = occurrences[occurrenceId]?.name

	const onSendAlert = () => {
		const vehicleSet = vehicleIds.map(id => vehicles[id]?.label)
		const staffSet = staffIds.map(id => staff[id]?.label)
	
		sendAlert(occurrence, staffSet, vehicleSet)
		onNext()
	}
	// If there is a vehicle or staff that is not available and not in the active occurrence, add a warning
	const unavailableStaff = staffIds.filter(staffId => staff[staffId].state !== StaffState.Available && !activeOccurrence?.staffIds.includes(staffId))
	const hasUnavailableStaff = unavailableStaff.length > 0
	const unavailableVehicles = vehicleIds.filter(vehicleId => vehicles[vehicleId].state !== VehicleState.Available && !activeOccurrence?.vehicleIds.includes(vehicleId))
	const hasUnavailableVehicles = unavailableVehicles.length > 0

	return (
		<div className='w-full text-action flex flex-col overflow-hidden'>
			<Header className="px-0 pt-0 mb-5">
				<HeaderSection>
					<Button onClick={onCancel}>Cancelar</Button>
				</HeaderSection>
				
				<HeaderSection>
					{onPrevious && <Button onClick={onPrevious}>Voltar</Button>}
					<Button onClick={onNext.bind(null, undefined)}>Confirmar</Button>
					{allowAlert && <Button onClick={onSendAlert}>Confirmar e enviar Alerta</Button>}
				</HeaderSection>
			</Header>

			<p>Tipo de Ocorrência: {occurrence}</p>

			<p>
				Veículos:&nbsp;
				{vehicleIds.map((vehicleId, idx) => <>
					<span className={unavailableVehicles.includes(vehicleId) ? 'text-warning': ''}>
						{vehicles[vehicleId]?.label}
					</span>
					{idx < vehicleIds.length - 1 ? ', ': ''}
				</>)}
			</p>
			
			{hasUnavailableVehicles &&
				<p className='text-warning'>
					Um ou mais veículos selecionados não estão operacionais ou encontram-se noutra ocorrência
				</p>}

			<p>
				Equipa:&nbsp;
				{staffIds.map((staffId, idx) => <>
					<span className={unavailableStaff.includes(staffId) ? 'text-warning': ''}>
						{staff[staffId]?.label}
					</span>
					{idx < staffIds.length - 1 ? ', ': ''}
				</>)}
			</p>

			{hasUnavailableStaff &&
				<p className='text-warning'>
					Um ou mais bombeiros selecionados não estão disponíveis ou encontram-se noutra ocorrência
				</p>}
		</div>
	)
}

enum Section {
	Confirm,
	Occurrence,
	Staff,
	Vehicles
}

const usePrevSection = (nextMode: Section, setMode: (s: Section) => void) =>
	useCallback(setMode.bind(null, nextMode), [])

const useNextSection = <T, >(nextMode: Section, setMode: (s: Section) => void, setValue: (v: T) => void) =>
	useCallback((value: T) => {
		setValue(value)
		setMode(nextMode)
	}, [nextMode, setMode, setValue])

type ActiveOccurrenceWizardProps = {
	internalId?: string
	onClose: () => void
}

export const ActiveOccurrenceWizard: FunctionComponent<ActiveOccurrenceWizardProps> = ({ internalId, onClose }) => {
	const [activeSection, setActiveSection] = useState(internalId ? Section.Vehicles: Section.Occurrence)

	const staffMap = useObservable(staff$, {})
	const vehicleMap = useObservable(vehicles$, {})

	const [occurrenceId, setOccurrenceId] = useState('')
	const [vehicleIds, setVehicleIds] = useState<string[]>([])
	const [staffIds, setStaffIds] = useState<string[]>([])

	// Initial Values
	const activeOccurrenceMap = useObservable(activeOccurrences$, {})
	const activeOccurrence = internalId ? activeOccurrenceMap[internalId] : undefined
	useEffect(() => {
		if (activeOccurrence) {
			setOccurrenceId(activeOccurrence.occurrenceId)
			setVehicleIds(activeOccurrence.vehicleIds)
			setStaffIds(activeOccurrence.staffIds)
		}
	}, [activeOccurrence])

	const onOccurrencePrev = onClose
	const onOccurrenceNext = useNextSection(Section.Vehicles, setActiveSection, setOccurrenceId)

	const onVehiclesPrev = usePrevSection(Section.Occurrence, setActiveSection)
	const onVehiclesNext = useNextSection(Section.Staff, setActiveSection, setVehicleIds)

	const onStaffPrev = usePrevSection(Section.Vehicles, setActiveSection)
	const onStaffNext = useNextSection(Section.Confirm, setActiveSection, setStaffIds)

	const onConfirmPrev = usePrevSection(Section.Staff, setActiveSection)
	const onConfirm = () => {
		const target$ = internalId ? updateActiveOccurrence$ : createActiveOccurrence$
		target$.next({
			internalId: internalId ?? '',
			occurrenceId,
			staffIds,
			vehicleIds
		})
		onClose()
	}

	useEscapeKey(onClose)

	return (
		<FullscreenOverlay className='flex flex-col justify-center items-center'>
			<div className='absolute top-0 left-0 w-full h-full backdrop-blur-md' />

			<div className='flex bg-[#000] rounded-xl z-10 w-full max-w-7xl max-h-full p-5 pb-10'>
				{!internalId && (activeSection === Section.Occurrence) && <PickOccurrence
					initialValue={occurrenceId}
					onCancel={onClose}
					onNext={onOccurrenceNext}
					onPrevious={onOccurrencePrev}
				/>}
				{(activeSection === Section.Vehicles) && <PickVehicles
					initialValue={vehicleIds}
					onCancel={onClose}
					onNext={onVehiclesNext}
					onPrevious={internalId ? undefined : onVehiclesPrev}
					vehicles={vehicleMap}
				/>}
				{(activeSection === Section.Staff) && <PickStaff
					initialValue={staffIds}
					onCancel={onClose}
					onNext={onStaffNext}
					onPrevious={onStaffPrev}
					staff={staffMap}
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
					vehicleIds={vehicleIds}
					vehicles={vehicleMap}
				/>}
			</div>
		</FullscreenOverlay>
	)
}
