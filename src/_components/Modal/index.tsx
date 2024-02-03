import { type FunctionComponent, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

export const Modal: FunctionComponent<PropsWithChildren<Record<string, unknown>>> = ({ children }) =>
	createPortal(children, document.getElementById('root')!)
