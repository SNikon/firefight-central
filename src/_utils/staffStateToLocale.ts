import { StaffState } from '../_consts/native'

export const staffStateToLocale = (state: StaffState): string => {
	switch (state) {
		case StaffState.Available:
			return 'Disponível'
		case StaffState.Unavailable:
			return 'Indisponível'
		case StaffState.Dispatched:
			return 'Em Serviço'
		default:
			return ''
	}
}
