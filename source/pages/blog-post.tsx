import { formatISO } from "date-fns";
import { h, Fragment } from "preact";
import { BasePage } from "./_base-page.tsx";
import { Date } from "../components/date.tsx";
import * as Divided from "../components/divided.tsx";
import { Content } from "../content.ts";
import { Blog, Category } from "./_blog-store.ts";

interface MetaProps {
	title: string;
	date: Date;
}
function Meta({ title, date }: MetaProps) {
	return (
		<>
			<meta property="og:type" content="article" />
			<meta property="og:title" content={`${title} - phoebe codes`} />
			<meta property="og:article:published_time" content={formatISO(date, { representation: "date" })} />
		</>
	);
}

interface BlogPostProps {
	title: string;
	category: Category;
	date: Date;
	body: string;
}
export function BlogPost({ title, category, date, body }: BlogPostProps) {
	return (
		<BasePage title={title} pageName="blog-post" head={<Meta title={title} date={date} />}>
			<header className="column">
				<h1>{title}</h1>
				<Date date={date} />
				<section className="row space-gap">
					<span>
						category: <a href={`/blog/categories/${category.id}`}>{category.label}</a>
					</span>
				</section>
			</header>
			<section className="col margin-gap markdown" dangerouslySetInnerHTML={{ __html: body }} />
		</BasePage>
	);
}

export async function* pages(content: Content) {
	const blog = await content.store(Blog);

	for (const post of blog.posts()) {
		yield {
			path: `blog/posts/${post.slug}.html`,
			element: <BlogPost title={post.title} category={post.category} date={post.date} body={post.body} />,
		};
	}
}