import { h } from "../html.js";
import { BasePage } from "./_base.jsx";

export function BlogPost({ title, date, body, tags }) {
	return (
		<BasePage title="phoebe" pageName="blog-post">
			<section class="title">
				<h1>{title}</h1>
				<time>{date}</time>

				<p>
					tags
					{Array.from(tags).map((tag) => (
						<a class="tag" href="/blog/tags/{tag}">
							{tag}
						</a>
					))}
				</p>
			</section>
			<section dangerouslySetInnerHTML={{ __html: body }} />
		</BasePage>
	);
}
