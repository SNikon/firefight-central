import { StaffState } from '../_consts/native'

export const staffStateToLocale = (state: StaffState): string => {
	switch (state) {
	case StaffState.Available:
		return 'Disponível'
	case StaffState.Dispatched:
		return 'Em Serviço'
	case StaffState.Inactive:
		return 'Inativo'
	case StaffState.SickLeave:
		return 'Baixa Médica'
	case StaffState.Unavailable:
		return 'Fora de Serviço'
	default:
		return ''
	}
}

export const staffStateToShortLocale = (state: StaffState): string => {
	switch (state) {
	case StaffState.Available:
		return 'Disp'
	case StaffState.Dispatched:
		return 'Serviço'
	case StaffState.Inactive:
		return 'Inativo'
	case StaffState.SickLeave:
		return 'Baixa'
	case StaffState.Unavailable:
		return 'F/Serviço'
	default:
		return ''
	}
}
