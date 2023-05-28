import { h } from "../html.js";

export function FooterLink({ to, label, me, newTab = false, download, children }) {
	const relList = [];
	if (me) {
		relList.push("me");
	}
	if (newTab) {
		relList.push("noopener", "noreferrer");
	}
	return (
		<a
			href={to}
			aria-label={label}
			tabindex="0"
			target={newTab ? "_blank" : undefined}
			rel={relList.join(" ") || undefined}
			download={download === true ? "" : download}
		>
			{children}
		</a>
	);
}

export function Footer({ links }) {
	return (
		<footer>
			<nav className="row divide wrap">{links}</nav>
		</footer>
	);
}
