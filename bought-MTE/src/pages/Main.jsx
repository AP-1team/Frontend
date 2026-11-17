import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import searchIcon from '../assets/searchIcon.png';
import { api, getAccessToken, resolveMediaUrl } from '../api.js';

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

export default function Main() {

    const navigate = useNavigate();

    const [keyword, setKeyword] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [groups, setGroups] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [joiningId, setJoiningId] = useState(null);

    useEffect(() => {
        let cancelled = false;
        api.getGroups({ keyword, page })
            .then((result) => {
                if (cancelled) return;
                setGroups(result?.groups || []);
                setTotalPages(result?.totalPages || 1);
            })
            .catch((requestError) => {
                if (!cancelled) setError(requestError.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, [keyword, page]);

    const search = (event) => {
        event.preventDefault();
        const nextKeyword = searchValue.trim();
        setError('');
        if (nextKeyword !== keyword || page !== 1) setLoading(true);
        setPage(1);
        setKeyword(nextKeyword);
    };

    const joinGroup = async (event, group) => {
        event.stopPropagation();
        if (!getAccessToken()) {
            navigate('/login');
            return;
        }
        setJoiningId(group.id);
        setError('');
        try {
            await api.joinGroup(group.id);
            navigate(`/userPage/chat/${group.id}`);
        } catch (requestError) {
            if (requestError.code === 'ALREADY_JOINED') {
                navigate(`/userPage/chat/${group.id}`);
            } else {
                setError(requestError.message);
            }
        } finally {
            setJoiningId(null);
        }
    };

    return (
        <div className='Main-container'>
            <form className='Main-searchInputBox' onSubmit={search}>
                <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} aria-label='상품명 검색' placeholder='찾는 상품을 검색하세요'/>
                <button type='submit' aria-label='검색'>
                    <img src={searchIcon} alt="검색 아이콘"/>
                </button>
            </form>
            <div className='Main-boxTitle'>
                <span>최근 진행 중인 공동구매</span>

                <span className='Main-LastestBtn active'>최신순</span>
            </div>

            <div className='Main-box'>
                {loading && <p className='Main-status'>모집방을 불러오는 중...</p>}
                {!loading && error && <p className='Main-status Main-error'>{error}</p>}
                {!loading && !error && groups.length === 0 && <p className='Main-status'>진행 중인 모집방이 없습니다.</p>}

                <div className='Main-boxRightside'>
                    {groups.map((group) => (
                        <article key={group.id} className='Main-post' onClick={()=>navigate(`/post/${group.id}`)}>
                            <div className='Main-postPhoto'>{group.imageUrl && <img src={resolveMediaUrl(group.imageUrl)} alt={group.title}/>}</div>

                            <h1>{group.title}</h1>

                            <div className='Main-priceBox'>
                                <span className='Main-beforePrice'>
                                    {(group.price || 0).toLocaleString()}코인
                                </span>
                                <span className='Main-afterPrice'>{(group.perPersonPrice ?? Math.floor(group.price / group.targetCount)).toLocaleString()}코인</span>
                                <span className='Main-count'>{group.perPersonQuantity ?? group.quantity / group.targetCount}개 당</span>
                            </div>

                            <div className='Main-countBox'>
                                <span>모집 인원 <span>{Math.max(0, group.targetCount - group.currentCount)}명</span> 남음</span>
                                <span>남은 시간: <DeadlineTimer deadline={group.deadline} /></span>
                            </div>

                            <button className='Main-joinBtn' disabled={joiningId === group.id || group.status !== 'RECRUITING'} onClick={(event) => joinGroup(event, group)}>{joiningId === group.id ? '참여 중...' : group.status === 'RECRUITING' ? '참여하기' : '모집 완료'}</button>
                        </article>
                    ))}
                </div>

                {totalPages > 1 && <nav className='Main-pagination' aria-label='페이지 이동'>
                    <button disabled={page <= 1} onClick={() => { setLoading(true); setPage((current) => current - 1); }}>이전</button>
                    <span>{page} / {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => { setLoading(true); setPage((current) => current + 1); }}>다음</button>
                </nav>}

                <button className='Main-add' onClick={()=>{
                    navigate('/upload');
                }}>+</button>
            </div>
        </div>
    )
}