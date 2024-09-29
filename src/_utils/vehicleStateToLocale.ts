import { VehicleState } from '../_consts/native'
import { LanguagePack } from '../_state/lang'

export const vehicleStateToLocale = (state: VehicleState, languageData: LanguagePack): string => {
	switch (state) {
	case VehicleState.Available:
		return languageData['vehicle_state.available.long']
	case VehicleState.Dispatched:
		return languageData['vehicle_state.dispatched.long']
	case VehicleState.Unavailable:
		return languageData['vehicle_state.unavailable.long']
	default:
		return ''
	}
}

export const vehicleStateToShortLocale = (state: VehicleState, languageData: LanguagePack): string => {
	switch (state) {
	case VehicleState.Available:
		return languageData['vehicle_state.available.short']
	case VehicleState.Dispatched:
		return languageData['vehicle_state.dispatched.short']
	case VehicleState.Unavailable:
		return languageData['vehicle_state.unavailable.short']
	default:
		return ''
	}
}
