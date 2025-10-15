import { NavLink } from 'react-router-dom'
import '../css/NavBar.css'
function NavBar() {
  return (
    <nav className='navbar'>
      <div className='navbar-brand'>
        <NavLink to='/' className='nav-link'>Movie App</NavLink>
      </div>
        <div className='navbar-links'>
            <NavLink to='/' className='nav-link'>Home</NavLink>
            <NavLink to='/favorites' className='nav-link'>Favorites</NavLink>
        </div>
    </nav>
  )
}

export default NavBar
