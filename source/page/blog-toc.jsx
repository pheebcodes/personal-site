import { h } from "../html.js";
import { BasePage } from "./_base.jsx";
import { Date } from "../components/date.jsx";
import { Pagination } from "../components/pagination.jsx";

export function BlogToc({ tags, posts, prev, cur, next }) {
	return (
		<BasePage title="phoebe" pageName="blog-toc">
			<header className="row space-gap">
				<h2>tags: </h2>
				<nav className="row divide wrap">
					{Array.from(tags).map((tag) => (
						<a href={`/blog/tags/${tag}`}>{tag}</a>
					))}
				</nav>
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
