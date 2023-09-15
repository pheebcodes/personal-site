import { h } from "preact";
import { BasePage } from "./_base-page.tsx";
import { Date } from "../components/date.tsx";
import { Pagination } from "../components/pagination.tsx";
import * as Divided from "../components/divided.tsx";
import { Content } from "../content.ts";
import { Blog, Category, Post } from "./_blog-store.ts";

interface BlogTocProps {
	categories: Category[];
	posts: Post[];
	prev: number | null;
	cur: number;
	next: number | null;
}
export function BlogToc({ categories, posts, prev, cur, next }: BlogTocProps) {
	return (
		<BasePage title="blog" pageName="blog-toc">
			<header className="row space-gap">
				<h2>categories: </h2>

				<Divided.Container className="wrap">
					{categories.map((category) => (
						<Divided.Link href={`/blog/categories/${category.id}`}>{category.label}</Divided.Link>
					))}
				</Divided.Container>
			</header>

			<ol class="toc">
				{posts.map((post) => (
					<li className="col">
						<span>
							[{post.category.label}] <a href={`/blog/posts/${post.slug}`}>{post.title}</a>
						</span>
						<Date date={post.date} />
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
	const blog = await content.store(Blog);
	const categories = Array.from(blog.categories()).filter((category) => {
		// check if there's at least one post for the category
		const it = blog.postsForCategory(category)[Symbol.iterator]();
		return !!it.next().value;
	});
	for (const { items, page, first, last } of Blog.paginate(blog.posts())) {
		yield {
			path: `blog/toc/${page}.html`,
			element: (
				<BlogToc
					categories={categories}
					posts={items}
					cur={page}
					prev={first ? null : page - 1}
					next={last ? null : page + 1}
				/>
			),
		};
	}
}
