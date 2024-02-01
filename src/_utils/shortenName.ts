export const shortenName = (name: string): string => {
	const names = name.split(/\s+/)
	if (names.length === 1) { return name }

	const fName = names[0]
	const lName = names[names.length - 1] ?? ''

	return `${fName[0]} ${lName}`
}