import { h, ComponentChildren } from "preact";
import { cn } from "../utils/cn.ts";
import * as Divided from "./divided.tsx";

interface LinkProps {
	className?: string;
	current?: boolean;
	children: ComponentChildren;
	href: string;
}
export function Link({
	className,
	current = false,
	children,
	href,
}: LinkProps) {
	return (
		<Divided.Link className={cn(className, { current })} href={href}>
			{children}
		</Divided.Link>
	);
}

interface ContainerProps {
	children: ComponentChildren;
}
export function Container({ children }: ContainerProps) {
	return (
		<Divided.Container component="header" divider="double">
			<h1 className="no-shrink">phoebe</h1>
			<Divided.Container className="wrap">{children}</Divided.Container>
		</Divided.Container>
	);
}
