import { VehicleState } from '../_consts/native'

export const vehicleStateToLocale = (state: VehicleState): string => {
	switch (state) {
	case VehicleState.Available:
		return 'Disponível'
	case VehicleState.Dispatched:
		return 'Em Serviço'
	case VehicleState.Unavailable:
		return 'Inop'
	default:
		return ''
	}
}

export const vehicleStateToShortLocale = (state: VehicleState): string => {
	switch (state) {
	case VehicleState.Available:
		return 'Disp'
	case VehicleState.Dispatched:
		return 'Serviço'
	case VehicleState.Unavailable:
		return 'Inop'
	default:
		return ''
	}
}
