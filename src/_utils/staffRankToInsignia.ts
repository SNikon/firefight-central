import { StaffRank } from '../_consts/native'
import insignia0 from '../_assets/insignia_00.jpeg'
import insignia1 from '../_assets/insignia_01.jpeg'
import insignia2 from '../_assets/insignia_02.jpeg'
import insignia3 from '../_assets/insignia_03.jpeg'
import insignia4 from '../_assets/insignia_04.jpeg'
import insignia5 from '../_assets/insignia_05.jpeg'
import insignia6 from '../_assets/insignia_06.jpeg'
import insignia7 from '../_assets/insignia_07.jpeg'
import insignia8 from '../_assets/insignia_08.jpeg'

export const staffRankToInsignia = (rank: StaffRank) => {
	switch (rank) {
	case StaffRank.Rank0:
		return insignia0
	case StaffRank.Rank1:
		return insignia1
	case StaffRank.Rank2:
		return insignia2
	case StaffRank.Rank3:
		return insignia3
	case StaffRank.Rank4:
		return insignia4
	case StaffRank.Rank5:
		return insignia5
	case StaffRank.Rank6:
		return insignia6
	case StaffRank.Rank7:
		return insignia7
	case StaffRank.Rank8:
		return insignia8
	case StaffRank.Unknown:
	default:
		return ''
	}
}