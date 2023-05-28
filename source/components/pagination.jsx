import { h } from "../html.js";

export function Pagination({ previousLink, currentPage, nextLink }) {
	return (
		<footer className="col">
			<section className="row space-gap">
				<span>page:</span>
				<span>{currentPage}</span>
			</section>
			<nav className="row divide">
				{previousLink ? <a href={previousLink}>prev</a> : <span className="no-link">prev</span>}
				{nextLink ? <a href={nextLink}>next</a> : <span className="no-link">next</span>}
			</nav>
		</footer>
	);
}
