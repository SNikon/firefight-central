import { StaffRank } from '../_consts/native'
import { LanguagePack } from '../_state/lang'

export const staffRankToLocale = (rank: StaffRank, languageData: LanguagePack) => {
	switch (rank) {
	case StaffRank.Rank0:
		return languageData['staff_rank.rank0']
	case StaffRank.Rank1:
		return languageData['staff_rank.rank1']
	case StaffRank.Rank2:
		return languageData['staff_rank.rank2']
	case StaffRank.Rank3:
		return languageData['staff_rank.rank3']
	case StaffRank.Rank4:
		return languageData['staff_rank.rank4']
	case StaffRank.Rank5:
		return languageData['staff_rank.rank5']
	case StaffRank.Rank6:
		return languageData['staff_rank.rank6']
	case StaffRank.Rank7:
		return languageData['staff_rank.rank7']
	case StaffRank.Rank8:
		return languageData['staff_rank.rank8']
	case StaffRank.Unknown:
	default:
		return languageData['terms.not_defined']
	}
}
