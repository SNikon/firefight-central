import { TeamState } from '../_consts/native'

export const teamStateToLocale = (state: TeamState): string => {
	switch (state) {
	case TeamState.Available:
		return 'Disponível'
	case TeamState.Dispatched:
		return 'Em Serviço'
	case TeamState.Unavailable:
		return 'Inop'
	default:
		return ''
	}
}