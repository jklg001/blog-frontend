import { createBrowserRouter } from 'react-router'
import Home from '../pages/Home/Home'
import Post from '../pages/Post/Post'
import About from '../pages/About/About'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import ArticleList from '../pages/Post/ArticleList'
import ArticleEditor from '../pages/Post/ArticleEditor'
import ProtectedRoute from '../components/ProtectedRoute'
import Profile from '../pages/User/Profile'
import ProfileEdit from '../pages/User/ProfileEdit'

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
  {
    path: '/articles',
    element: (
      <ProtectedRoute>
        <ArticleList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/articles/create',
    element: (
      <ProtectedRoute>
        <ArticleEditor />
      </ProtectedRoute>
    ),
  },
  {
    path: '/articles/edit/:id',
    element: (
      <ProtectedRoute>
        <ArticleEditor />
      </ProtectedRoute>
    ),
  },
  // 用户个人中心
  {
    path: '/user/profile',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  // 用户资料编辑
  {
    path: '/user/settings',
    element: (
      <ProtectedRoute>
        <ProfileEdit />
      </ProtectedRoute>
    ),
  },
  {
    path: '/user/:userId',
    element: <Profile />,
  },
  // 用户草稿列表
  {
    path: '/user/drafts',
    element: (
      <ProtectedRoute>
        <ArticleList />
      </ProtectedRoute>
    ),
  },
  // 用户文章列表
  {
    path: '/user/:userId/articles',
    element: <ArticleList />,
  },
])

export default router
