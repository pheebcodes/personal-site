import { h, ComponentChildren, JSX } from "preact";
import { cn } from "../utils/cn.ts";

export const LinkInner = "a" as const;
export const LinkWrapper = "span" as const;

interface LinkProps {
	className?: string;
	children: ComponentChildren;
	href: string;
}
export function Link({ children, className, href }: LinkProps) {
	return (
		<LinkWrapper>
			<LinkInner className={className} href={href}>
				{children}
			</LinkInner>
		</LinkWrapper>
	);
}

interface ContainerProps {
	component?: keyof JSX.IntrinsicElements;
	divider?: "single" | "double";
	className?: string;
	children?: ComponentChildren;
}
export function Container({
	component: Component = "nav" as const,
	divider = "single",
	className,
	children,
}: ContainerProps) {
	return (
		<Component
			className={cn(className, "row", {
				divide: divider === "single",
				"double-divide": divider === "double",
			})}
		>
			{children}
		</Component>
	);
}
