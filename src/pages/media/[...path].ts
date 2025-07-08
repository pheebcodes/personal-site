import type { APIContext } from "astro";

export const prerender = false;

export async function GET({ params }: APIContext) {
	if (import.meta.env.DEV) {
		return new Response(null, { status: 404 });
	}
	const url = new URL(
		params.path!,
		"https://personal-site.s3.fr-par.scw.cloud"
	);
	return Response.redirect(url);
}
