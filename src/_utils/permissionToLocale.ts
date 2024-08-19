import { StaffPermission } from '../_consts/native'

export const staffPermissionToLocale = (permission: StaffPermission) => {
	switch (permission) {
		case StaffPermission.All:
			return 'Todas as informações'
		case StaffPermission.Shift:
			return 'Relativos ao turno'
		case StaffPermission.Own:
			return 'Próprias ocorrências'
		case StaffPermission.None:
		default:
			return 'Sem acesso'
	}
}