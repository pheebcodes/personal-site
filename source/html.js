export * from "preact";

export function cn(...values) {
	const classnames = [];
	for (const value of values) {
		if (typeof value === "string") {
			classnames.push(value);
		} else if (Array.isArray(value)) {
			classnames.push(...value);
		} else if (typeof value === "object") {
			for (const [k, v] of Object.entries(value)) {
				if (v) {
					classnames.push(k);
				}
			}
		}
	}
	return classnames.map((classname) => classname.trim()).join(" ");
}
