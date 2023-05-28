import assert from "assert";
import { format } from "date-fns";
import { h } from "../html.js";

export function Date({ children }) {
	assert(children.length === 1, "Date component expects exactly 1 child");
	const date = children[0];
	return (
		<time dateTime={format(date, "Y-MM-dd")}>
			{format(date, "d")} {format(date, "MMMM")}, {format(date, "y")}
		</time>
	);
}
