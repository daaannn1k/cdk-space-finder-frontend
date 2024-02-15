import { useState } from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import CreateSpace from './components/spaces/CreateSpace';
import Login from './components/Login';
import { AuthService } from './services/AuthService';
import { DataService } from './services/DataService';
import Spaces from './components/spaces/Spaces';

const authService = new AuthService();
const dataService = new DataService(authService);

function App() {
  const [userName, setUserName] = useState<string | undefined>(undefined);

  const router = createBrowserRouter([
    {
      element: (
        <>
          <Navbar userName={userName} authService={authService}/>
          <Outlet/>
        </>
      ),
      children: [
        {
          path: '/',
          element: <div>Hello, dear!</div>
        },
        {
          path: '/login',
          element: <Login authService={authService} setUserNameCb={setUserName}/>
        },
        {
          path: '/profile',
          element: <div>HProfile</div>
        },
        {
          path: '/spaces',
          element: <Spaces dataService={dataService}/>
        },
        {
          path: '/createSpace',
          element: <CreateSpace dataService={dataService} />
        },
        {
          path: '/logout',
          element: <div>Successfully logged out</div>
        }
      ]
      
    }
  ])

  return (
    <div>
     <RouterProvider router={router}/>
    </div>
  );
}

export default App;
