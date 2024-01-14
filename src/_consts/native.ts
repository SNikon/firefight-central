
export type ActiveOcurrence = {
	id: string
	ocurrenceId: string
	vehicleIds: string[]
	staffIds: string[]
}

export type Ocurrence = {
	id: string
	image: string
	name: string
}

export enum VehicleState {
	Available = 'available',
	Unavailable = 'unavailable',
	Dispatched = 'dispatched'
}

export type Vehicle = {
	id: string
	image: string
	state: VehicleState
}

export enum StaffState {
	Available = 'available',
	Unavailable = 'unavailable',
	Dispatched = 'dispatched'
}

export type Staff = {
	id: string
	image: string
	name: string
	state: StaffState
}