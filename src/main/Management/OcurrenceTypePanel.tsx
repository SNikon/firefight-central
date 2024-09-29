import { type FunctionComponent, useState } from 'react'
import { Button } from '../../_components/Button'
import { useEscapeKey } from '../../_utils/useEscapeKey'
import { Occurrence } from '../../_consts/native'
import { createOccurrence$ } from '../../_state/store'
import { useLanguageStore } from '../../_state/lang'

type OcurrencePanelProps = {
  onClose: () => void
}

export const OcurrenceTypePanel: FunctionComponent<OcurrencePanelProps> = ({ onClose }) => {
	const { languageData } = useLanguageStore()

	const [name, setName] = useState('')
	const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value)
	}

	const canSave = Boolean(name.trim())

	const onSave = () => {
		const ocurrence = {
			internalId: '',
			image: '',
			name
		} satisfies Occurrence

		createOccurrence$.next(ocurrence)
		onClose()
	}

	useEscapeKey(onClose)

	return (
		<div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full z-10 select-none">
			<div className="absolute top-0 left-0 w-full h-full backdrop-blur-md" />

			<div className="flex flex-col bg-[#000] text-primary p-5 rounded-xl z-10 w-full max-w-2xl max-h-[calc(100vh-50px)] overflow-y-auto">
				<div className="text-2xl font-extrabold">{languageData['manage_occurrences.new_occurrence']}</div>
				<label className="mt-5 text-action">{languageData['terms.name']}</label>
				<input
					className="bg-background text-action mt-1 p-2 rounded border border-[#000]/50"
					onChange={onNameChange}
					placeholder="Nome"
					value={name}
				/>

				<div className="flex flex-row justify-center mt-10 space-x-5">
					<Button onClick={onClose}>{languageData['terms.cancel']}</Button>
					<Button disabled={!canSave} onClick={onSave}>
						{languageData['terms.create']}
					</Button>
				</div>
			</div>
		</div>
	)
}
