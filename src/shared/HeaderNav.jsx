import { NavLink } from 'react-router';
import NavStyle from "./HeaderNav.module.css";
function HeaderNav ({title}) {
    return (
        <>
        {/* h1 takes in a title props */}
            <h1 className={NavStyle.title}>{title}</h1>
            <nav>
                {/* props based on truthiness of isActive property
                    active -> true
                    inactive -> false
                */}
                <NavLink to="/" className={({isActive}) => isActive ? NavStyle.active : NavStyle.inactive }>Home</NavLink>
                <NavLink to="/about" className={({isActive}) => isActive ? NavStyle.active : NavStyle.inactive }>About</NavLink>
            </nav>
        </>
    )
}
export default HeaderNav;