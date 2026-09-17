import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

import icon from '../assets/HomeIcon.png'


export default function Header() {
    
    return (
        <div className='Head-container'>
            <div className='Head-leftSide'>
                <img className='Head-icon' src={icon}/>
                <span className='Head-title'>뭉탱이</span>
            </div>

            <div className='Head-rightSide'>
                <button className='Head-button' id='Head-homeButton'>홈</button>
                <div className='Head-slash'></div>
                <button className='Head-button' id='Head-userButton'>유저 페이지</button>
            </div>
        </div>
    )
}