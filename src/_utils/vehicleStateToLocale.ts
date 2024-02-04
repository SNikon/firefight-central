import { VehicleState } from '../_consts/native'

export const vehicleStateToLocale = (state: VehicleState): string => {
	switch (state) {
	case VehicleState.Available:
		return 'Disponível'
	case VehicleState.Unavailable:
		return 'Inoperacional'
	case VehicleState.Dispatched:
		return 'Em Serviço'
	default:
		return ''
	}
}

export const vehicleStateToShortLocale = (state: VehicleState): string => {
	switch (state) {
	case VehicleState.Available:
		return 'Disp'
	case VehicleState.Unavailable:
		return 'Inop'
	case VehicleState.Dispatched:
		return 'Serviço'
	default:
		return ''
	}
}
