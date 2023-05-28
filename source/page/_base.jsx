import { h, cn } from "../html.js";
import { Head } from "../components/head.jsx";
import { Header, HeaderLink } from "../components/header.jsx";
import { Footer, FooterLink } from "../components/footer.jsx";

function HeaderLinks({ pageName }) {
	return (
		<>
			<HeaderLink href="/" current={pageName === "home"}>
				home
			</HeaderLink>
			<HeaderLink href="/blog" current={pageName.startsWith("blog-")}>
				blog
			</HeaderLink>
		</>
	);
}

function FooterLinks() {
	return (
		<>
			<span>
				<FooterLink to="mailto:me@phoebe.codes" label="email phoebe" me>
					email
				</FooterLink>{" "}
				<FooterLink to="/public.pgp" label="phoebe's public key" download me>
					(key)
				</FooterLink>
			</span>
			<FooterLink to="https://www.github.com/pheebcodes" label="phoebe's github profile" newTab me>
				github
			</FooterLink>
			<FooterLink to="https://www.linkedin.com/in/phoebe-c-9a2b00234" label="phoebe's linkedin profile" newTab me>
				linkedin
			</FooterLink>
			<FooterLink
				to="https://www.hachyderm.io/@phoebecodes"
				label="phoebe's fediverse profile on hachyderm.io"
				newTab
				me
			>
				fediverse
			</FooterLink>
			<FooterLink to="https://bsky.app/profile/phoebe.codes" label="phoebe's bluesky profile" newTab me>
				bluesky
			</FooterLink>
		</>
	);
}

export function BasePage({ title, pageName, main = "main", children }) {
	return (
		<html lang="en">
			<Head title={title ? `phoebe - ${title}` : "phoebe"} />
			<body>
				<Header links={<HeaderLinks pageName={pageName} />} />
				{h(main, { className: cn(pageName, "col container margin-gap grow") }, ...children)}
				<Footer links={<FooterLinks />} />
			</body>
		</html>
	);
}
