import { invoke } from "@tauri-apps/api"
import { EMPTY, Observable, Subject, catchError, delayWhen, filter, from, map, switchMap, take, tap, zip } from "rxjs"

export const bindCreator$ = <
	S extends Record<string, Record<string, unknown>>,
	K extends keyof S,
	T extends { internalId: string }
>(
	field: K,
	inCreate$: Subject<T>,
	inState$: Observable<S>,
	outLoading$: Subject<boolean>,
	outCreated$: Subject<string>,
	outState$: Subject<S>,
	remoteCall: string,
	remoteField: string
) => {
	inCreate$
		.pipe(
			delayWhen(() => outLoading$.pipe(filter(is => !is))),
			tap(() => outLoading$.next(true)),
			switchMap(updateData =>
				from(invoke(remoteCall, { [remoteField]: updateData }) as Promise<string>).pipe(
					take(1),
					map(internalId => ({ ...updateData, internalId })),
					catchError(err => {
						console.error(`Failed to create ${remoteField}`, err)
						outLoading$.next(false)
						return EMPTY
					}))),
			switchMap(completeData =>
				inState$.pipe(
					take(1),
					map((prevState): S => ({
						...prevState, [field]: {
							...prevState[field],
							[completeData.internalId]: completeData
						}
					})),
					tap(() => outCreated$.next(completeData.internalId)))),
			tap(() => outLoading$.next(false)))
		.subscribe(outState$)
}

export const bindStateUpdatingCreator$ = <
	S extends Record<string, Record<string, unknown>>,
	T extends { internalId: string }
>(
	inCreate$: Subject<T>,
	outLoading$: Subject<boolean>,
	outState$: Subject<S>,
	remoteCall: string,
	remoteField: string
) => {
	inCreate$
		.pipe(
			delayWhen(() => outLoading$.pipe(filter(is => !is))),
			tap(() => outLoading$.next(true)),
			switchMap(updateData =>
				from(invoke(remoteCall, { [remoteField]: updateData }) as Promise<S>).pipe(
					take(1),
					catchError(err => {
						console.error(`Failed to create ${remoteField}`, err)
						outLoading$.next(false)
						return EMPTY
					}))),
			tap(() => outLoading$.next(false)))
		.subscribe(outState$)
}

export const bindUpdater$ = <
	S extends Record<string, Record<string, unknown>>,
	K extends keyof S,
	T extends { internalId: string },
>(
	field: K,
	inUpdate$: Subject<T>,
	inState$: Observable<S>,
	outLoading$: Subject<boolean>,
	outState$: Subject<S>,
	remoteCall: string,
	remoteField: string
) => {
	inUpdate$
		.pipe(
			delayWhen(() => outLoading$.pipe(filter(is => !is))),
			tap(() => outLoading$.next(true)),
			switchMap(updateData => {
				const localUpdate$ = inState$.pipe(
					take(1),
					map((prevState): S => ({
						...prevState, [field]: {
							...prevState[field],
							[updateData.internalId]: updateData
						}
					})))

				debugger
				const remoteUpdate = (invoke(remoteCall, { [remoteField]: updateData }) as Promise<void>)
					.catch(err => {	console.error(`Failed to update ${remoteField}`, err) })

				return zip(localUpdate$, from(remoteUpdate)).pipe(
					take(1),
					map(([localUpdate]) => localUpdate))
			}),
			tap(() => outLoading$.next(false)))
		.subscribe(outState$)
}

export const bindDeleter$ = <
	S extends Record<string, Record<string, unknown>>,
	K extends keyof S,
>(
	field: K,
	inDelete$: Subject<string>,
	inState$: Observable<S>,
	outLoading$: Subject<boolean>,
	outState$: Subject<S>,
	remoteCall: string,
	remoteField: string
) => {
	inDelete$
		.pipe(
			delayWhen(() => outLoading$.pipe(filter(is => !is))),
			tap(() => outLoading$.next(true)),
			switchMap(internalId => {
				const localDelete = inState$.pipe(
					take(1),
					map((prevState): S => {
						const nextState = { ...prevState }
						const { [internalId]: _, ...nextField } = nextState[field]
						nextState[field] = nextField as S[K]
						
						return nextState
					}))

				const remoteDelete = (invoke(remoteCall, { [remoteField]: internalId }) as Promise<void>)
					.catch(err => {	console.error(`Failed to delete ${remoteField}`, err) })

				return zip(localDelete, from(remoteDelete)).pipe(
					take(1),
					map(([localUpdate]) => localUpdate))
			}),
			tap(() => outLoading$.next(false)))
		.subscribe(outState$)
}
