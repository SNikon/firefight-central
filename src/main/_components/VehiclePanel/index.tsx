import { type FunctionComponent, useEffect, useState } from 'react'
import { useObservable } from 'react-use'
import { type Vehicle, VehicleState } from '../../../_consts/native'
import { createVehicle$, deleteVehicle$, updateVehicle$, vehicles$ } from '../../../_state/store'
import { Button } from '../../../_components/Button'
import { useEscapeKey } from '../../../_utils/useEscapeKey'
import { vehicleStateToLocale } from '../../../_utils/vehicleStateToLocale'

const stateOptions = [
	VehicleState.Available,
	VehicleState.Unavailable
].map(value => ({ value: value, label: vehicleStateToLocale(value) }))

type VehiclePanelProps = {
	internalId: string | undefined
	onClose: () => void
}

export const VehiclePanel: FunctionComponent<VehiclePanelProps> = ({ internalId, onClose }) => {
	const vehicleMap = useObservable(vehicles$, {})

	const [vehicleId, setVehicleId] = useState('')
	const onVehicleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVehicleId(e.target.value)
	}

	const [vehicleLicensePlate, setVehicleLicensePlate] = useState('')
	const onVehicleLicensePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVehicleLicensePlate(e.target.value?.toUpperCase())
	}

	const [vehicleCapacity, setVehicleCapacity] = useState('')
	const onVehicleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setVehicleCapacity(e.target.value)
	}

	const [vehicleState, setVehicleState] = useState(VehicleState.Available)
	const onVehicleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setVehicleState(e.target.value as VehicleState)
	}

	const canSave = Boolean(vehicleId.trim())

	useEffect(() => {
		const vehicle = internalId ? vehicleMap[internalId] : undefined
		if (!vehicle) {
			return
		}

		setVehicleId(vehicle.label)
		setVehicleLicensePlate(vehicle.licensePlate ?? '')
		setVehicleCapacity(vehicle.capacity?.toString() ?? '')
		setVehicleState(vehicle.state)
	}, [internalId, vehicleMap])

	const onSave = () => {
		const parsedCapacity = vehicleCapacity.trim() === '' ? undefined : Number.parseInt(vehicleCapacity, 10)

		const vehicle = {
			internalId: internalId ?? '',
			capacity: parsedCapacity,
			label: vehicleId,
			licensePlate: vehicleLicensePlate,
			state: vehicleState,
			image: ''
		} satisfies Vehicle

		const tg$ = internalId ? updateVehicle$ : createVehicle$
		tg$.next(vehicle)

		onClose()
	}

	const onDelete = () => {
		if (!internalId) {
			return
		}

		deleteVehicle$.next(internalId)
		onClose()
	}

	useEscapeKey(onClose)

	return <div className='absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full z-10 select-none'>
		<div className='absolute top-0 left-0 w-full h-full backdrop-blur-md' />

		<div className='flex flex-col bg-[#000] text-primary p-5 rounded-xl z-10 w-full max-w-2xl'>
			<div className='text-2xl font-extrabold'>
				{internalId ? 'Gerir' : 'Adicionar'} veículo
			</div>

			<label className='mt-5 text-action'>Identificador</label>
			<input
				className='bg-background text-action mt-1 p-2 rounded border border-[#000]/50'
				onChange={onVehicleIdChange}
				placeholder='Identificador'
				value={vehicleId}
			/>

			<label className='mt-5 text-action'>Matricula</label>
			<input
				className='bg-background text-action mt-1 p-2 rounded border border-[#000]/50'
				onChange={onVehicleLicensePlateChange}
				placeholder='Matricula'
				value={vehicleLicensePlate}
			/>

			<label className='mt-5 text-action'>Capacidade</label>
			<input
				className='bg-background text-action mt-1 p-2 rounded border border-[#000]/50'
				onChange={onVehicleCapacityChange}
				placeholder='Ocupação máxima'
				value={vehicleCapacity}
			/>

			<label className='mt-5 text-action'>Estado</label>
			<select
				className='bg-background text-action mt-1 p-2 rounded border border-[#000]/50'
				disabled={vehicleState === VehicleState.Dispatched}
				onChange={onVehicleStateChange}
				value={vehicleState}
			>
				{stateOptions.map(option => (
					<option key={option.value} value={option.value}>{option.label}</option>
				))}
			</select>

			<div className='flex flex-row justify-between mt-10'>
				<div className='space-x-5'>
					{internalId && <Button danger onClick={onDelete}>Eliminar</Button>}
				</div>

				<div className='space-x-5'>
					<Button onClick={onClose}>Cancelar</Button>
					<Button disabled={!canSave} onClick={onSave}>{internalId ? 'Gravar' : 'Criar'}</Button>
				</div>
			</div>
		</div>
	</div>
}
