import { h } from "preact";
import { BasePage } from "./_base-page.tsx";
import { Time } from "../components/time.tsx";
import { Pagination } from "../components/pagination.tsx";
import { Content } from "../content.ts";
import { Posts, Post } from "./_posts-store.ts";

interface BlogTocProps {
	posts: Post[];
	prev: number | null;
	cur: number;
	next: number | null;
}
export function BlogToc({ posts, prev, cur, next }: BlogTocProps) {
	return (
		<BasePage title="blog" pageName="blog-toc">
			<ol class="toc">
				{posts.map((post) => (
					<li className="col">
						<span>
							<a href={`/blog/posts/${post.slug}`}>{post.title}</a>
						</span>
						<Time date={post.date} />
					</li>
				))}
			</ol>

			<Pagination
				currentPage={cur}
				previousLink={prev ? `/blog/toc/${prev}` : null}
				nextLink={next ? `/blog/toc/${next}` : null}
			/>
		</BasePage>
	);
}

export async function* pages(content: Content) {
	const posts = await content.store(Posts);
	for (const { items, page, first, last } of posts.pages()) {
		yield {
			path: `blog/toc/${page}.html`,
			element: <BlogToc posts={items} cur={page} prev={first ? null : page - 1} next={last ? null : page + 1} />,
		};
	}
}
