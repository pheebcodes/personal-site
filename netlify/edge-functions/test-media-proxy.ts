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
	const etag = res.headers.get("x-bz-content-sha1")!;
	return new Response(res.body, {
		headers: {
			"cache-control": "public,s-maxage=2419200,max-age=2419200",
			etag,
		},
	});
}
