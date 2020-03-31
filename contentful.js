import { createClient } from "contentful";
import { sortBy, orderBy } from "lodash";

const contentfulClient = createClient({
	space: process.env.CONTENTFUL_SPACE,
	accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

const contentTypeEquals = (id) => (entry) =>
	entry.sys.contentType.sys.id === id;

const formatDate = (date) => {
	date = date instanceof Date ? date : new Date(date);
	return date.toLocaleDateString("en", {
		year: "numeric",
		month: "long",
	});
};

const timePeriodFor = (startDate, endDate) => {
	const formattedStartDate = startDate && formatDate(startDate);
	const formattedEndDate = endDate && formatDate(endDate);

	if (formattedStartDate && formattedEndDate) {
		return `${formattedStartDate} to ${formattedEndDate}`;
	} else if (formattedStartDate) {
		return `Since ${formattedStartDate}`;
	} else if (formattedEndDate) {
		return `Until ${formattedStartDate}`;
	}
	return null;
};

export default async function getDataFromContentful() {
	const entries = await contentfulClient.getEntries();

	const unsortedProjects = entries.items
		.filter(contentTypeEquals("project"))
		.map((entry) => ({
			name: entry.fields.name,
			description: entry.fields.description,
			weight: entry.fields.weight,
			image: entry.fields.image
				? {
						url: entry.fields.image.fields.file.url,
						title: entry.fields.image.fields.title,
				  }
				: null,
		}));

	const projects = sortBy(unsortedProjects, [(entry) => -entry.weight]);

	const unsortedHistory = entries.items
		.filter(contentTypeEquals("history"))
		.map((entry) => ({
			name: entry.fields.name,
			location: entry.fields.location,
			sort: new Date(entry.fields.startDate || 0).getTime(),
			timePeriod: timePeriodFor(entry.fields.startDate, entry.fields.endDate),
			description: entry.fields.description,
		}));

	const history = orderBy(unsortedHistory, [(entry) => entry.sort], ["desc"]);

	const unsortedSocial = entries.items
		.filter(contentTypeEquals("social"))
		.map((entry) => ({
			icon: entry.fields.icon,
			url: entry.fields.url,
			text: entry.fields.text,
			label: entry.fields.label,
			weight: entry.fields.weight,
		}));

	const social = sortBy(unsortedSocial, [(entry) => -entry.weight]);

	return { projects, history, social };
}
