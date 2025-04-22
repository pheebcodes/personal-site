const accounts = new Set([
	"acct:me@phoebe.codes",
	"acct:me@phoebeclarke.com",
	"acct:phoebe@bitch.lgbt",
	"acct:phoebe@anarchist.nyc",
	"acct:phoebe@deploy-preview-28--phoebecodes.netlify.app",
]);

export default async function handler(
	request: Request,
): Promise<Response | undefined> {
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
		const response = await fetch(redirectUrl);
		const json = await response.json();
		return Response.json(
			{
				...json,
				subject: resource,
			},
			{ status: response.status },
		);
	} catch (_e) {
		return new Response("500 Server Error", {
			status: 500,
		});
	}
}
