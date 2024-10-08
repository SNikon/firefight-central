import { invoke } from '@tauri-apps/api/tauri'
import { BehaviorSubject, ReplaySubject, Subject, distinctUntilChanged, map } from 'rxjs'
import { listen } from '@tauri-apps/api/event'
import { Team, type ActiveOccurrence, type Occurrence, type Staff, type Vehicle } from '../_consts/native'
import { bindBulkUpdater$, bindCreator$, bindDeleter$, bindUpdater$ } from './store.impl'

export type State = {
  activeOccurrences: Record<string, ActiveOccurrence>
  occurrences: Record<string, Occurrence>
  staff: Record<string, Staff>
  teams: Record<string, Team>
  vehicles: Record<string, Vehicle>
}

export const store$ = new ReplaySubject<State>(1)

invoke('get_store')
	.then((state) => {
		store$.next(state as State)
	})
	.catch((err) => {
		console.error('Failed to load state', err)
	})

listen('firefight://state_updated', ({ payload }) => {
	console.trace('Updating state', { payload })
	store$.next(payload as State)
})

export const updatingState$ = new BehaviorSubject<boolean>(false)

export const createActiveOccurrence$ = new Subject<ActiveOccurrence>()
export const activeOccurrenceCreated$ = new Subject<string>()
bindCreator$(createActiveOccurrence$, updatingState$, 'create_active_occurrence', 'activeOccurrence')
export const createOccurrence$ = new Subject<Occurrence>()
export const occurrenceCreated$ = new Subject<string>()
bindCreator$(createOccurrence$, updatingState$, 'create_occurrence', 'occurrence')
export const createStaff$ = new Subject<Staff>()
export const staffCreated$ = new Subject<string>()
bindCreator$(createStaff$, updatingState$, 'create_staff', 'staff')
export const createTeam$ = new Subject<Team>()
export const teamCreated$ = new Subject<string>()
bindCreator$(createTeam$, updatingState$, 'create_team', 'team')
export const createVehicle$ = new Subject<Vehicle>()
export const vehicleCreated$ = new Subject<string>()
bindCreator$(createVehicle$, updatingState$, 'create_vehicle', 'vehicle')

export const updateActiveOccurrence$ = new Subject<ActiveOccurrence>()
bindUpdater$(updateActiveOccurrence$, updatingState$, 'update_active_occurrence', 'activeOccurrence')
export const updateOccurrence$ = new Subject<Occurrence>()
bindUpdater$(updateOccurrence$, updatingState$, 'update_occurrence', 'occurrence')
export const updateStaff$ = new Subject<Staff>()
bindUpdater$(updateStaff$, updatingState$, 'update_staff', 'staff')
export const updateTeam$ = new Subject<Team>()
bindUpdater$(updateTeam$, updatingState$, 'update_team', 'team')
export const updateVehicle$ = new Subject<Vehicle>()
bindUpdater$(updateVehicle$, updatingState$, 'update_vehicle', 'vehicle')

export const updateShift$ = new Subject<string[]>()
bindBulkUpdater$(updateShift$, updatingState$, 'set_staff_shift', 'availableStaff')

export const deleteActiveOccurrence$ = new Subject<string>()
bindDeleter$(deleteActiveOccurrence$, updatingState$, 'delete_active_occurrence', 'activeOccurrenceId')
export const deleteOccurrence$ = new Subject<string>()
bindDeleter$(deleteOccurrence$, updatingState$, 'delete_occurrence', 'occurrenceId')
export const deleteStaff$ = new Subject<string>()
bindDeleter$(deleteStaff$, updatingState$, 'delete_staff', 'staffId')
export const deleteTeam$ = new Subject<string>()
bindDeleter$(deleteTeam$, updatingState$, 'delete_team', 'teamId')
export const deleteVehicle$ = new Subject<string>()
bindDeleter$(deleteVehicle$, updatingState$, 'delete_vehicle', 'vehicleId')

export const activeOccurrences$ = store$.pipe(
	map((state) => state.activeOccurrences),
	distinctUntilChanged()
)
export const occurrences$ = store$.pipe(
	map((state) => state.occurrences),
	distinctUntilChanged()
)
export const staff$ = store$.pipe(
	map((state) => state.staff),
	distinctUntilChanged()
)
export const teams$ = store$.pipe(
	map((state) => state.teams),
	distinctUntilChanged()
)
export const vehicles$ = store$.pipe(
	map((state) => state.vehicles),
	distinctUntilChanged()
)
