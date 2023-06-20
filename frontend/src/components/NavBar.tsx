import { Link, Outlet } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
	return (
		<>
			<nav id="main-navbar">
				<Link to="/">SNATCH</Link>
				{/*<Link to="/recent" style={{marginLeft: "auto"}}>Room {roomName}</Link>*/}
			</nav>
			<div id="content">
				<Outlet />
			</div>
			<footer id="main-footer">
				<span>Made with ⛏ by flipdot e.V.</span>
				<Link to="https://flipdot.org/impressum/" target="_blank">
					Legal
				</Link>
			</footer>
		</>
	);
}

export default NavBar;
