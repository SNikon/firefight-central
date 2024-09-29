import { StaffPermission } from '../_consts/native'
import { LanguagePack } from '../_state/lang'

export const staffPermissionToLocale = (permission: StaffPermission, languageData: LanguagePack) => {
	switch (permission) {
	case StaffPermission.All:
		return languageData['access_permissions.all']
	case StaffPermission.Shift:
		return languageData['access_permissions.shift']
	case StaffPermission.Own:
		return languageData['access_permissions.own']
	case StaffPermission.None:
	default:
		return languageData['access_permissions.none']
	}
}
