import z from "zod";
import { Content } from "../content.ts";
import * as DateFns from "date-fns";
import { Page, paginate } from "../utils/paginate.tsx";

interface PostGrayMatter {
	title: string;
}

export interface Post {
	title: string;
	slug: string;
	date: Date;
	body: string;
}

export class Posts {
	#posts: Post[];

	constructor(posts: Post[]) {
		this.#posts = posts.toSorted(Posts.#sort);
	}

	*posts(): IterableIterator<Post> {
		yield* this.#posts;
	}

	*pages(): IterableIterator<Page<Post>> {
		yield* paginate(this.posts(), Posts.#perPage);
	}

	*[Symbol.iterator](): IterableIterator<Readonly<Post>> {
		yield* this.posts();
	}

	static #perPage = 10;

	static async buildContentStore(content: Content): Promise<Posts> {
		const posts: Post[] = [];
		for await (const file of content.match("blog/posts/*.md")) {
			const md = await file.md(Posts);
			const body = md.body;
			const { title } = md.attributes;
			const { slug } = file;
			const dateText = slug.slice(0, Posts.#dateFormat.length);

			posts.push({
				title,
				body,
				slug,
				date: DateFns.parse(dateText, Posts.#dateFormat, 0),
			});
		}

		return new Posts(posts);
	}

	static fromGrayMatter(data: unknown): PostGrayMatter {
		return this.#validator.parse(data);
	}

	static #dateFormat = "yyyy-MM-dd";
	static #sort(a: Readonly<Post>, b: Readonly<Post>): number {
		return DateFns.compareDesc(a.date, b.date);
	}
	static #validator = z.object({
		title: z.string(),
	});
}
