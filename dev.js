const fs = require("fs").promises;
const Express = require("express");
const Engine = require("./template-engine");
const getDataFromContentful = require("./data");

const app = Express();

app.use("/assets", Express.static("assets"));

app.get("/*", async (req, res) => {
	const data = await getDataFromContentful();
	const templateData = await fs.readFile("template.hbs", "utf8");
	const template = Engine.compile(templateData);
	res.type("html").send(template(data));
});

app.listen(8080);
