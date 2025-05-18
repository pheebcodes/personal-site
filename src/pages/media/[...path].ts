import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ params }: APIContext) {
	const url = new URL(
		params.path!,
		"https://personal-site.s3.fr-par.scw.cloud"
	);
	return await fetch(url);
}
