import { Context } from "https://edge.netlify.com";

export default async function handler(
	request: Request,
	context: Context,
): Promise<Response | undefined> {
	const assetUrl = new URL(
		"https://f005.backblazeb2.com/file/phoebecodes-personal-site-assets",
	);
	assetUrl.pathname += `/${context.params[0]}`;
	const res = await fetch(assetUrl);
	const lastModifiedNumber = Number(
		res.headers.get("x-bz-info-src_last_modified_millis"),
	);
	const lastModified = new Date(
		!isNaN(lastModifiedNumber) ? lastModifiedNumber : 0,
	);
	const etag = res.headers.get("x-bz-content-sha1");
	return lastModified.getTime() !== 0 && etag
		? new Response(res.body, {
				headers: {
					etag,
					"cache-control": "max-age=2419200",
					"last-modified": lastModified.toUTCString(),
				},
			})
		: new Response(res.body);
}
