import { h } from "preact";
import { Content } from "../content.ts";
import { cn } from "../jsx-utils.ts";
import { BasePage } from "./_base-page.tsx";

interface MainElementProps {
	className: string;
	body: string;
}
function MainElement({ className, body, ...attrs }: MainElementProps) {
	return (
		<main {...attrs} className={cn(className, "justify-center markdown")} dangerouslySetInnerHTML={{ __html: body }} />
	);
}

interface HomeProps {
	body: string;
}
export function Home({ body }: HomeProps) {
	return <BasePage pageName="home" main={(attrs) => <MainElement {...attrs} body={body} />} />;
}

export async function* pages(content: Content) {
	const indexFile = await content.read("index.md");
	const index = indexFile.md();

	yield {
		path: "index.html",
		element: <Home body={index.body} />,
	};
}
