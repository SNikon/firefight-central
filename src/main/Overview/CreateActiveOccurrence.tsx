import { FunctionComponent, useCallback, useMemo, useState } from "react"
import { CardGrid } from "../../_components/CardGrid"
import { Scrollable } from "../../_components/Scrollable"
import { TableHeader } from "../_components/TableHeader"
import { Button } from "../../_components/Button"
import { createActiveOccurrence$, occurrences$, staff$, vehicles$ } from "../../_state/store"
import { useObservable } from "react-use"
import { OccurrenceCard } from "../../_components/OccurrenceCard"
import { VehicleCard } from "../../_components/VehicleCard"
import { vehicleSortByOcurrenceState } from "../../_utils/vehicleSort"
import { occurrenceSortByLabel } from "../../_utils/occurrenceSort"
import { staffSortByOccurrenceState } from "../../_utils/staffSort"
import { StaffCard } from "../../_components/StaffCard"
import { invoke } from "@tauri-apps/api"
import { FullscreenOverlay } from "../../_components/FullScreenOverlay"

interface SectionProps<T> {
	initialValue: T
	onCancel: () => void
	onNext: (value: T) => void
	onPrevious: () => void
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
		<div className="text-action flex flex-col overflow-hidden">
			<TableHeader>
				<Button onClick={onCancel}>Cancelar</Button>
			</TableHeader>
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

type PickVehiclesProps = SectionProps<string[]>
const PickVehicles: FunctionComponent<PickVehiclesProps> = ({ initialValue, onCancel, onPrevious, onNext }) => {
	const vehicles = useObservable(vehicles$, {})
	const sortedVehicles = useMemo(() => {
		const entries = Object.values(vehicles)
		entries.sort(vehicleSortByOcurrenceState)
		return entries
	}, [vehicles])

	const [selected, setSelected] = useState<string[]>(initialValue)
	
	const onSelect = (vehicleId: string) => setSelected(prevSelected => {
		const foundIdx = prevSelected.indexOf(vehicleId)
		if (foundIdx >= 0) {
			const nextSelected = prevSelected.slice()
			nextSelected.splice(foundIdx, 1)
			return nextSelected
		}

		return [...prevSelected, vehicleId]
	})
	const onConfirm = onNext.bind(null, selected)

	return (
		<div className="text-action flex flex-col overflow-hidden">
			<TableHeader>
				<Button onClick={onCancel}>Cancelar</Button>
				<Button onClick={onPrevious}>Voltar</Button>
				<Button onClick={onConfirm}>Continuar</Button>
			</TableHeader>
			<Scrollable>
				<CardGrid>
					{sortedVehicles.map(vehicle => (
						<VehicleCard
							key={vehicle.internalId}
							image={vehicle.image}
							internalId={vehicle.internalId}
							label={vehicle.label}
							onClick={onSelect}
							selected={selected.includes(vehicle.internalId)}
							state={vehicle.state}
						/>
					))}
				</CardGrid>
			</Scrollable>
		</div>
	)
}

type PickStaffProps = SectionProps<string[]>
const PickStaff: FunctionComponent<PickStaffProps> = ({ initialValue, onCancel, onPrevious, onNext }) => {
	const staff = useObservable(staff$, {})
	const sortedStaff = useMemo(() => {
		const entries = Object.values(staff)
		entries.sort(staffSortByOccurrenceState)
		return entries
	}, [staff])

	const [selected, setSelected] = useState<string[]>(initialValue)
	
	const onSelect = (vehicleId: string) => setSelected(prevSelected => {
		const foundIdx = prevSelected.indexOf(vehicleId)
		if (foundIdx >= 0) {
			const nextSelected = prevSelected.slice()
			nextSelected.splice(foundIdx, 1)
			return nextSelected
		}

		return [...prevSelected, vehicleId]
	})
	const onConfirm = onNext.bind(null, selected)

	return (
		<div className="text-action flex flex-col overflow-hidden">
			<TableHeader>
				<Button onClick={onCancel}>Cancelar</Button>
				<Button onClick={onPrevious}>Voltar</Button>
				<Button onClick={onConfirm}>Continuar</Button>
			</TableHeader>
			<Scrollable>
				<CardGrid>
					{sortedStaff.map(staff => (
						<StaffCard
							key={staff.internalId}
							image={staff.image}
							internalId={staff.internalId}
							label={staff.label}
							name={staff.name}
							onClick={onSelect}
							selected={selected.includes(staff.internalId)}
							state={staff.state}
						/>
					))}
				</CardGrid>
			</Scrollable>
		</div>
	)
}

interface ConfirmOccurrenceProps extends Omit<SectionProps<void>, 'initialValue'> {
	occurrenceId: string
	vehicleIds: string[]
	staffIds: string[]
}

const ConfirmOccurrence: FunctionComponent<ConfirmOccurrenceProps> = ({
	occurrenceId,
	vehicleIds,
	staffIds,
	onCancel,
	onNext,
	onPrevious
}) => {
	const occurrences = useObservable(occurrences$, {})
	const vehicles = useObservable(vehicles$, {})
	const staff = useObservable(staff$, {})

	const occurrence = occurrences[occurrenceId]?.name
	const vehicleSet = vehicleIds.map(id => vehicles[id]?.label)
	const staffSet = staffIds.map(id => staff[id]?.label)
	
	const onSendAlert = () => {
		invoke('alarm', {
			occurrence: occurrence,
			staff: staffSet,
			vehicles: vehicleSet
		})
	}

	return (
	
		<div className="text-action flex flex-col overflow-hidden">
			<TableHeader>
				<Button onClick={onSendAlert}>Enviar Alerta</Button>
				<Button onClick={onCancel}>Cancelar</Button>
				<Button onClick={onPrevious}>Voltar</Button>
				<Button onClick={onNext}>Confirmar</Button>
			</TableHeader>

			<p>Tipo de Ocorrência: {occurrence}</p>
			<p>Vehiculos: {vehicleSet.join(', ')}</p>
			<p>Equipa: {staffSet.join(', ')}</p>
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

interface CreateActiveOccurrenceProps {
	onClose: () => void
}

export const CreateActiveOccurrence: FunctionComponent<CreateActiveOccurrenceProps> = ({ onClose }) => {
	const [activeSection, setActiveSection] = useState(Section.Occurrence)

	const [occurrenceId, setOccurrenceId] = useState('')
	const [vehicleIds, setVehicleIds] = useState<string[]>([])
	const [staffIds, setStaffIds] = useState<string[]>([])

	const onOccurrencePrev = onClose
	const onOccurrenceNext = useNextSection(Section.Vehicles, setActiveSection, setOccurrenceId)
	
	const onVehiclesPrev = usePrevSection(Section.Occurrence, setActiveSection)
	const onVehiclesNext = useNextSection(Section.Staff, setActiveSection, setVehicleIds)

	const onStaffPrev = usePrevSection(Section.Vehicles, setActiveSection)
	const onStaffNext = useNextSection(Section.Confirm, setActiveSection, setStaffIds)
	
	const onConfirmPrev = usePrevSection(Section.Staff, setActiveSection)
	const onConfirm = () => {
		createActiveOccurrence$.next({
			internalId: '',
			occurrenceId,
			staffIds,
			vehicleIds
		})
		onClose()
	}

	return (
		<FullscreenOverlay className="flex flex-col justify-center items-center">
			<div className="absolute top-0 left-0 w-full h-full backdrop-blur-md" />
			
			<div className="flex bg-[#000] rounded-xl z-10 w-full max-w-7xl max-h-full p-5 pb-10">
				{(activeSection === Section.Occurrence) && <PickOccurrence
					initialValue={occurrenceId}
					onCancel={onClose}
					onNext={onOccurrenceNext}
					onPrevious={onOccurrencePrev}
				/>}
				{(activeSection === Section.Vehicles) && <PickVehicles
					initialValue={vehicleIds}
					onCancel={onClose}
					onNext={onVehiclesNext}
					onPrevious={onVehiclesPrev}
				/>}
				{(activeSection === Section.Staff) && <PickStaff
					initialValue={staffIds}
					onCancel={onClose}
					onNext={onStaffNext}
					onPrevious={onStaffPrev}
				/>}
				{(activeSection === Section.Confirm) && <ConfirmOccurrence
					occurrenceId={occurrenceId}
					onCancel={onClose}
					onNext={onConfirm}
					onPrevious={onConfirmPrev}
					staffIds={staffIds}
					vehicleIds={vehicleIds}
				/>}
			</div>
		</FullscreenOverlay>
	)
}