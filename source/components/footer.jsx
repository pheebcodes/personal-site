import { h } from "../html.js";

export function FooterLink({ to, label, me, newTab = false, children }) {
	const relList = [];
	if (me) {
		relList.push("me");
	}
	if (newTab) {
		relList.push("noopener", "noreferrer");
	}
	return (
		<a href={to} aria-label={label} tabindex="0" target={newTab ? "_blank" : "_self"} rel={relList.join(" ")}>
			{children}
		</a>
	);
}

export function Footer({ links }) {
	return (
		<footer>
			<nav class="links">{links}</nav>
		</footer>
	);
}
