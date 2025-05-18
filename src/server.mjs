import Express from "express";
import { handler as ssrHandler } from "../dist/server/entry.mjs";

const app = Express();

const redirectHostnames = new Set([
	"phoebe.codes",
	"www.bitch.lgbt",
	"bitch.lgbt",
	"www.anarchist.nyc",
	"anarchist.nyc",
	"www.phoebeclarke.com",
	"phoebeclarke.com",
]);
app.use((req, res, next) => {
	if (redirectHostnames.has(req.hostname)) {
		res.redirect(`https://www.phoebe.codes${req.originalUrl}`);
	} else {
		next();
	}
});

app.use("/", Express.static("dist/client"));
app.use(ssrHandler);

app.listen(process.env.PORT);
