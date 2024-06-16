import { type FunctionComponent, useEffect, useState } from 'react'
import { useObservable } from 'react-use'
import { type Staff, StaffState, StaffRank } from '../../../_consts/native'
import { createStaff$, deleteStaff$, staff$, updateStaff$ } from '../../../_state/store'
import { Button } from '../../../_components/Button'
import { useEscapeKey } from '../../../_utils/useEscapeKey'
import { staffStateToLocale } from '../../../_utils/staffStateToLocale'
import { staffRankToLocale } from '../../../_utils/staffRankToLocale'

const stateOptions = [
	StaffState.Available,
	StaffState.Inactive,
	StaffState.SickLeave,
	StaffState.Unavailable
].map(value => ({ value: value, label: staffStateToLocale(value) }))

const rankOptions = [
	StaffRank.Unknown,
	StaffRank.Rank8,
	StaffRank.Rank7,
	StaffRank.Rank6,
	StaffRank.Rank5,
	StaffRank.Rank4,
	StaffRank.Rank3,
	StaffRank.Rank2,
	StaffRank.Rank1,
	StaffRank.Rank0
].map(value => ({ value: value, label: staffRankToLocale(value) }))

type StaffPanelProps = {
	internalId: string | undefined
	onClose: () => void
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

	const [staffNationalId, setStaffNationalId] = useState('')
	const onStaffNationalIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStaffNationalId(e.target.value)
	}

	const [staffRank, setStaffRank] = useState(StaffRank.Unknown)
	const onStaffRankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStaffRank(e.target.value as StaffRank)
	}

	const [staffState, setStaffState] = useState(StaffState.Unavailable)
	const onStaffStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStaffState(e.target.value as StaffState)
	}

	const canSave = staffName.trim() && staffId.trim()

	useEffect(() => {
		const staff = internalId ? staffMap[internalId] : undefined
		if (!staff) {
			return
		}

		setStaffId(staff.label)
		setStaffState(staff.state)
		setStaffRank(staff.rank)
		setStaffName(staff.name)
		setStaffNationalId(staff.nationalId)
	}, [internalId, staffMap])

	const onSave = () => {
		const staff = {
			internalId: internalId ?? '',
			label: staffId,
			name: staffName,
			nationalId: staffNationalId,
			rank: staffRank,
			state: staffState,
			image: ''
		} satisfies Staff

		const tg$ = internalId ? updateStaff$ : createStaff$
		tg$.next(staff)

		onClose()
	}

	const onDelete = () => {
		if (!internalId) {
			return
		}

		deleteStaff$.next(internalId)
		onClose()
	}

	useEscapeKey(onClose)

	return <div className='absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full z-10 select-none'>
		<div className='absolute top-0 left-0 w-full h-full backdrop-blur-md' />

		<div className='flex flex-col bg-[#000] text-primary p-5 rounded-xl z-10 w-full max-w-2xl'>
			<div className='text-2xl font-extrabold'>
				{internalId ? 'Gerir' : 'Adicionar'} bombeiro
			</div>

			<label className='mt-5 text-action'>Identificador</label>
			<input
				className='bg-background text-action mt-1 p-2 rounded border border-[#000]/50'
				onChange={onStaffIdChange}
				placeholder='Identificador'
				value={staffId}
			/>

			<label className='mt-5 text-action'>Nome</label>
			<input
				className='bg-background text-action mt-1 p-2 rounded border border-[#000]/50'
				onChange={onStaffNameChange}
				placeholder='Nome'
				value={staffName}
			/>

			
			<label className='mt-5 text-action'>Número Mecanográfico</label>
			<input
				className='bg-background text-action mt-1 p-2 rounded border border-[#000]/50'
				onChange={onStaffNationalIdChange}
				placeholder='Número Mecanográfico'
				value={staffNationalId}
			/>

			<label className='mt-5 text-action'>Posto</label>
			<select
				className='bg-background text-action mt-1 p-2 rounded border border-[#000]/50'
				onChange={onStaffRankChange}
				value={staffRank}
			>
				{rankOptions.map(option => (
					<option key={option.value} value={option.value}>{option.label}</option>
				))}
			</select>

			<label className='mt-5 text-action'>Estado</label>
			<select
				className='bg-background text-action mt-1 p-2 rounded border border-[#000]/50'
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
