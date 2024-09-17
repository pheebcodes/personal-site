import { h } from "preact";
import { BasePage } from "./_base-page.tsx";
import * as Divided from "../components/divided.tsx";
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
			<header className="row space-gap">
				<h2>feeds: </h2>

				<Divided.Container className="wrap">
					<Divided.Link href="/feed.rss">rss</Divided.Link>
					<Divided.Link href="/feed.atom">atom</Divided.Link>
					<Divided.Link href="/feed.json">json</Divided.Link>
				</Divided.Container>
			</header>

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

			{next !== null || prev !== null ? (
				<Pagination
					currentPage={cur}
					previousLink={prev ? `/blog/toc/${prev}` : null}
					nextLink={next ? `/blog/toc/${next}` : null}
				/>
			) : null}
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
