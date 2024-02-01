import { VehicleState } from "../_consts/native"

export const vehicleStateToLocale = (state: VehicleState): string => {
	switch (state) {
		case VehicleState.Available:
			return 'Disponível'
		case VehicleState.Unavailable:
			return 'Inoperacional'
		case VehicleState.Dispatched:
			return 'Em Serviço'
	}
}