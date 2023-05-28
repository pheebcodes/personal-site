import { h } from "../html.js";
import { BasePage } from "./_base.jsx";
import { Date } from "../components/date.jsx";
import { Pagination } from "../components/pagination.jsx";

export function BlogTag({ tag, posts, cur, prev, next }) {
	return (
		<BasePage title={`phoebe - blog posts tagged "${tag}"`} pageName="blog-toc">
			<h1>posts tagged "{tag}"</h1>
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
