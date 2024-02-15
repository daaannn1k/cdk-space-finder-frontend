import { NavLink } from 'react-router-dom';
import { AuthService } from '../services/AuthService';

type NavbarProps = {
  userName: string | undefined,
  authService: AuthService,
}

export const Navbar = ({ userName, authService }: NavbarProps) => {
  
  const renderLoginLogout = () => {
    if(userName) {
      return <NavLink onClick={async () => await authService.logout()} to='/logout'>{userName}</NavLink>
    } else {
      return <NavLink to='/login'>Login</NavLink>
    }
  };

  return (
    <div className='flex justify-between p-3 bg-slate-500 text-white'>
      <div className='flex w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 justify-around'>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/profile'>Profile</NavLink>
        <NavLink to='/spaces'>Spaces</NavLink>
        <NavLink to='/createSpace'>Create space</NavLink>
      </div>
      <div>
        {renderLoginLogout()}
      </div>
    </div>
  )

}