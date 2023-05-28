import { h, cn } from "../html.js";
import * as Divided from "./divided";

export function Link({ className, current, children, ...attr }) {
	return (
		<Divided.Link className={cn(className, { current })} {...attr}>
			{children}
		</Divided.Link>
	);
}

export function Container({ children }) {
	return (
		<Divided.Container element="header" divider="double">
			<h1 className="no-shrink">phoebe</h1>
			<Divided.Container className="wrap">{children}</Divided.Container>
		</Divided.Container>
	);
}
