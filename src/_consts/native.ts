
export type ActiveOccurrence = {
	internalId: string;
	occurrenceId: string;
	vehicleIds: string[];
	staffIds: string[];
}

export type Occurrence = {
	internalId: string;
	image: string;
	name: string;
}

export enum VehicleState {
	Available = 'available',
	Unavailable = 'unavailable',
	Dispatched = 'dispatched'
}

export type Vehicle = {
	internalId: string;
	image: string;
	label: string;
	state: VehicleState;
}

export enum StaffState {
	Available = 'available',
	Unavailable = 'unavailable',
	Dispatched = 'dispatched'
}

export type Staff = {
	internalId: string;
	image: string;
	label: string;
	name: string;
	state: StaffState;
}
