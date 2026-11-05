import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';

import './App.css'

import Header from './components/Header.jsx'
import Login from './pages/Login.jsx'
import SignIn from './pages/SignIn.jsx'
import Main from './pages/Main.jsx'
import UserPage from './pages/UserPage.jsx'
import Post from './pages/Post.jsx'
import Chat from './pages/Chat.jsx'
import Upload from './pages/PostUpload.jsx'


function MainLayer() {

  return (
    <>
      <Header/>
      <Outlet/>
    </>
  )
}

function FadeIn({ children }) {
  const location = useLocation();

  return <div key={location.key} className="fade-in">{children}</div>
}

function App() {

  const [selectPost, setSelectPost] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayer/>}>
          <Route path='/' element={<FadeIn><Main selectPost={selectPost} setSelectPost={setSelectPost}/></FadeIn>}/>
          <Route path='/userPage' element={<FadeIn><UserPage/></FadeIn>}/>
          <Route path='/post/:id' element={<FadeIn><Post/></FadeIn>}/>
          <Route path='userPage/chat/:id' element={<FadeIn><Chat/></FadeIn>}/>
          <Route path='/upload' element={<FadeIn><Upload/></FadeIn>}/>
        </Route>

        <Route path='/login' element={<FadeIn><Login/></FadeIn>}/>
        <Route path='/sign' element={<FadeIn><SignIn/></FadeIn>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App