
export type ActiveOccurrence = {
	creationTime?: number
	internalId: string
	occurrenceId: string
	vehicleAssignmentMap: Record<string, string[]>
	vehicleIds: string[]
	staffIds: string[]
}

export type Occurrence = {
	internalId: string
	image: string
	name: string
}

export enum VehicleState {
	Available = 'available',
	Dispatched = 'dispatched',
	Unavailable = 'unavailable'
}

export type Vehicle = {
	internalId: string
	capacity?: number
	image: string
	label: string
	state: VehicleState
}

export enum StaffState {
	Available = 'available',
	Dispatched = 'dispatched',
	Inactive = 'inactive',
	SickLeave = 'sickLeave',
	Unavailable = 'unavailable',
}

export enum StaffRank {
	Unknown = 'unknown',
	Rank0 = 'rank0',
	Rank1 = 'rank1',
	Rank2 = 'rank2',
	Rank3 = 'rank3',
	Rank4 = 'rank4',
	Rank5 = 'rank5',
	Rank6 = 'rank6',
	Rank7 = 'rank7',
	Rank8 = 'rank8'
}

export type Staff = {
	internalId: string
	image: string
	label: string
	name: string
	nationalId: string
	rank: StaffRank
	state: StaffState
}
