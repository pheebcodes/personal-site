const accounts = new Set([
	"acct:me@phoebe.codes",
	"acct:me@phoebeclarke.com",
	"acct:phoebe@bitch.lgbt",
	"acct:phoebe@anarchist.nyc",
]);

export default function handler(request: Request): Response | undefined {
	try {
		const url = new URL(request.url);
		const resource = url.searchParams.get("resource");
		if (resource && !accounts.has(resource)) {
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
