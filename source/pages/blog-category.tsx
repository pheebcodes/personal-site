import { h } from "preact";
import { BasePage } from "./_base-page.tsx";
import { Time } from "../components/time.tsx";
import { Pagination } from "../components/pagination.tsx";
import { Content } from "../content.ts";
import { Posts, Post } from "./_posts-store.ts";

interface BlogCategoryProps {
	category: string;
	page: number;
	previousLink: string | null;
	nextLink: string | null;
	posts: Post[];
}
export function BlogCategory({ category, posts, page, previousLink, nextLink }: BlogCategoryProps) {
	return (
		<BasePage title={`"${category}" blog`} pageName="blog-toc">
			<h1>"{category}" blog</h1>
			<ol class="toc">
				{posts.map((post) => (
					<li className="col">
						<a href={`/blog/posts/${post.slug}`}>{post.title}</a>
						<Time date={post.date} />
					</li>
				))}
			</ol>
			<Pagination currentPage={page} previousLink={previousLink} nextLink={nextLink} />
		</BasePage>
	);
}

function toPath(tag: string, page: number) {
	return `blog/categories/${tag}/${page}.html`;
}

export async function* pages(content: Content) {
	const posts = await content.store(Posts);
	for (const category of posts.categories()) {
		for (const { items, page, first, last } of posts.pages({ category })) {
			yield {
				path: toPath(category, page),
				element: (
					<BlogCategory
						category={category}
						posts={items}
						page={page}
						previousLink={!first ? toPath(category, page - 1) : null}
						nextLink={!last ? toPath(category, page + 1) : null}
					/>
				),
			};
		}
	}
}
