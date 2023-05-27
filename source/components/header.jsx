import { h, cn } from "../html.js";

export function HeaderLink({ href, children, current }) {
	return (
		<a href={href} className={cn({ "current-page": current })}>
			{children}
		</a>
	);
}

export function Header({ links }) {
	return (
		<header className="top">
			<h1>phoebe</h1>
			{links ? <nav>{links}</nav> : null}
		</header>
	);
}
