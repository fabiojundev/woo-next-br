import Link from 'next/link';

const MenuPrincipal = (props) => {

	const { className, linkClassName } = props;

	return (
		<div className={"font-medium lg:flex-grow " + className}>
			<Link href="/categoria-produto/cama-de-cultivo/">
				<a className={"my-3 lg:mt-0 mr-10 hover:opacity-75 " + linkClassName}>
					Cama de Cultivo
				</a>
			</Link>
			<Link href="/categoria-produto/kits-de-cultivo/">
				<a className={"my-3 lg:mt-0 mr-10 hover:opacity-75 " + linkClassName}>
					Kits de Cultivo
				</a>
			</Link>
			<Link href="/categoria-produto/vaso-de-6-7-litros/">
				<a className={"my-3 lg:mt-0 mr-10 hover:opacity-75 " + linkClassName}>
					Vasos
				</a>
			</Link>
			<Link href="/categoria-produto/solo-vivo/">
				<a className={"my-3 lg:mt-0 mr-10 hover:opacity-75 " + linkClassName}>
					Solo vivo
				</a>
			</Link>
			<Link href="/blog">
				<a className={"my-3 lg:mt-0 mr-10 hover:opacity-75 " + linkClassName}>
					Blog
				</a>
			</Link>
		</div>
	)
};

export default MenuPrincipal;
