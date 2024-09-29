import { type FunctionComponent } from 'react'
import { useObservable } from 'react-use'
import { occurrences$ } from '../../_state/store'
import { Button } from '../Button'
import { useLanguageStore } from '../../_state/lang'

const entryClasses = 'w-full px-2 flex items-center justify-start text-left'

type ActiveOccurrenceCardProps = {
  creationTime?: number
  internalId: string
  occurrenceId: string
  onClick: (internalId: string) => void
  staffIds: string[]
  vehicleIds: string[]
}

export const ActiveOccurrenceCard: FunctionComponent<ActiveOccurrenceCardProps> = ({
	creationTime,
	internalId,
	occurrenceId,
	onClick,
	staffIds,
	vehicleIds
}) => {
	const { languageData } = useLanguageStore()
	const occurrences = useObservable(occurrences$, {})

	const occurrence = occurrences[occurrenceId]?.name
	const vehicleCount = vehicleIds.length
	const staffCount = staffIds.length

	const clickHandler = () => {
		onClick(internalId)
	}

	return (
		<Button
			className="animate-tinyPing min-h-36 h-full flex flex-col justify-stretch items-stretch pl-2"
			onClick={clickHandler}
		>
			<div className="w-full px-2 text-center text-sm mb-2">
				{languageData['terms.dispatch']}: {creationTime ? new Date(creationTime).toLocaleString() : ''}
			</div>

			<div className="flex flex-row flex-1 text-primary uppercase text-lg font-extrabold">
				<div className="flex flex-row flex-1 w-full gap-2">
					<div className="bg-gradient-to-r from-[#000]/90 to-[#000]/30">
						<label className="w-40 h-full p-2 flex items-center justify-center whitespace-break-spaces">
							{occurrence}
						</label>
					</div>

					<div className="flex-1 flex flex-col gap-2 justify-center items-left overflow-hidden">
						<div className={entryClasses}>
							{languageData['terms.firefighters']}: {staffCount}
						</div>

						<div className={entryClasses}>
							{languageData['terms.vehicles']}: {vehicleCount}
						</div>
					</div>
				</div>
			</div>
		</Button>
	)
}
