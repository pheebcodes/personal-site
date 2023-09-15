import { format } from "date-fns";
import { h } from "preact";

interface DateProps {
	date: Date;
}
export function Date({ date }: DateProps) {
	return (
		<time dateTime={format(date, "Y-MM-dd")}>
			{format(date, "d")} {format(date, "MMMM")}, {format(date, "y")}
		</time>
	);
}
