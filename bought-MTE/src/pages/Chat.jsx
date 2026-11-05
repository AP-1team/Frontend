import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet, useParams } from 'react-router-dom';

import send from '../assets/send.png'


export default function Chat() {

    const { roomId } = useParams();
    const [chat, setChat] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [enteringText, setEnteringText] = useState(null);

    useEffect(() => {
        fetch('/jjabUser.json')
            .then((res) => {
                if(!res.ok) {
                    throw new Error("유저 정보를 불러오지 못했습니다.");
                }
                return res.json();
            })
            .then((data) => {
                setUser(data.data.user);
            })
            .catch((err) => {
                console.error("로그인 중 에러 발생:",err);
            })
    }, []);

    useEffect(() => {
        fetch('/jjabChat.json')
            .then((res) => {
                if(!res.ok) throw new Error("채팅 불러오기 실패");
                return res.json();
            })
            .then((result) => {
                if(result.success) {
                    setChat(result.data.messages);
                    setPage(result.page);
                    setTotalPage(result.totalPages);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("에러 발생:",err);
                setLoading(false);
            })
    },[roomId, page]);

    const messageSent = () => {
        fetch('/api/groups/10/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "content": enteringText
            })
        })
        .then((res) => res.json())
        .catch((err) => {
            console.error("채팅을 보내다 에러 발생:",err);
        })
    }

    return (
        <div className='Chat-container'>
            <div className='Chat-box'>
                <div className='Chat-chatList'>

                </div>

                <div className='Chat-chatBox'>
                    {loading && (
                        <p>로딩 중...</p>
                    )}

                    {chat?.map((msg) => {
                        const ismyMessage = msg.userId === user?.id;

                        return (
                            <div key={msg.id} className={`Chat-chat ${ismyMessage ? "my" : "other"}`}>
                                {!ismyMessage && (
                                    <div className='Chat-profile'></div>
                                )}
                                <div className='Chat-text'>{msg.content}</div>
                            </div>
                        )
                    })}

                    <div className='Chat-inputBox'>
                        <button className='Chat-applyBtn'>
                            구매 신청
                        </button>
                        <textarea rows='1' onChange={(e)=>{
                            setEnteringText(e.target.value);
                        }} value={enteringText}/>
                        <button type='button' className='Chat-submit' onClick={()=>{
                            messageSent();
                        }}>
                            <img src={send}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}