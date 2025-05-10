import { createBrowserRouter } from 'react-router'
import Home from '../pages/Home/Home.jsx'
import Post from '../pages/Post/Post.jsx'
import About from '../pages/About/About.jsx'

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
])

export default router
