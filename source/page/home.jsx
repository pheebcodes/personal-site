import { h, cn } from "../html.js";
import { BasePage } from "./_base.jsx";

function MainElement({ children, ...attrs }) {
	return (
		<main {...attrs} className={cn(attrs.className, "justify-center")} dangerouslySetInnerHTML={{ __html: children }} />
	);
}

export function Home({ body }) {
	return (
		<BasePage pageName="home" main={MainElement}>
			{body}
		</BasePage>
	);
}
