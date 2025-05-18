import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ params }: APIContext) {
	const url = new URL(
		params.path!,
		"https://phoebecodes-personal-site-assets.s3.us-east-005.backblazeb2.com/"
	);
	return Response.redirect(url);
}
