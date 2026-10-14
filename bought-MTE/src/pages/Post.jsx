import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet, useParams } from 'react-router-dom';

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

export default function Post() {

    const id = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/jjabPostDetail.json')
            .then((res) => {
                if(!res.ok) throw new Error("상세 정보 불러오기 실패");
                return res.json();
            })
            .then((result) => {
                if(result.success) {
                    setPost(result.data.group);
                }
                setLoading(false);
            })
    })

    return (
        <main className='Post-container'>
            <div className='Post-box'>
                {loading && (
                    <p>로딩 중...</p>
                )}
                <section className='Post-leftside'>
                    <div className='Post-image'></div>

                    <button className='Post-chatBtn'>채팅으로 가기</button>
                    <span className='Post-remainTime'>남은 시간: <DeadlineTimer deadline={post?.deadline} /></span>
                </section>

                <section className='Post-rightside'>
                    <h1>{post?.title}</h1>
                    <span className='Post-beforePrice'>{post?.price}원</span>
                    <div className='Post-priceBox'>
                        <span className='Post-afterPrice'>{post?.price / post?.targetCount}원</span>
                        <span className='Post-count'>{post?.targetCount}개 당</span>
                    </div>

                    <span className='Post-description'>{post?.description}</span>
                    
                    <div className='Post-desBox'>
                        <span>모집 기간:{post?.deadline}</span>
                        <span>모집 인원:{post?.targetCount}인 / <span className='Post-remainCount'>현재 {post?.currentCount}명 모집 완료</span></span>
                        <span>모집 지역 제한: 우리집</span>
                    </div>

                    <div className='Post-userBox'>
                        {post?.participants.map((user) => (
                            <div key={user.id} className='Post-userProfile'>
                                <div className='Post-userImage'></div>
                                <span>{user.username}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}