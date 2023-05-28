import { h, cn } from "../html.js";

export function HeaderLink({ href, children, current }) {
	return (
		<a href={href} className={cn({ current })}>
			{children}
		</a>
	);
}

export function Header({ links }) {
	return (
		<header className="row double-divide">
			<h1>phoebe</h1>
			{links ? <nav className="row divide">{links}</nav> : null}
		</header>
	);
}
