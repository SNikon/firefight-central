import { type FunctionComponent, useEffect, useState } from 'react'
import { useObservable } from 'react-use'
import { type Team, TeamState } from '../../../_consts/native'
import { createTeam$, deleteTeam$, teams$, updateTeam$ } from '../../../_state/store'
import { Button } from '../../../_components/Button'
import { useEscapeKey } from '../../../_utils/useEscapeKey'
// import { teamStateToLocale } from '../../../_utils/teamStateToLocale'
import { useLanguageStore } from '../../../_state/lang'

// const stateOptions = [TeamState.Available, TeamState.Unavailable].map((value) => ({
//   value: value,
//   label: teamStateToLocale(value)
// }))

type TeamPanelProps = {
  internalId: string | undefined
  onClose: () => void
}

export const TeamPanel: FunctionComponent<TeamPanelProps> = ({ internalId, onClose }) => {
  const { languageData } = useLanguageStore()
  const teamMap = useObservable(teams$, {})

  const [teamLabel, setTeamLabel] = useState('')
  const onTeamLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamLabel(e.target.value)
  }

  const [teamState, setTeamState] = useState(TeamState.Available)
  // const onTeamStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  // 	setTeamState(e.target.value as TeamState)
  // }

  const canSave = Boolean(teamLabel.trim())

  useEffect(() => {
    const team = internalId ? teamMap[internalId] : undefined
    if (!team) {
      return
    }

    setTeamLabel(team.label)
    setTeamState(team.state)
  }, [internalId, teamMap])

  const onSave = () => {
    const sourceTeam = internalId ? teamMap[internalId] : undefined

    const team = {
      memberIds: [],
      ...sourceTeam,
      internalId: internalId ?? '',
      label: teamLabel,
      state: teamState
    } satisfies Team

    const tg$ = internalId ? updateTeam$ : createTeam$
    tg$.next(team)

    onClose()
  }

  const onDelete = () => {
    if (!internalId) {
      return
    }

    deleteTeam$.next(internalId)
    onClose()
  }

  useEscapeKey(onClose)

  return (
    <div className="absolute top-0 left-0 flex flex-col items-center justify-center w-full h-full z-10 select-none">
      <div className="absolute top-0 left-0 w-full h-full backdrop-blur-md" />

      <div className="flex flex-col bg-[#000] text-primary p-5 rounded-xl z-10 w-full max-w-2xl max-h-[calc(100vh-50px)] overflow-y-auto">
        <div className="text-2xl font-extrabold">
          {languageData[internalId ? 'manage_teams.edit_team' : 'manage_teams.add_team']}
        </div>

        <label className="mt-5 text-action">{languageData['manage_teams.form.name']}</label>
        <input
          className="bg-background text-action mt-1 p-2 rounded border border-[#000]/50"
          onChange={onTeamLabelChange}
          placeholder={languageData['manage_teams.form.name_placeholder']}
          value={teamLabel}
        />

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
