import { h, ComponentChildren } from "preact";
import * as Divided from "./divided.tsx";

interface NoLinkProps {
	children: ComponentChildren;
}
function NoLink({ children }: NoLinkProps) {
	return (
		<Divided.LinkWrapper className="no-link">{children}</Divided.LinkWrapper>
	);
}

interface PaginationProps {
	previousLink: string | null;
	currentPage: string | number;
	nextLink: string | null;
}
export function Pagination({
	previousLink,
	currentPage,
	nextLink,
}: PaginationProps) {
	return (
		<footer className="col">
			<section className="row space-gap">
				<span>page:</span>
				<span>{currentPage}</span>
			</section>
			<Divided.Container>
				{previousLink ? (
					<Divided.Link href={previousLink}>prev</Divided.Link>
				) : (
					<NoLink>prev</NoLink>
				)}
				{nextLink ? (
					<Divided.Link href={nextLink}>next</Divided.Link>
				) : (
					<NoLink>next</NoLink>
				)}
			</Divided.Container>
		</footer>
	);
}
