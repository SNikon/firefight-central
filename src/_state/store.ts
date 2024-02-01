import { invoke } from "@tauri-apps/api/tauri";
import { BehaviorSubject, ReplaySubject, Subject, distinctUntilChanged, map } from "rxjs";
import { ActiveOccurrence, Occurrence, Staff, Vehicle } from "../_consts/native";
import { bindCreator$, bindDeleter$, bindStateUpdatingCreator$, bindUpdater$ } from "./store.impl";

export type State = {
	activeOccurrences: Record<string, ActiveOccurrence>
	occurrences: Record<string, Occurrence>
	vehicles: Record<string, Vehicle>
	staff: Record<string, Staff>
}

export const store$ = new ReplaySubject<State>(1)

invoke('get_store')
	.then(state => { store$.next(state as State) })
	.catch(err => { console.error('Failed to load state', err) })

export const updatingState$ = new BehaviorSubject<boolean>(false)

export const createActiveOccurrence$ = new Subject<ActiveOccurrence>()
export const activeOccurrenceCreated$ = new Subject<string>()
bindStateUpdatingCreator$(createActiveOccurrence$, updatingState$, store$, 'create_active_occurrence', 'occurrence')
export const createOccurrence$ = new Subject<Occurrence>()
export const occurrenceCreated$ = new Subject<string>()
bindCreator$('occurrences', createOccurrence$, store$, updatingState$, occurrenceCreated$, store$, 'create_occurrence', 'occurrence')
export const createVehicle$ = new Subject<Vehicle>()
export const vehicleCreated$ = new Subject<string>()
bindCreator$('vehicles', createVehicle$, store$, updatingState$, vehicleCreated$, store$, 'create_vehicle', 'vehicle')
export const createStaff$ = new Subject<Staff>()
export const staffCreated$ = new Subject<string>()
bindCreator$('staff', createStaff$, store$, updatingState$, staffCreated$, store$, 'create_staff', 'staff')

export const updateActiveOccurrence$ = new Subject<ActiveOccurrence>()
bindUpdater$('activeOccurrences', updateActiveOccurrence$, store$, updatingState$, store$, 'update_active_occurrence', 'occurrence')
export const updateOccurrence$ = new Subject<Occurrence>()
bindUpdater$('occurrences', updateOccurrence$, store$, updatingState$, store$, 'update_occurrence', 'occurrence')
export const updateVehicle$ = new Subject<Vehicle>()
bindUpdater$('vehicles', updateVehicle$, store$, updatingState$, store$, 'update_vehicle', 'vehicle')
export const updateStaff$ = new Subject<Staff>()
bindUpdater$('staff', updateStaff$, store$, updatingState$, store$, 'update_staff', 'staff')

export const deleteActiveOccurrence$ = new Subject<string>()
bindDeleter$('activeOccurrences', deleteActiveOccurrence$, store$, updatingState$, store$, 'delete_active_occurrence', 'activeOccurrenceId')
export const deleteOccurrence$ = new Subject<string>()
bindDeleter$('occurrences', deleteOccurrence$, store$, updatingState$, store$, 'delete_occurrence', 'occurrenceId')
export const deleteVehicle$ = new Subject<string>()
bindDeleter$('vehicles', deleteVehicle$, store$, updatingState$, store$, 'delete_vehicle', 'vehicleId')
export const deleteStaff$ = new Subject<string>()
bindDeleter$('staff', deleteStaff$, store$, updatingState$, store$, 'delete_staff', 'staffId')

export const activeOccurrences$ = store$.pipe(map(state => state.activeOccurrences), distinctUntilChanged())
export const occurrences$ = store$.pipe(map(state => state.occurrences), distinctUntilChanged())
export const vehicles$ = store$.pipe(map(state => state.vehicles), distinctUntilChanged())
export const staff$ = store$.pipe(map(state => state.staff), distinctUntilChanged())
