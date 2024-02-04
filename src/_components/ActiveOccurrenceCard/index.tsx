import { type FunctionComponent } from 'react'
import { useObservable } from 'react-use'
import { occurrences$ } from '../../_state/store'
import { Button } from '../Button'

const entryClasses = 'w-full px-2 flex items-center justify-start text-left whitespace-nowrap'

type ActiveOccurrenceCardProps = {
	internalId: string
	occurrenceId: string
	onClick: (internalId: string) => void
	staffIds: string[]
	vehicleIds: string[]
}

export const ActiveOccurrenceCard: FunctionComponent<ActiveOccurrenceCardProps> = ({
	internalId,
	occurrenceId,
	onClick,
	staffIds,
	vehicleIds
}) => {
	const occurrences = useObservable(occurrences$, {})

	const occurrence = occurrences[occurrenceId]?.name
	const vehicleCount = vehicleIds.length
	const staffCount = staffIds.length

	const clickHandler = () => {
		onClick(internalId)
	}

	return (
		<Button className='animate-tinyPing min-h-28 h-full flex items-stretch pl-2' onClick={clickHandler}>
			<div className='text-primary uppercase text-lg font-extrabold'>
				<div className='flex flex-row w-full h-full gap-2'>
					<div className='bg-gradient-to-r from-[#000]/90 to-[#000]/30'>
						<label className='w-48 h-full p-2 flex items-center justify-center overflow-hidden'>
							{occurrence}
						</label>
					</div>

					<div className='flex-1 flex flex-col gap-2 justify-center items-left'>
						<div className={entryClasses}>
							Bombeiros: {staffCount}
						</div>

						<div className={entryClasses}>
							Veículos: {vehicleCount}
						</div>
					</div>
				</div>
			</div>
		</Button>
	)
}
