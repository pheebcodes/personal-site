import { h } from "../html.js";
import { BasePage } from "./_base.jsx";
import { Date } from "../components/date.jsx";
import { Pagination } from "../components/pagination.jsx";
import * as Divided from "../components/divided.jsx";

export function BlogToc({ tags, posts, prev, cur, next }) {
	return (
		<BasePage title="blog" pageName="blog-toc">
			<header className="row space-gap">
				<h2>tags: </h2>

				<Divided.Container className="wrap">
					{Array.from(tags).map((tag) => (
						<Divided.Link href={`/blog/tags/${tag}`}>{tag}</Divided.Link>
					))}
				</Divided.Container>
			</header>

			<ol class="toc">
				{posts.map((post) => (
					<li className="col">
						<a href={`/blog/posts/${post.slug}`}>{post.title}</a>
						<Date>{post.date}</Date>
					</li>
				))}
			</ol>

			<Pagination currentPage={cur} previousLink={prev && `/blog/toc/${prev}`} nextLink={next && `/blog/toc/${next}`} />
		</BasePage>
	);
}
