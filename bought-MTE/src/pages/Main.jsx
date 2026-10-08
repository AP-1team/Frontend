import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react'

import searchIcon from '../assets/searchIcon.png'


export default function Main() {

    const [mainButton, setMainButton] = useState("lastest");

    return (
        <div className='Main-container'>
            <div className='Main-searchInputBox'>
                <input/>
                <button>
                    <img src={searchIcon}/>
                </button>
            </div>
            <div className='Main-boxTitle'>
                <span>최근 진행 중인 공동구매</span>

                <button className={mainButton === "lastest" ? "active Main-LastestBtn" : "Main-LastestBtn"}
                    onClick={()=>{setMainButton("lastest")}}>최신순</button>
                <button className={mainButton === "period" ? "active Main-periodBtn" : "Main-periodBtn"}
                    onClick={()=>{setMainButton("period")}}>기간 임박</button>
                <button className={mainButton === "jjim" ? "active Main-jjimBtn" : "Main-jjimBtn"}
                    onClick={()=>{setMainButton("jjim")}}>찜 순</button>
            </div>

            <div className='Main-box'>

            </div>
        </div>
    )
}



