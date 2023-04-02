function shouldBlock(url: string): boolean {
	try {
		return new URL(url).hostname.endsWith("ycombinator.com");
	} catch (_e) {
		return url.includes("ycombinator.com");
	}
}

export default function handler(request: Request): Response | undefined {
	const refererString = request.headers.get("referer");
	if (refererString && shouldBlock(refererString)) {
		return new Response("hacker news sucks", {
			status: 403,
		});
	}
}
