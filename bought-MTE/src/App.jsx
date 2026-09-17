import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import './App.css'

import Login from './pages/Login.jsx'
import Main from './pages/Main.jsx'



function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main/>}/>

        <Route path='/login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
