import { h, ComponentChildren } from "preact";
import * as Divided from "./divided.tsx";

interface LinkInnerProps {
	to: string;
	label: string;
	me?: boolean;
	newTab?: boolean;
	download?: boolean;
	children: ComponentChildren;
}
export function LinkInner({ to, label, me = false, newTab = false, download = false, children }: LinkInnerProps) {
	const relList = [];
	if (me) {
		relList.push("me");
	}
	if (newTab) {
		relList.push("noopener", "noreferrer");
	}
	return (
		<Divided.LinkInner
			href={to}
			aria-label={label}
			tabIndex={0}
			target={newTab ? "_blank" : undefined}
			rel={relList.join(" ") || undefined}
			download={download === true ? "" : download}
		>
			{children}
		</Divided.LinkInner>
	);
}

export const LinkWrapper = Divided.LinkWrapper;

type LinkProps = LinkInnerProps;
export function Link({ children, ...attrs }: LinkProps) {
	return (
		<LinkWrapper>
			<LinkInner {...attrs}>{children}</LinkInner>
		</LinkWrapper>
	);
}

interface ContainerProps {
	children: ComponentChildren;
}
export function Container({ children }: ContainerProps) {
	return (
		<footer>
			<Divided.Container className="wrap">{children}</Divided.Container>
		</footer>
	);
}
