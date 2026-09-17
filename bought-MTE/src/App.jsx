import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

import './App.css'

import Header from './components/Header.jsx'
import Login from './pages/Login.jsx'
import Main from './pages/Main.jsx'


function MainLayer() {

  return (
    <>
      <Header/>

      <Outlet/>
    </>
  )
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayer/>}>
          <Route path='/' element={<Main/>}/>

        </Route>

        <Route path='/login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
