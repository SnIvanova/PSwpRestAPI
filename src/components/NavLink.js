import React from 'react';
import { Link } from "react-router-dom";

const NavLink = props => (
	<Link
		{...props}
		getprops={({ isCurrent }) => ( { style: { color: isCurrent ? '#fff' : '#ffffff80' } } )}
		className="nav-link"
	/>
);

export default NavLink;
