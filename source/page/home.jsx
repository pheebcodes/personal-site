import { h } from "../html.js";
import { BasePage } from "./_base.jsx";

function MainElement({ children, ...attrs }) {
	return h("main", { ...attrs, dangerouslySetInnerHTML: { __html: children } });
}

export function Home({ body }) {
	return (
		<BasePage title="phoebe" pageName="home" main={MainElement}>
			{body}
		</BasePage>
	);
}
