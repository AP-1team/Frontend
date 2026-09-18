import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react'


export default function Login() {

    const [userID, setUserID] = useState("");
    const [userPW, setUserPW] = useState("");
    const [error, setError] = useState(" ");

    const LoginClicked = (e) => {
        e.preventDefault();

        if(userID === "") {
            setError("아이디를 입력해주세요");
            return;
        }
        else if(userPW === "") {
            setError("비밀번호를 입력해주세요");
            return;
        }

        fetch('/api/auth/login', {
            method: "POST",
            body: JSON.stringify({
                "username": userID,
                "password": userPW
            })
        })
        .then(res => res.json())
        .then(res => {
            if(res.success) {
                console.log("로그인 성공");
            }
            else {
                setError("존재하지 않는 계정입니다.");
            }
        })
        .catch(error => {
            console.log("로그인 중 에러 발생",error);
            setError("서버와 통신할 수 없습니다.");
        })
    }

    return (
        <div className='Login-container'>
            <div className='Login-leftside'>
                <div className='Login-leftBox'>

                </div>
            </div>
            <div className='Login-rightside'>
                <div className='Login-rightBox'>
                    <span>로그인</span>
                    <div className='Login-inputBox'>
                        <div className='Login-IDBox'>
                            <label for='Login-ID'>아이디:</label>
                            <input id='Login-ID' onChange={(e)=>{
                                setUserID(e.target.value);
                                setError("");
                            }} value={userID}/>
                        </div>

                        <div className='Login-IDBox Login-PWBox'>
                            <label for='Login-ID'>비밀번호:</label>
                            <input id='Login-PW' type='password' onChange={(e)=>{
                                setUserPW(e.target.value);
                                setError("");
                            }} value={userPW}/>
                        </div>
                        
                        <div className='Login-submitBox'>
                            <button id='Login-submitButton' onClick={LoginClicked}>로그인</button>
                            <span>{error}</span>
                        </div>

                        <Link to='/sign' className='Login-signButton'>회원 가입하러가기</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}   
