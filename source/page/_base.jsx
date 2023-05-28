import { h, cn } from "../html.js";
import { Head } from "../components/head.jsx";
import * as Header from "../components/header.jsx";
import * as Footer from "../components/footer.jsx";
import * as Divided from "../components/divided.jsx";

function HeaderLinks({ pageName }) {
	return (
		<>
			<Header.Link href="/" current={pageName === "home"}>
				home
			</Header.Link>
			<Header.Link href="/blog" current={pageName.startsWith("blog-")}>
				blog
			</Header.Link>
		</>
	);
}

function FooterLinks() {
	return (
		<>
			<Footer.LinkWrapper>
				<Footer.LinkInner to="mailto:me@phoebe.codes" label="email phoebe" me>
					email
				</Footer.LinkInner>{" "}
				<Footer.LinkInner to="/public.pgp" label="phoebe's public key" download me>
					(key)
				</Footer.LinkInner>
			</Footer.LinkWrapper>
			<Footer.Link to="https://www.github.com/pheebcodes" label="phoebe's github profile" newTab me>
				github
			</Footer.Link>
			<Footer.Link to="https://www.linkedin.com/in/phoebe-c-9a2b00234" label="phoebe's linkedin profile" newTab me>
				linkedin
			</Footer.Link>
			<Footer.Link
				to="https://www.hachyderm.io/@phoebecodes"
				label="phoebe's fediverse profile on hachyderm.io"
				newTab
				me
			>
				fediverse
			</Footer.Link>
			<Footer.Link to="https://bsky.app/profile/phoebe.codes" label="phoebe's bluesky profile" newTab me>
				bluesky
			</Footer.Link>
		</>
	);
}

export function BasePage({ title, head, pageName, main = "main", children }) {
	return (
		<html lang="en">
			<Head title={title ? `phoebe - ${title}` : "phoebe"}>{head}</Head>
			<body>
				<Header.Container>
					<HeaderLinks pageName={pageName} />
				</Header.Container>

				{h(main, { className: cn(pageName, "col container margin-gap grow") }, ...children)}

				<Footer.Container>
					<FooterLinks pageName={pageName} />
				</Footer.Container>
			</body>
		</html>
	);
}
