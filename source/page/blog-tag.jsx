import { h } from "../html.js";
import { BasePage } from "./_base.jsx";

export function BlogTag({ tag, posts }) {
	return (
		<BasePage title="phoebe" pageName="blog-toc">
			<h1>posts tagged "{tag}"</h1>
			<ol class="toc">
				{posts.map((post) => (
					<li>
						<a href="/blog/posts/{post.slug}">{post.title}</a> <span>{post.date}</span>
					</li>
				))}
			</ol>
		</BasePage>
	);
}
