import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate, NavLink } from 'react-router-dom';

import icon from '../assets/HomeIcon.png'


export default function Header() {

    const navigate = useNavigate();
    
    return (
        <div className='Head-container'>
            <div className='Head-leftSide'>
                <img className='Head-icon' src={icon}/>
                <span className='Head-title'>뭉탱이</span>
            </div>

            <div className='Head-rightSide'>
                <NavLink className="Head-button"
                to='/'>홈</NavLink>
                <div className='Head-slash'></div>
                <NavLink className="Head-button"
                to='/userPage'>유저 페이지</NavLink>
            </div>
        </div>
    )
}