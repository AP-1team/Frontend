import { useEffect, useState } from 'react'
import { RiDeepseekFill } from 'react-icons/ri';
import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';

export default function UserPage() {

    const navigate = useNavigate();
    
    const [logOut, setLogout] = useState(false);
    const [bottomChoice, setBottomChoice] = useState("continue");

    const [user, setUser] = useState({ //임시 유저 정보
        "id": 1,
        "username": "UserID",
        "phone": "010-1013-0524",
        "address": "우리집",
        "boughtCount": 20,
    })

    // const [user, setUser] = useState(null);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     fetch('/api/users/me')
    //         .then((res) => {
    //             if(!res.ok) {
    //                 throw new Error("유저 정보를 불러오지 못했습니다.");
    //             }
    //             return res.json();
    //         })
    //         .then((data) => {
    //             setUser(data);
    //             setLoading(false);
    //         })
    //         .catch((err) => {
    //             setLoading(false);
    //             console.error("로그인 중 에러 발생:",err);
    //         })
    // }, []);

    const logout = () => {
        navigate('/login');
    }

    return (
        <section className='userPage-container'>

            {logOut && (
                <LogoutConfirm logout={logout} setLogout={setLogout}/>
            )}
            <div className='userPage-box'>
                <div className='userPage-userBox'>
                    <div className='userPage-userProfile'>

                    </div>

                    <div className='userPage-profileRightside'>
                        <span className='userPage-boughtCount'>
                            공동구매 누적 {user?.boughtCount}번
                        </span>

                        <div className='userPage-userPageBottom'>
                            <span className='userPage-userName'>{user?.username}</span>
                            <div className='userPage-btnBox'>
                                <button>정보 변경</button>
                                <button onClick={()=>{setLogout(true)}}>로그 아웃</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='userPage-bottomChoice'>
                    <button
                    className={bottomChoice === "continue" ? "active" : ""}
                    onClick={()=>{setBottomChoice("continue")}}>진행중인 채팅</button>
                    <button
                    className={bottomChoice === "gonggoo" ? "active" : ""}
                    onClick={()=>{setBottomChoice("gonggoo")}}>공구 내역</button>
                    <button
                    className={bottomChoice === "mygonggoo" ? "active" : ""}
                    onClick={()=>{setBottomChoice("mygonggoo")}}>내 공구</button>
                </div>

                <div className='userPage-bottom'>

                </div>
            </div>
        </section>
    )
}

function LogoutConfirm({logout, setLogout}) {

    return (
        <div className='LOC-container'>
            <div className='LOC-box'>
                <span>로그아웃 하시겠습니까?</span>

                <div className='LOC-btnBox'>
                    <button onClick={()=>{logout();}}>예</button>
                    <button onClick={()=>{
                        setLogout(false);
                    }}>아니요</button>
                </div>
            </div>
        </div>
    )
}