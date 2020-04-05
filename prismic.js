import Prismic from "prismic-javascript";

export const getData = async (endpoint, accessToken) => {
	const api = await Prismic.getApi(endpoint, { accessToken });
	const footer = (await api.getSingle("footer")).data;
	const contactLinkIds = footer.contact_links.map(
		(data) => data.contact_link.id,
	);
	const contactLinks = (
		await Promise.all(contactLinkIds.map((id) => api.getByID(id)))
	)
		.map((entry) => entry.data)
		.map((contactLink) => ({
			label: contactLink.label,
			icon: contactLink.icon,
			url: contactLink.link.url,
		}));

	const description = (await api.getSingle("description")).data.text;

	return {
		contactLinks,
		description,
	};
};
