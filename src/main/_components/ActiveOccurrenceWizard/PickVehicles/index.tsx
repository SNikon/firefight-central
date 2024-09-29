import { type FunctionComponent, useMemo, useState, useEffect } from 'react'
import { Scrollable } from '../../../../_components/Scrollable'
import { Header, HeaderSection } from '../../../../_components/Header'
import { Button } from '../../../../_components/Button'
import { vehicleSortByOcurrenceState } from '../../../../_utils/vehicleSort'
import { Vehicle, VehicleState } from '../../../../_consts/native'
import { VehicleTag } from '../../../../_components/VehicleTag'
import { TagGrid } from '../../../../_components/TagGrid'
import { useLanguageStore } from '../../../../_state/lang'

type PickVehiclesProps = {
  initialValue: string[]
  onCancel: () => void
  onNext: (value: string[]) => void
  onPrevious?: () => void
  vehicles: Record<string, Vehicle>
}

export const PickVehicles: FunctionComponent<PickVehiclesProps> = ({
	initialValue,
	onCancel,
	onPrevious,
	onNext,
	vehicles
}) => {
	const { languageData } = useLanguageStore()

	const sortedVehicles = useMemo(() => {
		const entries = Object.values(vehicles).filter(
			(vehicle) => vehicle.state === VehicleState.Available || vehicle.state === VehicleState.Dispatched
		)
		entries.sort(vehicleSortByOcurrenceState)
		return entries
	}, [vehicles])

	const [selected, setSelected] = useState<string[]>(initialValue)
	useEffect(() => setSelected(initialValue), [initialValue])

	const onSelect = (vehicleId: string) => {
		setSelected((prevSelected) => {
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
		<div className="w-full text-action flex flex-col overflow-hidden">
			<Header className="px-0 pt-0 mb-5">
				<HeaderSection>
					<Button onClick={onCancel}>{languageData['terms.cancel']}</Button>
				</HeaderSection>

				<HeaderSection>
					{onPrevious && <Button onClick={onPrevious}>{languageData['terms.back']}</Button>}
					<Button onClick={onNext.bind(null, selected)}>{languageData['terms.next']}</Button>
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
