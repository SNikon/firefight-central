import { useMemo, useState } from 'react'
import { useObservable } from 'react-use'
import { teams$ } from '../../_state/store'
import { teamSortByLabel } from '../../_utils/teamSort'
import { Header } from '../../_components/Header'
import { Button } from '../../_components/Button'
import { Scrollable } from '../../_components/Scrollable'
import { CardGrid } from '../../_components/CardGrid'
import { Modal } from '../../_components/Modal'
import { TeamCard } from '../../_components/TeamCard'
import { TeamPanel } from '../_components/TeamPanel'
import { useLanguageStore } from '../../_state/lang'

export const ManageTeams = () => {
	const { languageData } = useLanguageStore()

	const teamsMap = useObservable(teams$, {})
	const teams = useMemo(() => {
		const entries = Object.values(teamsMap)
		entries.sort(teamSortByLabel)
		return entries
	}, [teamsMap])

	const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
	const [showForm, setShowForm] = useState(false)
	const closeForm = setShowForm.bind(null, false)

	const onCreate = () => {
		setSelectedId(undefined)
		setShowForm(true)
	}

	const onTeamClick = (id: string) => {
		setSelectedId(id)
		setShowForm(true)
	}

	return (
		<div className="bg-body-background text-body-text flex flex-1 flex-col overflow-hidden select-none">
			<Header>
				<div />
				<Button onClick={onCreate}>{languageData['manage_teams.new_team']}</Button>
			</Header>

			<Scrollable className="pb-10">
				<CardGrid>
					{teams.map((team) => (
						<TeamCard
							key={team.internalId}
							label={team.label}
							internalId={team.internalId}
							onClick={onTeamClick}
							state={team.state}
						/>
					))}
				</CardGrid>
			</Scrollable>

			{showForm && (
				<Modal>
					<TeamPanel internalId={selectedId} onClose={closeForm} />
				</Modal>
			)}
		</div>
	)
}
