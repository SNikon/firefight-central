import { useState, type FunctionComponent } from 'react'
import { Header, HeaderSection } from '../../../../_components/Header'
import { Button } from '../../../../_components/Button'
import { OccurrenceInfo } from '../../../../_consts/native'

type InformationPanelProps = {
	initialValue: OccurrenceInfo
	onCancel: () => void
	onNext: (ocurrenceInfo: OccurrenceInfo) => void
}

export const InformationPanel: FunctionComponent<InformationPanelProps> = ({ initialValue, onCancel, onNext }) => {
	const [occurrenceInfo, setOccurrenceInfo] = useState<OccurrenceInfo>(initialValue)

	const onSetLocation = (e: React.ChangeEvent<HTMLInputElement>) => {
		setOccurrenceInfo(prevInfo => {
			return { ...prevInfo, location: e.target.value }
		})
	}

	const onSetAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
		setOccurrenceInfo(prevInfo => {
			return { ...prevInfo, address: e.target.value }
		})
	}

	const onSetDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setOccurrenceInfo(prevInfo => {
			return { ...prevInfo, description: e.target.value }
		})
	}

	const onSetReferencePoint = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setOccurrenceInfo(prevInfo => {
			return { ...prevInfo, referencePoint: e.target.value }
		})
	}

	const onSetCoduNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
		setOccurrenceInfo(prevInfo => {
			return { ...prevInfo, coduNumber: e.target.value }
		})
	}

	const onSetVmerSiv = (e: React.ChangeEvent<HTMLInputElement>) => {
		setOccurrenceInfo(prevInfo => {
			return { ...prevInfo, vmerSiv: e.target.checked }
		})
	}

	const onLocalNext = () => {
		onNext(occurrenceInfo)
	}

	return (
		<div className='w-full text-action flex flex-col overflow-hidden'>
			<Header className="px-0 pt-0 mb-5">
				<HeaderSection>
					<Button onClick={onCancel}>Cancelar</Button>
				</HeaderSection>
				
				<HeaderSection>
					<Button onClick={onLocalNext}>Continuar</Button>
				</HeaderSection>
			</Header>

			<div className='grid grid-flow-row grid-cols-2 gap-5 mt-5'>
				<fieldset>
					<label className='mr-3 text-action'>Localidade</label>
					<input
						className='bg-background text-action w-full p-2 rounded border border-[#000]/50'
						onChange={onSetLocation}
						placeholder='Localidade'
						value={occurrenceInfo.location}
					/>
				</fieldset>
				
				<fieldset>
					<label className='mr-3 text-action'>Morada</label>
					<input
						className='bg-background text-action w-full p-2 rounded border border-[#000]/50'
						onChange={onSetAddress}
						placeholder='Morada'
						value={occurrenceInfo.address}
					/>
				</fieldset>
				
				<fieldset>
					<label className='align-top mr-3 text-action'>Descrição de Ocorrência</label>
					<textarea
						className='bg-background text-action w-full p-2 rounded border border-[#000]/50'
						onChange={onSetDescription}
						placeholder='Descrição de Ocorrência'
						value={occurrenceInfo.description}
					/>
				</fieldset>
				
				<fieldset>
					<label className='mr-3 text-action'>Ponto de Referência</label>
					<textarea
						className='bg-background text-action w-full p-2 rounded border border-[#000]/50'
						onChange={onSetReferencePoint}
						placeholder='Ponto de Referência'
						value={occurrenceInfo.referencePoint}
					/>
				</fieldset>
				
				<fieldset>
					<label className='mr-3 text-action'>Número CODU</label>
					<input
						className='bg-background text-action w-full p-2 rounded border border-[#000]/50'
						onChange={onSetCoduNumber}
						placeholder='Número CODU'
						value={occurrenceInfo.coduNumber}
					/>
				</fieldset>
				
				<fieldset className='display-inline-flex'>
					<label className='mr-3 text-action'>VMER / SIV</label>
					<input
						type='checkbox'
						checked={occurrenceInfo.vmerSiv}
						className='bg-background text-action rounded border border-[#000]/50'
						onChange={onSetVmerSiv}
						placeholder='VMER / SIV'
					/>
				</fieldset>
			</div>
		</div>
	)
}