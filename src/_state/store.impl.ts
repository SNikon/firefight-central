import { invoke } from "@tauri-apps/api"
import { EMPTY, Observable, Subject, catchError, delayWhen, from, map, switchMap, tap, zip } from "rxjs"

export const bindCreator$ = <
	S extends Record<string, Record<string, unknown>>,
	K extends keyof S,
	T extends { id: string }
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
			delayWhen(() => outLoading$),
			tap(() => outLoading$.next(true)),
			switchMap(updateData =>
				from(invoke(remoteCall, { [remoteField]: updateData }) as Promise<string>).pipe(
					map(id => ({ ...updateData, id })),
					catchError(err => {
						console.error(`Failed to create ${remoteField}`, err)
						outLoading$.next(false)
						return EMPTY
					}))),
			switchMap(completeData =>
				inState$.pipe(
					map((prevState): S => ({
						...prevState, [field]: {
							...prevState[field],
							[completeData.id]: completeData
						}
					})),
					tap(() => outCreated$.next(completeData.id)))),
			tap(() => outLoading$.next(false)))
		.subscribe(outState$)
}

export const bindUpdater$ = <
	S extends Record<string, Record<string, unknown>>,
	K extends keyof S,
	T extends { id: string },
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
			delayWhen(() => outLoading$),
			tap(() => outLoading$.next(true)),
			switchMap(updateData => {
				const localUpdate$ = inState$.pipe(
					map((prevState): S => ({
						...prevState, [field]: {
							...prevState[field],
							[updateData.id]: updateData
						}
					})))

				const remoteUpdate = (invoke(remoteCall, { [remoteField]: updateData }) as Promise<void>)
					.catch(err => {	console.error(`Failed to update ${remoteField}`, err) })

				return zip(localUpdate$, from(remoteUpdate))
					.pipe(map(([localUpdate]) => localUpdate))
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
			delayWhen(() => outLoading$),
			tap(() => outLoading$.next(true)),
			switchMap(id => {
				const localDelete = inState$.pipe(
					map((prevState): S => {
						const nextState = { ...prevState }
						const { [id]: _, ...nextField } = nextState[field]
						nextState[field] = nextField as S[K]
						
						return nextState
					}))

				const remoteDelete = (invoke(remoteCall, { [remoteField]: id }) as Promise<void>)
					.catch(err => {	console.error(`Failed to delete ${remoteField}`, err) })

				return zip(localDelete, from(remoteDelete))
					.pipe(map(([localUpdate]) => localUpdate))
			}),
			tap(() => outLoading$.next(false)))
		.subscribe(outState$)
}
