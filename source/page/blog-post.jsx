import { formatISO } from "date-fns";
import { h } from "../html.js";
import { BasePage } from "./_base.jsx";
import { Date } from "../components/date.jsx";

function Meta({ title, date }) {
	return (
		<>
			<meta property="og:type" content="article" />
			<meta property="og:title" content={`${title} - phoebe codes`} />
			<meta property="og:article:published_time" content={formatISO(date, { representation: "date" })} />
		</>
	);
}

export function BlogPost({ title, date, body, tags }) {
	return (
		<BasePage title={title} pageName="blog-post" head={<Meta title={title} date={date} />}>
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
