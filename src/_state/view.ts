import { invoke } from '@tauri-apps/api'
import { Subject, distinctUntilChanged, merge, of } from 'rxjs'

export enum View {
    Management,
    ManageStaff,
    ManageTeams,
    ManageVehicles,
    Overview
}

export const changeView$ = new Subject<View>()
export const activeView$ = merge(of(View.Overview), changeView$).pipe(distinctUntilChanged())

type WindowAnchor = {
    left: number
    top: number
}

export const openSettings$ = new Subject<WindowAnchor>()
openSettings$.subscribe((pos) => {
	invoke('open_settings', pos).catch(console.error)
})
