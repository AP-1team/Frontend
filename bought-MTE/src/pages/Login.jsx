import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import { api, setAccessToken } from '../api.js'


export default function Login() {
    const navigate = useNavigate();

    const [userID, setUserID] = useState("");
    const [userPW, setUserPW] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const LoginClicked = async (e) => {
        e.preventDefault();

        if(userID === "") {
            setError("아이디를 입력해주세요");
            return;
        }
        else if(userPW === "") {
            setError("비밀번호를 입력해주세요");
            return;
        }

        setSubmitting(true);
        setError("");
        try {
            const result = await api.login({ username: userID, password: userPW });
            if (!result?.accessToken) throw new Error('로그인 응답에 토큰이 없습니다.');
            setAccessToken(result.accessToken);
            navigate('/');
        } catch (requestError) {
            setError(requestError.message || '아이디 또는 비밀번호를 확인해주세요.');
        } finally {
            setSubmitting(false);
        }
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
                    <form className='Login-inputBox' onSubmit={LoginClicked}>
                        <div className='Login-IDBox'>
                            <label htmlFor='Login-ID'>아이디:</label>
                            <input id='Login-ID' autoComplete='username' onChange={(e)=>{
                                setUserID(e.target.value);
                                setError("");
                            }} value={userID}/>
                        </div>

                        <div className='Login-IDBox Login-PWBox'>
                            <label htmlFor='Login-PW'>비밀번호:</label>
                            <input id='Login-PW' type='password' autoComplete='current-password' onChange={(e)=>{
                                setUserPW(e.target.value);
                                setError("");
                            }} value={userPW}/>
                        </div>
                        
                        <div className='Login-submitBox'>
                            <button id='Login-submitButton' type='submit' disabled={submitting}>{submitting ? '로그인 중...' : '로그인'}</button>
                            <span>{error}</span>
                        </div>

                        <Link to='/sign' className='Login-signButton'>회원 가입하러가기</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}   
