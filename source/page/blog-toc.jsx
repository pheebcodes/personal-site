import { h } from "../html.js";
import { BasePage } from "./_base.jsx";

export function BlogToc({ tags, posts, prev, cur, next }) {
	const prevNavigation = prev !== null ? <a href="/blog/toc/{prev}">prev</a> : <span class="no-link">prev</span>;
	const nextNavigation = next !== null ? <a href="/blog/toc/{next}">next</a> : <span class="no-link">next</span>;

	return (
		<BasePage title="phoebe" pageName="blog-toc">
			<header>
				<h2>tags: </h2>
				<nav>
					{Array.from(tags).map((tag) => (
						<a href="/blog/tag/{tag}">{tag}</a>
					))}
				</nav>
			</header>

			<ol class="toc">
				{posts.map((post) => (
					<li>
						<a href="/blog/posts/{post.slug}">{post.title}</a>
						<span>{post.date}</span>
					</li>
				))}
			</ol>

			<footer class="pagination">
				<span>page: {cur}</span>
				<nav>
					{prevNavigation} {nextNavigation}
				</nav>
			</footer>
		</BasePage>
	);
}
