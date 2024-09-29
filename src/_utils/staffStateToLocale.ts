import { StaffState } from '../_consts/native'
import { LanguagePack } from '../_state/lang'

export const staffStateToLocale = (state: StaffState, languageData: LanguagePack): string => {
	switch (state) {
	case StaffState.Available:
		return languageData['staff_state.available.long']
	case StaffState.Dispatched:
		return languageData['staff_state.dispatched.long']
	case StaffState.Inactive:
		return languageData['staff_state.inactive.long']
	case StaffState.SickLeave:
		return languageData['staff_state.sick_leave.long']
	case StaffState.Unavailable:
		return languageData['staff_state.unavailable.long']
	default:
		return ''
	}
}

export const staffStateToShortLocale = (state: StaffState, languageData: LanguagePack): string => {
	switch (state) {
	case StaffState.Available:
		return languageData['staff_state.available.short']
	case StaffState.Dispatched:
		return languageData['staff_state.dispatched.short']
	case StaffState.Inactive:
		return languageData['staff_state.inactive.short']
	case StaffState.SickLeave:
		return languageData['staff_state.sick_leave.short']
	case StaffState.Unavailable:
		return languageData['staff_state.unavailable.short']
	default:
		return ''
	}
}
