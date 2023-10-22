import { h } from "preact";
import { BasePage } from "./_base-page.tsx";
import { Time } from "../components/time.tsx";
import { Pagination } from "../components/pagination.tsx";

interface LineItemProps {
	filename: string;
	title: string;
	date: Date;
}
function LineItem({ filename, title, date }: LineItemProps) {
	return (
		<li className="col">
			<span>
				<a href={`/media/${filename}`}>{title}</a>
			</span>
			<Time date={date} />
		</li>
	);
}

export function Gallery() {
	return (
		<BasePage title="gallery" pageName="gallery-toc">
			<ol class="toc">
				<LineItem filename="original-reencoded.mp4" title="cooper original footage" date={new Date(1696132800000)} />
				<LineItem filename="tiktok-edit.mp4" title="cooper tiktok" date={new Date(1696132800000)} />
			</ol>

			<Pagination currentPage={1} previousLink={null} nextLink={null} />
		</BasePage>
	);
}

export async function* pages() {
	yield {
		path: `gallery/1.html`,
		element: <Gallery />,
	};
}
