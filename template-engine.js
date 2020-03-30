const Handlebars = require("handlebars");
const Markdown = require("helper-markdown");

Handlebars.registerHelper("markdown", Markdown());

Handlebars.registerHelper("and", (...args) =>
	args.every((arg) => Boolean(arg) === true),
);

module.exports = Handlebars;
