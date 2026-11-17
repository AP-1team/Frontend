import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bell from '../assets/bell.png'
import { api, clearAccessToken, getAccessToken, resolveMediaUrl } from '../api.js'

const TABS = [
    { id: 'joined', label: '진행중인 채팅' },
    { id: 'purchases', label: '공구 내역' },
    { id: 'created', label: '내 공구' },
]

export default function UserPage() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState('joined')
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showLogout, setShowLogout] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [showProfileForm, setShowProfileForm] = useState(false)
    const [showChargeForm, setShowChargeForm] = useState(false)
    const [profile, setProfile] = useState({ address: '', phone: '', password: '' })
    const [chargeAmount, setChargeAmount] = useState('30000')

    useEffect(() => {
        if (!getAccessToken()) {
            navigate('/login', { replace: true })
            return
        }
        api.getMe()
            .then((result) => setUser(result?.user || result))
            .catch((requestError) => setError(requestError.message))
    }, [navigate])

    useEffect(() => {
        if (!getAccessToken()) return
        api.getNotifications()
            .then((result) => setUnreadCount(result?.unreadCount || 0))
            .catch(() => {})
    }, [])

    useEffect(() => {
        let cancelled = false
        setError('')
        const request = activeTab === 'purchases'
            ? api.getPurchases().then((result) => result?.purchases || [])
            : api.getMyGroups(activeTab === 'created' ? 'created' : 'joined').then((result) => result?.groups || [])
        request.then((result) => { if (!cancelled) setItems(result) })
            .catch((requestError) => { if (!cancelled) setError(requestError.message) })
            .finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [activeTab])

    const logout = async () => {
        try {
            await api.logout()
        } catch (requestError) {
            if (requestError.status !== 401) setError(requestError.message)
        } finally {
            clearAccessToken()
            navigate('/login', { replace: true })
        }
    }

    const toggleNotifications = async () => {
        if (showNotifications) {
            setShowNotifications(false)
            return
        }
        setShowNotifications(true)
        try {
            const result = await api.getNotifications()
            setNotifications(result?.notifications || [])
            setUnreadCount(result?.unreadCount || 0)
            if ((result?.unreadCount || 0) > 0) {
                await api.readNotifications()
                setUnreadCount(0)
            }
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    const updateProfile = async (event) => {
        event.preventDefault()
        const body = Object.fromEntries(Object.entries(profile).filter(([, value]) => value.trim()))
        if (Object.keys(body).length === 0) {
            setError('변경할 정보를 입력해주세요.')
            return
        }
        try {
            const result = await api.updateMe(body)
            setUser((current) => ({ ...current, ...(result?.user || result) }))
            setProfile({ address: '', phone: '', password: '' })
            setShowProfileForm(false)
            setError('')
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    const chargeCoins = async (event) => {
        event.preventDefault()
        const amount = Number(chargeAmount)
        if (!Number.isInteger(amount) || amount < 1 || amount > 1000000) {
            setError('충전 코인은 1~1,000,000 사이의 정수여야 합니다.')
            return
        }
        try {
            const result = await api.chargeCoins(amount)
            setUser((current) => ({ ...current, coinBalance: result?.coinBalance ?? current.coinBalance }))
            setShowChargeForm(false)
            setError('')
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    const deleteGroup = async (groupId) => {
        if (!window.confirm('이 모집방을 삭제할까요?')) return
        try {
            await api.deleteGroup(groupId)
            setItems((current) => current.filter((item) => item.id !== groupId))
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    return (
        <section className='userPage-container'>
            <div className='userPage-box'>
                <button className='userPage-bellButton' type='button' onClick={toggleNotifications} aria-label='알림 열기'>
                    <img src={bell} className='userPage-bell' alt='알림'/>
                    {unreadCount > 0 && <span className='userPage-unreadDot'/>}
                </button>
                {showNotifications && <div className='alarm-container'>
                    <h2>알림</h2>
                    {notifications.length === 0 ? <p>새 알림이 없습니다.</p> : notifications.map((notification) => (
                        <button className='alarm-item' key={notification.id} onClick={() => navigate(`/userPage/chat/${notification.groupId}`, { state: { openApproval: notification.type === 'PAYMENT_REQUEST' } })}>
                            {notification.imageUrl && <img src={resolveMediaUrl(notification.imageUrl)} alt=''/>}
                            <span>{notification.message || notification.title}</span>
                            {!notification.isRead && <i/>}
                        </button>
                    ))}
                </div>}

                <div className='userPage-userBox'>
                    <div className='userPage-userProfile' aria-hidden='true'/>
                    <div className='userPage-profileRightside'>
                        <span className='userPage-boughtCount'>공동구매 누적 {user?.boughtCount ?? 0}번</span>
                        <div className='userPage-userPageBottom'>
                            <span className='userPage-userName'>{user?.username || '내 계정'}</span>
                            <span className='userPage-coin'>현재 보유 코인: {(user?.coinBalance ?? 0).toLocaleString()}</span>
                            <div className='userPage-btnBox'>
                                <button type='button' onClick={() => setShowProfileForm((current) => !current)}>정보 변경</button>
                                <button type='button' onClick={() => setShowChargeForm((current) => !current)}>코인 충전</button>
                                <button type='button' onClick={() => setShowLogout(true)}>로그아웃</button>
                            </div>
                        </div>
                    </div>
                </div>

                {showProfileForm && <form className='userPage-inlineForm' onSubmit={updateProfile}>
                    <input aria-label='새 주소' placeholder='새 주소' value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })}/>
                    <input aria-label='새 전화번호' placeholder='새 전화번호' value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })}/>
                    <input aria-label='새 비밀번호' placeholder='새 비밀번호' type='password' value={profile.password} onChange={(event) => setProfile({ ...profile, password: event.target.value })}/>
                    <button type='submit'>저장</button>
                </form>}
                {showChargeForm && <form className='userPage-inlineForm' onSubmit={chargeCoins}>
                    <input aria-label='충전할 코인' type='number' min='1' max='1000000' value={chargeAmount} onChange={(event) => setChargeAmount(event.target.value)}/>
                    <button type='submit'>가상 코인 충전</button>
                </form>}

                <div className='userPage-bottomChoice' role='tablist'>
                    {TABS.map((tab) => <button key={tab.id} role='tab' aria-selected={activeTab === tab.id} className={activeTab === tab.id ? 'active' : ''} onClick={() => { setLoading(true); setActiveTab(tab.id); }}>{tab.label}</button>)}
                </div>

                <div className='userPage-bottom userPage-list'>
                    {loading && <p className='userPage-status'>불러오는 중...</p>}
                    {!loading && error && <p className='userPage-status userPage-error'>{error}</p>}
                    {!loading && !error && items.length === 0 && <p className='userPage-status'>표시할 내역이 없습니다.</p>}
                    {!loading && !error && items.map((item) => activeTab === 'purchases' ? (
                        <article className='userPage-row' key={`${item.groupId}-${item.purchasedAt}`}>
                            {item.imageUrl && <img src={resolveMediaUrl(item.imageUrl)} alt=''/>}
                            <strong>{item.title}</strong>
                            <span>{Number(item.amount).toLocaleString()}코인</span>
                            <time>{item.purchasedAt?.slice(0, 10)}</time>
                        </article>
                    ) : (
                        <article className='userPage-row' key={item.id}>
                            {item.imageUrl && <img src={resolveMediaUrl(item.imageUrl)} alt=''/>}
                            <button className='userPage-rowTitle' onClick={() => navigate(activeTab === 'joined' ? `/userPage/chat/${item.id}` : `/post/${item.id}`)}>{item.title}</button>
                            <span>{Math.max(0, item.targetCount - item.currentCount)}명 모집 중</span>
                            {activeTab === 'created' && <button className='userPage-delete' onClick={() => deleteGroup(item.id)}>삭제</button>}
                        </article>
                    ))}
                </div>
                {error && <p className='userPage-feedback'>{error}</p>}
            </div>
            {showLogout && <div className='LOC-container'><div className='LOC-box'>
                <span>로그아웃 하시겠습니까?</span>
                <div className='LOC-btnBox'>
                    <button onClick={logout}>예</button>
                    <button onClick={() => setShowLogout(false)}>아니요</button>
                </div>
            </div></div>}
        </section>
    )
}