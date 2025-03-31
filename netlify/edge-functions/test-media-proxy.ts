import { Context } from "https://edge.netlify.com";

export default async function handler(
	_request: Request,
	context: Context,
): Promise<Response | undefined> {
	const assetUrl = new URL(
		"https://f005.backblazeb2.com/file/phoebecodes-personal-site-assets",
	);
	assetUrl.pathname += `/${context.params[0]}`;
	const res = await fetch(assetUrl);
	return new Response(res.body, {
		headers: {
			"cache-control": "public, s-maxage=2419200",
		},
	});
}
