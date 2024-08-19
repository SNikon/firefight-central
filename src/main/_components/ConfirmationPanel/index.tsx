import { type FunctionComponent, } from 'react'
import { FullscreenOverlay } from '../../../_components/FullScreenOverlay'
import { useEscapeKey } from '../../../_utils/useEscapeKey'
import { Button } from '../../../_components/Button'

type ConfirmationPanelProps = {
	acceptPrompt: string
	cancelPrompt: string
	onClose: () => void
	onConfirm: () => void
	prompt: string
}

export const ConfirmationPanel: FunctionComponent<ConfirmationPanelProps> = ({ acceptPrompt, cancelPrompt, onClose, onConfirm, prompt }) => {

	useEscapeKey(onClose)

	return (
		<FullscreenOverlay className='flex flex-col justify-center items-center'>
			<div className='absolute top-0 left-0 w-full h-full backdrop-blur-sm' />

			<div className='flex flex-col gap-5 justify-center align-middle bg-[#000] rounded-xl z-10  max-w-7xl max-h-full p-5 pb-10'>
				<div className='text-action overflow-hidden'>
					{prompt}
				</div>


				<div className='flex flex-row justify-center flex-wrap gap-4'>
					<Button onClick={onClose}>{cancelPrompt}</Button>
					<Button onClick={onConfirm}>{acceptPrompt}</Button>
				</div>
			</div>
		</FullscreenOverlay>
	)
}
