import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";
import { UTCDate } from "@date-fns/utc";

const blog = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		date: z.date().transform((d) => new UTCDate(d)),
		draft: z.literal(true).optional(),
	}),
});

const poems = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/poems" }),
	schema: z.object({
		title: z.string(),
		date: z.date().transform((d) => new UTCDate(d)),
		draft: z.literal(true).optional(),
	}),
});

const linkSchema = z.object({
	id: z.string(),
	label: z.string(),
	href: z.string(),
	me: z.boolean().optional(),
	newTab: z.boolean().optional(),
	download: z.boolean().optional(),
});
const links = defineCollection({
	loader: file("./src/content/links.json"),
	schema: linkSchema.extend({
		sublink: linkSchema.optional(),
	}),
});

export const collections = { blog, poems, links };
