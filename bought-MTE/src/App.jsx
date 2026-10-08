import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

import './App.css'

import Header from './components/Header.jsx'
import Login from './pages/Login.jsx'
import SignIn from './pages/SignIn.jsx'
import Main from './pages/Main.jsx'
import UserPage from './pages/UserPage.jsx'


function MainLayer({navibar, setNavibar}) {

  return (
    <>
      <Header navibar={navibar} setNavibar={setNavibar}/>
      <Outlet/>
    </>
  )
}

function App() {

  const [navibar, setNavibar] = useState("home");

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayer navibar={navibar} setNavibar={setNavibar}/>}>
          <Route path='/' element={<Main/>}/>
          <Route path='/userPage' element={<UserPage/>}/>
        </Route>

        <Route path='/login' element={<Login/>}/>
        <Route path='/sign' element={<SignIn/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App