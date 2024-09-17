import { formatISO } from "date-fns";
import { h, Fragment } from "preact";
import { BasePage } from "./_base-page.tsx";
import { Time } from "../components/time.tsx";
import { Content } from "../content.ts";
import { Posts } from "./_posts-store.ts";

interface MetaProps {
	title: string;
	date: Date;
}
function Meta({ title, date }: MetaProps) {
	return (
		<>
			<meta property="og:type" content="article" />
			<meta property="og:title" content={`${title} - phoebe codes`} />
			<meta
				property="og:article:published_time"
				content={formatISO(date, { representation: "date" })}
			/>
		</>
	);
}

interface BlogPostProps {
	title: string;
	date: Date;
	body: string;
}
export function BlogPost({ title, date, body }: BlogPostProps) {
	return (
		<BasePage
			title={title}
			pageName="blog-post"
			head={<Meta title={title} date={date} />}
		>
			<header className="column">
				<h1>{title}</h1>
				<Time date={date} />
			</header>
			<section
				className="col margin-gap markdown"
				dangerouslySetInnerHTML={{ __html: body }}
			/>
		</BasePage>
	);
}

export async function* pages(content: Content) {
	const posts = await content.store(Posts);

	for (const post of posts) {
		yield {
			path: `blog/posts/${post.slug}.html`,
			element: (
				<BlogPost title={post.title} date={post.date} body={post.body} />
			),
		};
	}
}
