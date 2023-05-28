import { h } from "../html.js";
import * as Divided from "./divided.jsx";

function NoLink({ children, ...attrs }) {
	return (
		<Divided.LinkWrapper {...attrs} className="no-link">
			{children}
		</Divided.LinkWrapper>
	);
}

export function Pagination({ previousLink, currentPage, nextLink }) {
	return (
		<footer className="col">
			<section className="row space-gap">
				<span>page:</span>
				<span>{currentPage}</span>
			</section>
			<Divided.Container>
				{previousLink ? <Divided.Link href={previousLink}>prev</Divided.Link> : <NoLink>prev</NoLink>}
				{previousLink ? <Divided.Link href={nextLink}>next</Divided.Link> : <NoLink>next</NoLink>}
			</Divided.Container>
		</footer>
	);
}
