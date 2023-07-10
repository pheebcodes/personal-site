import { formatISO } from "date-fns";
import { h, Fragment } from "../html.js";
import { BasePage } from "./_base.jsx";
import { Date } from "../components/date.jsx";
import * as Divided from "../components/divided.jsx";

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

					<Divided.Container className="wrap">
						{Array.from(tags).map((tag) => (
							<Divided.Link href={`/blog/tags/${tag}`}>{tag}</Divided.Link>
						))}
					</Divided.Container>
				</section>
			</header>
			<section className="col margin-gap markdown" dangerouslySetInnerHTML={{ __html: body }} />
		</BasePage>
	);
}
