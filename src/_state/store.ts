import { invoke } from "@tauri-apps/api/tauri";
import { BehaviorSubject, ReplaySubject, Subject } from "rxjs";
import { ActiveOcurrence, Ocurrence, Staff, Vehicle } from "../_consts/native";
import { bindCreator$, bindDeleter$, bindUpdater$ } from "./store.impl";

export type State = {
	active_ocurrences: Record<string, ActiveOcurrence>
	ocurrences: Record<string, Ocurrence>
	vehicles: Record<string, Vehicle>
	staff: Record<string, Staff>
}

export const store$ = new ReplaySubject<State>(1)

invoke('get_state')
	.then(state => { store$.next(state as State) })
	.catch(err => { console.error('Failed to load state', err) })

export const updatingState$ = new BehaviorSubject<boolean>(false)

export const createActiveOcurrence$ = new Subject<ActiveOcurrence>()
export const activeOcurrenceCreated$ = new Subject<string>()
bindCreator$('active_ocurrences', createActiveOcurrence$, store$, updatingState$, activeOcurrenceCreated$, store$, 'create_active_ocurrence', 'occurrence')
export const createOcurrence$ = new Subject<Ocurrence>()
export const ocurrenceCreated$ = new Subject<string>()
bindCreator$('ocurrences', createOcurrence$, store$, updatingState$, ocurrenceCreated$, store$, 'create_ocurrence', 'occurrence')
export const createVehicle$ = new Subject<Vehicle>()
export const vehicleCreated$ = new Subject<string>()
bindCreator$('vehicles', createVehicle$, store$, updatingState$, vehicleCreated$, store$, 'create_vehicle', 'vehicle')
export const createStaff$ = new Subject<Staff>()
export const staffCreated$ = new Subject<string>()
bindCreator$('staff', createStaff$, store$, updatingState$, staffCreated$, store$, 'create_staff', 'staff')

export const updateActiveOcurrence$ = new Subject<ActiveOcurrence>()
bindUpdater$('active_ocurrences', updateActiveOcurrence$, store$, updatingState$, store$, 'update_active_ocurrence', 'occurrence')
export const updateOcurrence$ = new Subject<Ocurrence>()
bindUpdater$('ocurrences', updateOcurrence$, store$, updatingState$, store$, 'update_ocurrence', 'occurrence')
export const updateVehicle$ = new Subject<Vehicle>()
bindUpdater$('vehicles', updateVehicle$, store$, updatingState$, store$, 'update_vehicle', 'vehicle')
export const updateStaff$ = new Subject<Staff>()
bindUpdater$('staff', updateStaff$, store$, updatingState$, store$, 'update_staff', 'staff')

export const deleteActiveOcurrence$ = new Subject<string>()
bindDeleter$('active_ocurrences', deleteActiveOcurrence$, store$, updatingState$, store$, 'delete_active_ocurrence', 'occurrence')
export const deleteOcurrence$ = new Subject<string>()
bindDeleter$('ocurrences', deleteOcurrence$, store$, updatingState$, store$, 'delete_ocurrence', 'occurrence')
export const deleteVehicle$ = new Subject<string>()
bindDeleter$('vehicles', deleteVehicle$, store$, updatingState$, store$, 'delete_vehicle', 'vehicle')
export const deleteStaff$ = new Subject<string>()
bindDeleter$('staff', deleteStaff$, store$, updatingState$, store$, 'delete_staff', 'staff')
