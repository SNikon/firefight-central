import { Subject, distinctUntilChanged, merge, of } from "rxjs";

export enum View {
	Alert,
	ManageOcurrences,
	ManageVehicles,
	Overview
}

export const changeView$ = new Subject<View>()
export const activeView$ = merge(of(View.Overview), changeView$)
	.pipe(distinctUntilChanged())