import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import ptPack from './language/pt.json'
import enPack from './language/en.json'

export type LanguagePack = typeof ptPack & typeof enPack

interface LanguageStore {
  language: 'pt' | 'en'
  languageData: LanguagePack
  setLanguage: (language: 'pt' | 'en') => void
}

const isValidState = (state?: unknown): state is LanguageStore => !!state && typeof state === 'object'

export const useLanguageStore = create<LanguageStore>()(
	devtools(
		persist(
			(set) => ({
				language: 'pt',
				languageData: ptPack,
				setLanguage: (language: 'pt' | 'en') => {
					const languageData = language === 'pt' ? ptPack : enPack
					set({ language, languageData })
				}
			}),
			{
				name: 'language',
				merge: (persistedState, currentState) => {
					if (isValidState(persistedState)) {
						const language = persistedState.language ?? currentState.language

						return {
							...currentState,
							...persistedState,
							languageData: language === 'pt' ? ptPack : enPack
						}
					}

					return currentState
				},
				partialize: (state) => ({
					language: state.language
				})
			}
		),
		{ enabled: true, name: 'language' }
	)
)

window.addEventListener('storage', (evt) => {
	if (evt.key === 'language') {
		useLanguageStore.persist.rehydrate()
	}
})
