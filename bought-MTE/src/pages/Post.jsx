import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { api, resolveMediaUrl } from '../api.js';

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

    const navigate = useNavigate();

    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;
        api.getGroup(id)
            .then((result) => { if (!cancelled) setPost(result?.group || null); })
            .catch((requestError) => { if (!cancelled) setError(requestError.message); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [id]);

    const goToChat = () => {
        if (post?.isJoined) navigate(`/userPage/chat/${id}`);
    }

    return (
        <main className='Post-container'>
            <div className='Post-box'>
                {loading && (
                    <p>로딩 중...</p>
                )}
                {!loading && error && <p className='Post-errorText'>{error}</p>}
                {!loading && !error && !post && <p>모집방 정보를 찾을 수 없습니다.</p>}
                <section className='Post-leftside'>
                    <div className='Post-image'>{post?.imageUrl && <img src={resolveMediaUrl(post.imageUrl)} alt={post.title}/>}</div>

                    <button className='Post-chatBtn' disabled={!post?.isJoined} onClick={goToChat}>{post?.isJoined ? '채팅으로 가기' : '참여자만 채팅할 수 있습니다'}</button>
                    <span className='Post-remainTime'>남은 시간: <DeadlineTimer deadline={post?.deadline} /></span>
                </section>

                <section className='Post-rightside'>
                    <h1>{post?.title}</h1>
                    <span className='Post-beforePrice'>{post?.price?.toLocaleString()}코인</span>
                    <div className='Post-priceBox'>
                        <span className='Post-afterPrice'>{post?.perPersonPrice?.toLocaleString() ?? Math.floor(post?.price / post?.targetCount).toLocaleString()}코인</span>
                        <span className='Post-count'>{post?.perPersonQuantity ?? post?.quantity / post?.targetCount}개 당</span>
                    </div>

                    <span className='Post-description'>{post?.description}</span>
                    
                    <div className='Post-desBox'>
                        <span>모집 기간: {post?.createdAt?.slice(0, 10)} ~ {post?.deadline?.slice(0, 10)}</span>
                        <span>모집 인원:{post?.targetCount}인 / <span className='Post-remainCount'>현재 {post?.currentCount}명 모집 완료</span></span>
                        <span>모집 지역 제한: {post?.region}</span>
                    </div>

                    <span>작성자: {post?.author?.username}</span>

                    <div className='Post-userBox'><span>총 수량 {post?.quantity}개</span></div>
                </section>
            </div>
        </main>
    )
}