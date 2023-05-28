import { h } from "../html.js";
import * as Divided from "./divided.jsx";

export function LinkInner({ to, label, me, newTab = false, download, children, attrs }) {
	const relList = [];
	if (me) {
		relList.push("me");
	}
	if (newTab) {
		relList.push("noopener", "noreferrer");
	}
	return (
		<Divided.LinkInner
			{...attrs}
			href={to}
			aria-label={label}
			tabindex="0"
			target={newTab ? "_blank" : undefined}
			rel={relList.join(" ") || undefined}
			download={download === true ? "" : download}
		>
			{children}
		</Divided.LinkInner>
	);
}

export const LinkWrapper = Divided.LinkWrapper;

export function Link({ children, ...attrs }) {
	return (
		<LinkWrapper>
			<LinkInner {...attrs}>{children}</LinkInner>
		</LinkWrapper>
	);
}

export function Container({ children }) {
	return (
		<footer>
			<Divided.Container className="wrap">{children}</Divided.Container>
		</footer>
	);
}
