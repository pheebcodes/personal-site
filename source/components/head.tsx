import { h, ComponentChildren } from "preact";

interface HeadProps {
	title: string;
	children: ComponentChildren;
}
export function Head({ title, children }: HeadProps) {
	return (
		<head>
			<meta charSet="utf-8" />
			<title>{title}</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="description" content="personal site for phoebe" />
			<link
				rel="preload"
				href="/fonts/BerkeleyMono-Regular.woff2"
				as="font"
				type="font/woff2"
				crossOrigin=""
			/>
			<link
				rel="preload"
				href="/fonts/BerkeleyMono-Italic.woff2"
				as="font"
				type="font/woff2"
				crossOrigin=""
			/>
			<link
				rel="preload"
				href="/fonts/BerkeleyMono-Bold.woff2"
				as="font"
				type="font/woff2"
				crossOrigin=""
			/>
			<link
				rel="preload"
				href="/fonts/BerkeleyMono-BoldItalic.woff2"
				as="font"
				type="font/woff2"
				crossOrigin=""
			/>
			<link rel="stylesheet" href="/style.css" />
			<link rel="icon" href="data:,"></link>
			{children}
		</head>
	);
}
