---
title: blocking hacker news with netlify edge functions
tags:
  - meta
  - netlify
---

i recently reworked this site from the ground up and in the process decided to
add blogging to it. this will surely prove to be a mistake, either by my posts
ending up in places that i don't want them to be, or by just never writing
anything to post on it. in my classic "putting the cart before the
horse"-fashion, i solved the former problem by blocking hacker news from linking
to phoebe.codes before i even had any content to link to. maybe if my brain
could turn adderall into blog posts instead of code, we could've solved the
latter problem first, but my therapist tells me to focus on my strengths, so
here we are, code written and no blog posts.

this site is a statically generated site that's hosted on
[netlify](https://www.netlify.com). the process i used to block hacker news does
require the site to be hosted on netlify, but it doesn't require using any
particular static-site generator for your site (the static-site generator i'm
using is bespoke, because a little suffering is ok, as a treat). netlify has a
lot of neat features, like deploy previews and forms and identity, but today
we'll be using edge functions to fend off `[redacted]`.

edge functions sit between the browser and your deployed site. each request to
your site that matches an edge function's configured path will go through that
edge function. the edge function can then do pretty much anything it wants with
the request, such as modifying content, redirecting/rewriting the request, or
verifying some provided authentication. edge functions are very powerful, so
naturally we're going to throw one of computer science's hardest problems at it:
string comparison.

i'll stop beating around the bush and show you the code.

```typescript
export default function handler(request: Request): Response | undefined {
	const refererString = request.headers.get("referer");
	if (refererString && shouldBlock(refererString)) {
		return new Response("hacker news sucks", {
			status: 403,
		});
	}
}

function shouldBlock(url: string): boolean {
	try {
		return new URL(url).hostname.endsWith("ycombinator.com");
	} catch (_e) {
		return url.includes("ycombinator.com");
	}
}
```

that's pretty much it, but i know you're here to learn, so we're going to go a
bit deeper.

we start out with an exported function called `handler`. it takes a `Request`
and returns either a `Response` or `undefined`. in edge functions, we return a
`Response` when we want to terminate the request. we could also return
`undefined` when we want to bypass the current edge function and either go to
the next edge function or serve the static content at that path if there are no
more edge functions for the path of our request.

```typescript
export default function handler(request: Request): Response | undefined { }
```

next, we get the `Referer`[sic] header for the request. this value will be
either `null` if the browser navigated to your site directly, or it will be url
of the site that linked the browser to your site.

```typescript
export default function handler(request: Request): Response | undefined {
	const refererString = request.headers.get("referer");
}
```

now, we'll create a new function named `shouldBlock` that takes a string (a
non-null `Referer` header) and returns whether the edge function should block
the request or not. we can parse the string using the `URL` class, then check if
the `URL` instance's hostname ends with `"ycombinator.com"`.

the `URL` class constructor could throw a `TypeError` if it is passed a string
that isn't a valid url containing a protocol and a hostname. in the case that
the url cannot be parsed, we'll just check if the string contains
`"ycombinator.com"`. we could probably just check if the string contains
`"ycombinator.com"` instead of trying to parse it using the `URL` class first,
but i have to make up for years of pretending that classes don't exist, so we'll
give `URL` a fair shot before falling back to the "good enough" method.

```typescript
export default function handler(request: Request): Response | undefined {
	const refererString = request.headers.get("referer");
}

function shouldBlock(url: string): boolean {
	try {
		return new URL(url).hostname.endsWith("ycombinator.com");
	} catch (_e) {
		return url.includes("ycombinator.com");
	}
}
```

finally, we can use our new `shouldBlock` function in the edge function handler.
we'll first check if `refererString` is not-null, then we'll send it to
`shouldBlock` to figure out if our site has made its way to the bad place yet.
if `shouldBlock` raises the red flag, we'll terminate the request by returning a
`Response` instance with a mature, professional message for the user to see
along with a status code of `403`. if `refererString` doesn't match, then our
edge function will implicitly return `undefined` and the request will bypass the
edge function and our site's content will be served.

```typescript
export default function handler(request: Request): Response | undefined {
	const refererString = request.headers.get("referer");
	if (refererString && shouldBlock(refererString)) {
		return new Response("hacker news sucks", {
			status: 403,
		});
	}
}

function shouldBlock(url: string): boolean {
	try {
		return new URL(url).hostname.endsWith("ycombinator.com");
	} catch (_e) {
		return url.includes("ycombinator.com");
	}
}
```

so that's our code! but what do we do with it? assuming you're already deploying
your site using netlify, we can drop the function into our git repository.
create a new directory in your repository, `"netlify/edge-functions"`, then save
your code there as `"block-hacker-news.ts"`. the full path of the file relative
to the repository root should be
`"netlify/edge-functions/block-hacker-news.ts"`.

once you have that saved, we'll configure the edge function. create a
`netlify.toml` file at the root of your repository if it doesn't already exist.
then, we want to configure our edge function to handle all requests that come to
our site.

```toml
[[edge_functions]]
	path = "/*"
	function = "block-hacker-news"
```

commit all that and git push. if your netlify site is configured to
automatically deploy your site when new code is pushed/merged into main, then
your new edge function should be deploying! if the site isn't configured to
automatically deploy, then you'll have to trigger a deploy manually in netlify.

once your code is deployed, you can check if your code is working using curl.
open your terminal and run `curl [your site url] -LH "Referer:
news.ycombinator.com"`. if all is good, your chosen _friendly_ message should be
printed in your terminal. you should double check that requests without a
Referer are still able to access your site as normal. you can do that by running
`curl [your site url] -L`.

and like, that's it, man. you can now rest easy at night knowing your site or
blog is protected by the ghost of john mcafee. if you _aren't_ on netlify and
this method is completely useless to you, godspeed.

on a more serious note, i hope you enjoyed the first post here. i am planning on
posting more serious stuff (in content, not tone), like about the macropad
firmware i'm currently prototyping in rust using [embassy](https://embassy.dev).
in the long-term future i would like to produce some macropads using the
firmware as well (trying... to not... put the cart before the horse again), but
regardless expect a mix of web coding, embedded coding, and electrical
engineering content on here.
