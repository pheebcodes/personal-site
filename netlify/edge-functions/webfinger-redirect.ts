export default function handler(request: Request): Response | undefined {
	try {
		const url = new URL(request.url);
		const resource = url.searchParams.get("resource");
		if (resource !== "acct:me@phoebe.codes") {
			return new Response("404 Not Found", {
				status: 404,
			});
		}
		const redirectUrl = new URL("https://xoxo.zone/.well-known/webfinger");
		redirectUrl.searchParams.set("resource", "acct:phoebe@xoxo.zone");
		return Response.redirect(redirectUrl.toString(), 302);
	} catch (_e) {
		return new Response("500 Server Error", {
			status: 500,
		});
	}
}
