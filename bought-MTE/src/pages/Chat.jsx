import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import send from '../assets/send.png'
import { api, createGroupSocketUrl, getAccessToken, resolveMediaUrl } from '../api.js'

export default function Chat() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [messages, setMessages] = useState([])
    const [group, setGroup] = useState(null)
    const [rooms, setRooms] = useState([])
    const [user, setUser] = useState(null)
    const [message, setMessage] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState('')
    const [socketStatus, setSocketStatus] = useState('연결 중')
    const [approvalOpen, setApprovalOpen] = useState(false)

    useEffect(() => {
        if (location.state?.openApproval) setApprovalOpen(true)
    }, [location.key, location.state])

    useEffect(() => {
        if (!getAccessToken()) {
            navigate('/login', { replace: true })
            return
        }
        let cancelled = false
        Promise.all([api.getMe(), api.getGroup(id), api.getMyGroups('joined'), api.getMessages(id, 1)])
            .then(([meResult, groupResult, roomsResult, messagesResult]) => {
                if (cancelled) return
                setUser(meResult?.user || meResult)
                setGroup(groupResult?.group || groupResult)
                setRooms(roomsResult?.groups || [])
                setMessages(messagesResult?.messages || [])
                setPage(messagesResult?.page || 1)
                setTotalPages(messagesResult?.totalPages || 1)
            })
            .catch((requestError) => { if (!cancelled) setError(requestError.message) })
            .finally(() => { if (!cancelled) setLoading(false) })
        return () => { cancelled = true }
    }, [id, navigate])

    useEffect(() => {
        const token = getAccessToken()
        if (!token) return undefined
        const socket = new WebSocket(createGroupSocketUrl(id))
        socket.onopen = () => setSocketStatus('실시간 연결됨')
        socket.onclose = () => setSocketStatus('실시간 연결 끊김')
        socket.onerror = () => setSocketStatus('실시간 연결 오류')
        socket.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data)
                if (payload.type !== 'MESSAGE') return
                const incoming = payload.message || payload.data || payload
                setMessages((current) => current.some((item) => item.id === incoming.id) ? current : [...current, incoming])
            } catch {
                setError('실시간 메시지를 읽을 수 없습니다.')
            }
        }
        return () => socket.close()
    }, [id])

    const loadOlderMessages = async () => {
        if (page >= totalPages) return
        const nextPage = page + 1
        try {
            const result = await api.getMessages(id, nextPage)
            setMessages((current) => [...(result?.messages || []), ...current])
            setPage(nextPage)
            setTotalPages(result?.totalPages || totalPages)
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    const sendMessage = async (event) => {
        event.preventDefault()
        const content = message.trim()
        if (!content || sending) return
        setSending(true)
        setError('')
        try {
            const result = await api.sendMessage(id, content)
            const sentMessage = result?.message || result
            setMessages((current) => current.some((item) => item.id === sentMessage.id) ? current : [...current, sentMessage])
            setMessage('')
        } catch (requestError) {
            setError(requestError.message)
        } finally {
            setSending(false)
        }
    }

    const requestPayment = async () => {
        try {
            const result = await api.requestPayment(id)
            const paymentMessage = result?.message || result
            setMessages((current) => current.some((item) => item.id === paymentMessage.id) ? current : [...current, paymentMessage])
            setError('')
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    const confirmPurchase = async () => {
        try {
            const result = await api.purchaseGroup(id)
            setUser((current) => ({ ...current, coinBalance: result?.coinBalance ?? current.coinBalance }))
            setApprovalOpen(false)
            setError('구매 승인이 완료되었습니다.')
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    const leaveChat = async () => {
        try {
            if (isAuthor) await api.deleteGroup(id)
            else await api.leaveGroup(id)
            navigate('/userPage')
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    const isAuthor = group?.author?.id === user?.id

    return (
        <div className='Chat-container'>
            <div className='Chat-box'>
                <aside className='Chat-chatList'>
                    <h2>내 채팅</h2>
                    {rooms.map((room) => <button key={room.id} className={String(room.id) === id ? 'Chat-room active' : 'Chat-room'} onClick={() => navigate(`/userPage/chat/${room.id}`)}>
                        {room.imageUrl && <img src={resolveMediaUrl(room.imageUrl)} alt=''/>}
                        <span>{room.title}</span>
                    </button>)}
                    {rooms.length === 0 && <p>참여 중인 모집방이 없습니다.</p>}
                </aside>

                <section className='Chat-chatBox'>
                    <header className='Chat-roomHeader'>
                        <div><h1>{group?.title || '모집방 채팅'}</h1><span>{socketStatus}</span></div>
                        <button type='button' onClick={leaveChat}>{isAuthor ? '모집방 삭제' : '채팅 나가기'}</button>
                    </header>
                    <div className='Chat-messages'>
                        {page < totalPages && <button className='Chat-older' onClick={loadOlderMessages}>이전 대화 불러오기</button>}
                        {loading && <p>대화 내용을 불러오는 중...</p>}
                        {!loading && messages.length === 0 && <p>첫 메시지를 보내 대화를 시작하세요.</p>}
                        {messages.map((item, index) => {
                            const ownMessage = item.userId === user?.id
                            if (item.messageType === 'PAYMENT_REQUEST') return <article className='Chat-paymentCard' key={item.id ?? `payment-${index}`}>
                                {group?.imageUrl && <img src={resolveMediaUrl(group.imageUrl)} alt=''/>}
                                <div><strong>{group?.title}</strong><span>1인 부담 {group?.perPersonPrice?.toLocaleString() ?? Math.floor(group?.price / group?.targetCount).toLocaleString()}코인</span></div>
                                {!isAuthor && <button onClick={() => setApprovalOpen(true)}>결제 승인</button>}
                            </article>
                            return <div key={item.id ?? `message-${index}`} className={`Chat-chat ${ownMessage ? 'my' : 'other'}`}>
                                {!ownMessage && <div className='Chat-profile' aria-hidden='true'/>}
                                <div><span className='Chat-username'>{ownMessage ? '나' : item.username}</span><div className='Chat-text'>{item.content}</div></div>
                            </div>
                        })}
                    </div>
                    {error && <p className='Chat-feedback'>{error}</p>}
                    <form className='Chat-inputBox' onSubmit={sendMessage}>
                        {isAuthor && <button type='button' className='Chat-applyBtn' disabled={group?.status !== 'COMPLETED'} onClick={requestPayment}>구매 신청</button>}
                        <textarea rows='1' maxLength={500} placeholder='메시지를 입력하세요' onChange={(event) => setMessage(event.target.value)} value={message}/>
                        <button type='submit' className='Chat-submit' disabled={sending || !message.trim()} aria-label='메시지 전송'><img src={send} alt='전송'/></button>
                    </form>
                </section>
            </div>
            {approvalOpen && <div className='LOC-container'><div className='LOC-box Chat-approval'>
                <h2>구매 승인</h2>
                {group?.imageUrl && <img src={resolveMediaUrl(group.imageUrl)} alt={group.title}/ >}
                <strong>{group?.title}</strong>
                <span>결제 금액: {(group?.perPersonPrice ?? Math.floor(group?.price / group?.targetCount)).toLocaleString()}코인</span>
                <p>승인 시 최초 공동구매 모집자에게 결제 금액이 전달됩니다.</p>
                <div className='LOC-btnBox'><button onClick={confirmPurchase}>승인</button><button onClick={() => setApprovalOpen(false)}>취소</button></div>
            </div></div>}
        </div>
    )
}