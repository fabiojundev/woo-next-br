import Nav from "./Nav";

const Header = ( {slug} ) => {

	return (
		<header className="header">
			<Nav slug={slug}/>
		</header>
	);
};

export default Header;
