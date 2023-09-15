type ClassNameValue = string | string[] | Record<string, unknown> | undefined | null;

function* cnInner(values: ClassNameValue[]): Generator<string, void, void> {
	for (const value of values) {
		if (!value) {
			continue;
		}

		if (typeof value === "string") {
			yield value;
		} else if (Array.isArray(value)) {
			yield* cnInner(value);
		} else if (typeof value === "object") {
			for (const [k, v] of Object.entries(value)) {
				if (v) {
					yield k;
				}
			}
		}
	}
}

export function cn(...values: ClassNameValue[]) {
	return Array.from(cnInner(values))
		.map((classname) => classname.trim())
		.join(" ");
}
