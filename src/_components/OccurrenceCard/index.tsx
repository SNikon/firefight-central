import { FunctionComponent } from "react"
import { getCardClassForStates } from "../../_utils/cardStyle"
import classNames from "classnames"

interface OccurrenceCard {
	internalId: string
	name: string
	onClick: (internalId: string) => void
	selected?: boolean
}

export const OccurrenceCard: FunctionComponent<OccurrenceCard> = props => {
	const className = getCardClassForStates<void>(undefined, props.selected || false)
	const clickHandler = props.onClick.bind(null, props.internalId)

	const labelClassName = classNames('text-ellipsis', { 'text-[#000]': props.selected })

	return (
		<div className="w-full max-w-full h-full max-h-full overflow-visible">
			<button className={className} onClick={clickHandler}>
				<div className="w-full flex-1 rounded relative flex flex-col overflow-hidden justify-center items-center">
					<label className={labelClassName}>{props.name}</label>
				</div>
			</button>
		</div>
	)
}