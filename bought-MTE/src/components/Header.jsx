import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';

import icon from '../assets/HomeIcon.png'


export default function Header({navibar, setNavibar}) {

    const navigate = useNavigate();

    const homeClicked = () => {
        setNavibar("home");
        navigate('/');
    }

    const userPageClicked = () => {
        setNavibar("userPage");
        navigate('/userPage');
    }
    
    return (
        <div className='Head-container'>
            <div className='Head-leftSide'>
                <img className='Head-icon' src={icon}/>
                <span className='Head-title'>뭉탱이</span>
            </div>

            <div className='Head-rightSide'>
                <button className={navibar === "home" ? "Head-button active" : "Head-button"}
                onClick={()=>{homeClicked()}}>홈</button>
                <div className='Head-slash'></div>
                <button className={navibar === "userPage" ? "Head-button active" : "Head-button"}
                onClick={()=>{userPageClicked()}}>유저 페이지</button>
            </div>
        </div>
    )
}