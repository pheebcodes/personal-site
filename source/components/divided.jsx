import { cn, h } from "../html.js";

export const LinkInner = "a";
export const LinkWrapper = "span";

export function Link({ children, ...attrs }) {
	return (
		<LinkWrapper>
			<LinkInner {...attrs}>{children}</LinkInner>
		</LinkWrapper>
	);
}

export function Container({ component: Component = "nav", divider = "single", className, children, ...attrs }) {
	return h(
		Component,
		{
			...attrs,
			className: cn(className, "row", {
				divide: divider === "single",
				"double-divide": divider === "double",
			}),
		},
		children,
	);
}
