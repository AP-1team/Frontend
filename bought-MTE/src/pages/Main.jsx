import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import searchIcon from '../assets/searchIcon.png';
import apple from '../assets/apple.png';
import box from '../assets/box.png';

function DeadlineTimer({ deadline }) {

    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(deadline).getTime() - new Date().getTime();

            if (difference <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            return { days, hours, minutes, seconds, isExpired: false };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    if (timeLeft.isExpired) {
        return <span>마감됨</span>;
    }

    return (
        <span>
            {timeLeft.days > 0 && `${timeLeft.days}일 `}
            {timeLeft.hours}시간 {timeLeft.minutes}분 {timeLeft.seconds}초
        </span>
    );
}

export default function Main({selectPost, setSelectPost}) {

    const navigate = useNavigate();

    const [mainButton, setMainButton] = useState("lastest");
    const [post, setPost] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/jjabPost.json')
            .then((res) => {
                if(!res.ok) {
                    throw new Error("게시글을 불러오지 못함");
                }
                return res.json();
            })
            .then((data) => {
                setPost(data);
                setLoading(false);
            })  
            .catch((err) => {
                setLoading(false);
                console.error("게시글 불러오는 중 에러 발생:", err);
            })
    }, []);

    return (
        <div className='Main-container'>
            <div className='Main-searchInputBox'>
                <input/>
                <button>
                    <img src={searchIcon} alt="검색 아이콘"/>
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
                {loading && <p>로딩 중...</p>}
                <div className='Main-boxLeftside'>
                    <div className='Main-categoryBox'>
                        <button>식료품<img src={apple} alt="식료품"/></button>
                        <button>소모품<img src={box} alt="소모품"/></button>
                        <button></button>
                    </div>
                </div>

                <div className='Main-boxRightside'>
                    {post?.data?.groups?.map((group) => (
                        <div key={group.id} className='Main-post' onClick={()=>{
                            setSelectPost(group);
                            navigate(`/post/${group.id}`);
                        }}>
                            <div className='Main-postPhoto'></div>

                            <h1>{group.title}</h1>

                            <div className='Main-priceBox'>
                                <span className='Main-beforePrice'>
                                    {group.price}원
                                </span>
                                <span className='Main-afterPrice'>{group.price / group.targetCount}원</span>
                                <span className='Main-count'>{group.targetCount}개 당</span>
                            </div>

                            <div className='Main-countBox'>
                                <span>모집 인원 <span>{group.targetCount - group.currentCount}명</span> 남음</span>                                
                                <span>남은 시간: <DeadlineTimer deadline={group.deadline} /></span>
                            </div>

                            <button className='Main-joinBtn' onClick={() => {
                                alert("개발 중");
                            }}>참여하기</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}