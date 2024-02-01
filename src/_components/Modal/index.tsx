import { FunctionComponent, PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export const Modal: FunctionComponent<PropsWithChildren<{}>> = ({ children }) =>
	createPortal(children, document.getElementById('root')!)
