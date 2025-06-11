import { createBrowserRouter } from 'react-router'
import Home from '../pages/Home/Home'
import Post from '../pages/Post/Post'
import About from '../pages/About/About'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/post/:id',
    element: <Post />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
])

export default router
