import { h } from "../html.js";
import { BasePage } from "./_base.jsx";
import { Date } from "../components/date.jsx";

export function BlogPost({ title, date, body, tags }) {
	return (
		<BasePage title={`phoebe - ${title}`} pageName="blog-post">
			<header className="column">
				<h1>{title}</h1>
				<Date>{date}</Date>
				<section className="row space-gap">
					<span>tags:</span>
					<nav className="row divide wrap">
						{Array.from(tags).map((tag) => (
							<a class="tag" href={`/blog/tags/${tag}`}>
								{tag}
							</a>
						))}
					</nav>
				</section>
			</header>
			<section className="col margin-gap" dangerouslySetInnerHTML={{ __html: body }} />
		</BasePage>
	);
}
