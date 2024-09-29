import { type FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useObservable } from 'react-use'
import { type Staff, StaffState, StaffRank, StaffPermission } from '../../../_consts/native'
import { createStaff$, deleteStaff$, staff$, updateStaff$ } from '../../../_state/store'
import { Button } from '../../../_components/Button'
import { useEscapeKey } from '../../../_utils/useEscapeKey'
import { staffStateToLocale } from '../../../_utils/staffStateToLocale'
import { staffRankToLocale } from '../../../_utils/staffRankToLocale'
import { staffPermissionToLocale } from '../../../_utils/permissionToLocale'
import { useLanguageStore } from '../../../_state/lang'

type StaffPanelProps = {
  internalId: string | undefined
  onClose: () => void
}

export const StaffPanel: FunctionComponent<StaffPanelProps> = ({ internalId, onClose }) => {
	const { languageData } = useLanguageStore()
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

	const [staffPermission, setStaffPermission] = useState(StaffPermission.Own)
	const onStaffPermissionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setStaffPermission(e.target.value as StaffPermission)
	}

	const [staffImage, setStaffImage] = useState('')
	const onStaffImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) {
			return
		}

		const reader = new FileReader()
		reader.onload = () => {
			setStaffImage(reader.result as string)
		}
		reader.readAsDataURL(file)
	}

	const canSave = staffName.trim() && staffId.trim()

	useEffect(() => {
		const staff = internalId ? staffMap[internalId] : undefined
		if (!staff) {
			return
		}

		setStaffId(staff.label)
		setStaffImage(staff.image ?? '')
		setStaffName(staff.name)
		setStaffNationalId(staff.nationalId)
		setStaffPermission(staff.permission)
		setStaffRank(staff.rank)
		setStaffState(staff.state)
	}, [internalId, staffMap])

	const onSave = () => {
		const staff = {
			internalId: internalId ?? '',
			image: staffImage,
			label: staffId,
			name: staffName,
			nationalId: staffNationalId,
			permission: staffPermission,
			rank: staffRank,
			state: staffState
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

	const stateOptions = useMemo(
		() =>
			[StaffState.Available, StaffState.Inactive, StaffState.SickLeave, StaffState.Unavailable].map((value) => ({
				value: value,
				label: staffStateToLocale(value, languageData)
			})),
		[languageData]
	)

	const rankOptions = useMemo(
		() =>
			[
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
			].map((value) => ({ value: value, label: staffRankToLocale(value, languageData) })),
		[languageData]
	)

	const permissionOptions = useMemo(
		() =>
			[StaffPermission.All, StaffPermission.Shift, StaffPermission.Own, StaffPermission.None].map((value) => ({
				value: value,
				label: staffPermissionToLocale(value, languageData)
			})),
		[languageData]
	)

	return (
		<div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full z-10 select-none">
			<div className="absolute top-0 left-0 w-full h-full backdrop-blur-md" />

			<div className="flex flex-col bg-[#000] text-primary p-5 rounded-xl z-10 w-full max-w-2xl max-h-[calc(100vh-50px)] overflow-y-auto">
				<div className="text-2xl font-extrabold">
					{languageData[internalId ? 'manage_staff.edit_staff' : 'manage_staff.add_staff']}
				</div>

				<label className="mt-5 text-action">{languageData['manage_staff.form.name']}</label>
				<input
					className="bg-background text-action mt-1 p-2 rounded border border-[#000]/50"
					onChange={onStaffIdChange}
					placeholder={languageData['manage_staff.form.name_placeholder']}
					value={staffId}
				/>

				<label className="mt-5 text-action">{languageData['manage_staff.form.name']}</label>
				<input
					className="bg-background text-action mt-1 p-2 rounded border border-[#000]/50"
					onChange={onStaffNameChange}
					placeholder={languageData['manage_staff.form.name_placeholder']}
					value={staffName}
				/>

				<label className="mt-5 text-action">{languageData['manage_staff.form.national_id']}</label>
				<input
					className="bg-background text-action mt-1 p-2 rounded border border-[#000]/50"
					onChange={onStaffNationalIdChange}
					placeholder={languageData['manage_staff.form.national_id_placeholder']}
					value={staffNationalId}
				/>

				<label className="mt-5 text-action">{languageData['manage_staff.form.rank']}</label>
				<select
					className="bg-background text-action mt-1 p-2 rounded border border-[#000]/50"
					onChange={onStaffRankChange}
					value={staffRank}
				>
					{rankOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>

				<label className="mt-5 text-action">{languageData['manage_staff.form.state']}</label>
				<select
					className="bg-background text-action mt-1 p-2 rounded border border-[#000]/50"
					disabled={staffState === StaffState.Dispatched}
					onChange={onStaffStateChange}
					value={staffState}
				>
					{stateOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>

				<label className="mt-5 text-action">{languageData['manage_staff.form.image']}</label>
				{staffImage && (
					<div className="flex flex-row justify-center">
						<img className="max-h-[150px] p-2 rounded border border-[#000]/50" src={staffImage} />
					</div>
				)}
				<input
					accept="image/*"
					className="bg-background text-action mt-1 p-2 rounded border border-[#000]/50"
					onChange={onStaffImageChange}
					type="file"
				/>

				<label className="mt-5 text-action">{languageData['manage_staff.form.permission']}</label>
				<select
					className="bg-background text-action mt-1 p-2 rounded border border-[#000]/50"
					onChange={onStaffPermissionChange}
					value={staffPermission}
				>
					{permissionOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>

				<div className="flex flex-row justify-between mt-10">
					<div className="space-x-5">
						{internalId && (
							<Button danger onClick={onDelete}>
								{languageData['terms.remove']}
							</Button>
						)}
					</div>

					<div className="space-x-5">
						<Button onClick={onClose}>{languageData['terms.cancel']}</Button>
						<Button disabled={!canSave} onClick={onSave}>
							{languageData[internalId ? 'terms.save' : 'terms.create']}
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
