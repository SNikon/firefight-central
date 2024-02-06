import { StaffRank } from '../_consts/native'

export const staffRankToLocale = (rank: StaffRank) => {
	switch (rank) {
	case StaffRank.Rank0:
		return 'Comandante'
	case StaffRank.Rank1:
		return 'Segundo comandante'
	case StaffRank.Rank2:
		return 'Adjunto de Comando'
	case StaffRank.Rank3:
		return 'Chefe'
	case StaffRank.Rank4:
		return 'Subchefe'
	case StaffRank.Rank5:
		return 'Bombeiro 1º'
	case StaffRank.Rank6:
		return 'Bombeiro 2º'
	case StaffRank.Rank7:
		return 'Bombeiro 3º'
	case StaffRank.Rank8:
		return 'Estagiário'
	case StaffRank.Unknown:
	default:
		return 'Nao definido'
	}

}