import { type FunctionComponent } from 'react'
import { useObservable } from 'react-use'
import { occurrences$, staff$, vehicles$ } from '../../../_state/store'
import { staffRankToInsignia } from '../../../_utils/staffRankToInsignia'
import { StaffRank } from '../../../_consts/native'
import { useLanguageStore } from '../../../_state/lang'

const entryClasses = 'w-full h-9 px-2 flex items-center justify-start text-left font-bold text-action'

type ActiveOccurrenceDisplayProps = {
  creationTime?: number
  internalId: string
  occurrenceId: string
  staffIds: string[]
  vehicleIds: string[]
}

export const ActiveOccurrenceDisplay: FunctionComponent<ActiveOccurrenceDisplayProps> = ({
	creationTime,
	occurrenceId,
	staffIds,
	vehicleIds
}) => {
	const { languageData } = useLanguageStore()
	const occurrences = useObservable(occurrences$, {})
	const staff = useObservable(staff$, {})
	const vehicles = useObservable(vehicles$, {})

	const occurrence = occurrences[occurrenceId]?.name
	const vehicleCount = vehicleIds.length

	return (
		<div className="bg-button relative min-w-32 min-h-36 h-full rounded flex">
			{/* <div className='absolute top-0 left-0 w-full h-full' /> */}

			<div className="py-2 px-4 flex flex-col items-stretch bg-gradient-to-b from-[#000]/90 to-[#000]/30">
				<div className="font-bold text-warning w-full px-2 text-left text-sm mb-2">
					{languageData['terms.dispatch']}: {creationTime ? new Date(creationTime).toLocaleString() : ''}
				</div>

				<div className="font-bold text-primary w-full px-2 text-center text-lg mb-2 truncate">{occurrence}</div>

				<div className={`w-full grid grid-flow-col grid-cols-${vehicleCount} justify-center`}>
					{vehicleIds.map((id) => {
						const entry = vehicles[id]
						if (!entry) {
							return null
						}

						return (
							<div key={id} className={entryClasses}>
								{vehicles[id]?.label}
							</div>
						)
					})}
				</div>

				<div className={`w-full grid grid-flow-col grid-rows-2 grid-cols-${vehicleCount} justify-center`}>
					{staffIds.map((id) => {
						const entry = staff[id]
						if (!entry) {
							return null
						}

						return (
							<div key={id} className={entryClasses}>
								{entry.rank !== StaffRank.Unknown ? (
									<img className="h-7 w-5 mr-3 object-cover" src={staffRankToInsignia(entry.rank)} />
								) : (
									<div className="h-7 w-5 mr-3" />
								)}
								{entry.label}
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
