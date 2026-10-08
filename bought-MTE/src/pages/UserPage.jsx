import { useEffect, useState } from 'react'
import { RiDeepseekFill } from 'react-icons/ri';
import { BrowserRouter, Routes, Route, Link, Outlet, useNavigate } from 'react-router-dom';

export default function UserPage() {

    const navigate = useNavigate();

    const [user, setUser] = useState({ //임시 유저 정보
        "id": 1,
        "username": "UserID",
        "phone": "010-1013-0524",
        "address": "우리집",
        "boughtCount": 20,
        "email": "testmail2026@gmail.com",
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
            <div className='userPage-box'>
                <div className='userPage-userBox'>
                    <div className='userPage-userProfile'>

                    </div>

                    <div className='userPage-profileRightside'>
                        <span className='userPage-boughtCount'>
                            공동구매 누적 200번
                        </span>

                        <div className='userPage-userPageBottom'>
                            <span className='userPage-userName'>{user?.username}</span>
                            <span className='userPage-userEmail'>email : {user?.email}</span>
                            <div className='userPage-btnBox'>
                                <button>정보 변경</button>
                                <button onClick={()=>{logout()}}>로그 아웃</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}