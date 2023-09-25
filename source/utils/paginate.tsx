export interface Page<T> {
	items: T[];
	page: number;
	first: boolean;
	last: boolean;
}

export function* paginate<T>(items: Iterable<T>, perPage: number): Iterable<Page<T>> {
	let collectedItems = Array.from(items);
	const startLength = collectedItems.length;
	let page = 1;
	while (collectedItems.length > 0) {
		const first = collectedItems.length === startLength;
		const items = collectedItems.slice(0, perPage);
		collectedItems = collectedItems.slice(perPage);
		const last = collectedItems.length === 0;
		yield {
			items,
			page: page++,
			first,
			last,
		};
	}
}
