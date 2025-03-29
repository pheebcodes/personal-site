import { h, Fragment, ComponentChildren, JSX } from "preact";
import { cn } from "../utils/cn.ts";
import { Head } from "../components/head.tsx";
import * as Header from "../components/header.tsx";
import * as Footer from "../components/footer.tsx";

interface HeaderLinksProps {
	pageName: string;
}
function HeaderLinks({ pageName }: HeaderLinksProps) {
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
				<Footer.LinkInner
					to="/public.asc"
					label="phoebe's public key"
					download
					me
				>
					(pgp key)
				</Footer.LinkInner>
			</Footer.LinkWrapper>
			<Footer.Link
				to="https://www.github.com/pheebcodes"
				label="phoebe's github profile"
				newTab
				me
			>
				github
			</Footer.Link>
			<Footer.Link
				to="https://www.linkedin.com/in/phoebe-c-9a2b00234"
				label="phoebe's linkedin profile"
				newTab
				me
			>
				linkedin
			</Footer.Link>
			<Footer.Link
				to="https://xoxo.zone/@phoebe"
				label="phoebe's mastodon profile on xoxo.zone"
				newTab
				me
			>
				mastodon
			</Footer.Link>
			<Footer.Link
				to="https://letterboxd.com/phoebecodes"
				label="phoebe's letterboxd profile"
				newTab
				me
			>
				letterboxd
			</Footer.Link>
		</>
	);
}

interface BasePageProps {
	title?: string;
	head?: ComponentChildren;
	pageName: string;
	main?: JSX.ElementType;
	children?: ComponentChildren;
}
export function BasePage({
	title,
	head,
	pageName,
	main: Main = "main",
	children,
}: BasePageProps) {
	return (
		<html lang="en">
			<Head title={title ? `phoebe - ${title}` : "phoebe"}>{head}</Head>
			<body>
				<Header.Container>
					<HeaderLinks pageName={pageName} />
				</Header.Container>

				<Main className={cn(pageName, "col container margin-gap grow")}>
					{children}
				</Main>

				<Footer.Container>
					<FooterLinks />
				</Footer.Container>
			</body>
		</html>
	);
}
