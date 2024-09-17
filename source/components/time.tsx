import { format } from "date-fns";
import { h } from "preact";

interface TimeProps {
	date: Date;
}
export function Time({ date }: TimeProps) {
	return (
		<time dateTime={format(date, "y-MM-dd")}>
			{format(date, "d")} {format(date, "MMMM")}, {format(date, "y")}
		</time>
	);
}
