import { type FunctionComponent, useEffect, useState } from 'react'
import { type Staff, StaffState } from '../../../_consts/native'
import { useObservable } from 'react-use'
import { createStaff$, deleteStaff$, staff$, updateStaff$ } from '../../../_state/store'
import { Button } from '../../../_components/Button'

const stateOptions = [
	{ value: StaffState.Available, label: 'Disponível' },
	{ value: StaffState.Unavailable, label: 'Nao disponível' }
]

type StaffPanelProps = {
	internalId: string | undefined;
	onClose: () => void;
}

export const StaffPanel: FunctionComponent<StaffPanelProps> = ({ internalId, onClose }) => {
	const staffMap = useObservable(staff$, {})

	const [staffId, setStaffId] = useState('')
	const onStaffIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStaffId(e.target.value)
	}

	const [staffName, setStaffName] = useState('')
	const onStaffNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStaffName(e.target.value)
	}

	const [staffState, setStaffState] = useState(StaffState.Available)
	const onStaffStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStaffState(e.target.value as StaffState)
	}

	const [staffImage, setStaffImage] = useState('')
	// Const onStaffImageChange = (e: React.ChangeEvent<HTMLInputElement>) => setStaffImage(e.target.value)

	const canSave = staffName.trim() && staffId.trim()

	useEffect(() => {
		const staff = internalId ? staffMap[internalId] : undefined
		if (!staff) {
			return
		}

		setStaffId(staff.label)
		setStaffState(staff.state)
		setStaffImage(staff.image)
		setStaffName(staff.name)
	}, [internalId, staffMap])

	const onSave = () => {
		const staff = {
			internalId: internalId ?? '',
			label: staffId,
			name: staffName,
			state: staffState,
			image: staffImage
		} satisfies Staff

		const tg$ = internalId ? updateStaff$ : createStaff$
		tg$.next(staff)

		onClose()
	}

	const onDelete = () => {
		if (internalId === null) {
			return
		}

		deleteStaff$.next(internalId)
		onClose()
	}

	return <div className='absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full z-10 select-none'>
		<div className='absolute top-0 left-0 w-full h-full backdrop-blur-md' />

		<div className='flex flex-col bg-[#000] text-primary p-5 rounded-xl z-10 w-full max-w-2xl'>
			<div className='text-2xl font-extrabold'>
				{internalId ? 'Gerir' : 'Adicionar'} bombeiro
			</div>

			<input
				className='bg-background text-action  mt-5 p-2 rounded border border-[#000]/50'
				onChange={onStaffIdChange}
				placeholder='Identificador'
				value={staffId}
			/>

			<input
				className='bg-background text-action  mt-5 p-2 rounded border border-[#000]/50'
				onChange={onStaffNameChange}
				placeholder='Nome'
				value={staffName}
			/>

			<select
				className='bg-background text-action mt-5 p-2 rounded border border-[#000]/50'
				disabled={staffState === StaffState.Dispatched}
				onChange={onStaffStateChange}
				value={staffState}
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
