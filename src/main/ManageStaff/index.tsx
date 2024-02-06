import { useObservable } from 'react-use'
import { useMemo, useState } from 'react'
import { Button } from '../../_components/Button'
import { CardGrid } from '../../_components/CardGrid'
import { StaffCard } from '../../_components/StaffCard'
import { Header } from '../../_components/Header'
import { staff$ } from '../../_state/store'
import { Modal } from '../../_components/Modal'
import { Scrollable } from '../../_components/Scrollable'
import { staffSortByLabel } from '../../_utils/staffSort'
import { StaffPanel } from '../_components/StaffPanel'

export const ManageStaff = () => {
	const staffMap = useObservable(staff$, {})
	const staff = useMemo(() => {
		const entries = Object.values(staffMap)
		entries.sort(staffSortByLabel)
		return entries
	}, [staffMap])

	const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
	const [showForm, setShowForm] = useState(false)
	const closeForm = setShowForm.bind(null, false)

	const onCreate = () => {
		setSelectedId(undefined)
		setShowForm(true)
	}

	const onStaffClick = (id: string) => {
		setSelectedId(id)
		setShowForm(true)
	}

	return (
		<div className='bg-body-background text-body-text flex flex-1 flex-col overflow-hidden select-none'>
			<Header>
				<Button onClick={() => {}}>Turno</Button>
				<Button onClick={onCreate}>Novo bombeiro</Button>
			</Header>

			<Scrollable className='pb-10'>
				<CardGrid>
					{staff.map(staff => (
						<StaffCard
							key={staff.internalId}
							label={staff.label}
							image={staff.image}
							internalId={staff.internalId}
							name={staff.name}
							onClick={onStaffClick}
							state={staff.state}
						/>
					))}
				</CardGrid>
			</Scrollable>

			{showForm && <Modal><StaffPanel internalId={selectedId} onClose={closeForm} /></Modal>}
		</div>
	)
}
