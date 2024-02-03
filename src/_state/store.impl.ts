import { invoke } from '@tauri-apps/api'
import { type Subject, catchError, delayWhen, filter, from, of, switchMap, take, tap } from 'rxjs'

export const bindCreator$ = <T>(
	inCreate$: Subject<T>,
	outLoading$: Subject<boolean>,
	remoteCall: string,
	remoteField: string
) => {
	inCreate$
		.pipe(
			delayWhen(() => outLoading$.pipe(filter(is => !is))),
			tap(() => {
				outLoading$.next(true)
			}),
			switchMap(updateData =>
				from(invoke(remoteCall, { [remoteField]: updateData })).pipe(
					take(1),
					catchError(err => {
						console.error(`Failed to create ${remoteField}`, err)
						outLoading$.next(false)
						return of(null)
					}))))
		.subscribe(() => {
			outLoading$.next(false)
		})
}

export const bindUpdater$ = <T extends { internalId: string }>(
	inUpdate$: Subject<T>,
	outLoading$: Subject<boolean>,
	remoteCall: string,
	remoteField: string
) => {
	inUpdate$
		.pipe(
			delayWhen(() => outLoading$.pipe(filter(is => !is))),
			tap(() => {
				outLoading$.next(true)
			}),
			switchMap(updateData =>
				from(invoke(remoteCall, { [remoteField]: updateData })).pipe(
					take(1),
					catchError(err => {
						console.error(`Failed to update ${remoteField}`, err)
						outLoading$.next(false)
						return of(null)
					}))))
		.subscribe(() => {
			outLoading$.next(false)
		})
}

export const bindDeleter$ = (
	inDelete$: Subject<string>,
	outLoading$: Subject<boolean>,
	remoteCall: string,
	remoteField: string
) => {
	inDelete$
		.pipe(
			delayWhen(() => outLoading$.pipe(filter(is => !is))),
			tap(() => {
				outLoading$.next(true)
			}),
			switchMap(updateData =>
				from(invoke(remoteCall, { [remoteField]: updateData })).pipe(
					take(1),
					catchError(err => {
						console.error(`Failed to delete ${remoteField}`, err)
						outLoading$.next(false)
						return of(null)
					}))))
		.subscribe(() => {
			outLoading$.next(false)
		})
}
