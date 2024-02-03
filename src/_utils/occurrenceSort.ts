import { type Occurrence } from '../_consts/native'

export const occurrenceSortByLabel = (a: Occurrence, b: Occurrence) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
