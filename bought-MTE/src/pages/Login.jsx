import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';



export default function Login() {

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
                            <input id='Login-ID'/>
                        </div>

                        <div className='Login-IDBox'>
                            <label for='Login-ID'>비밀번호:</label>
                            <input id='Login-PW' type='password'/>
                        </div>

                        <button id='Login-submitButton'>로그인</button>

                        <Link to='/sign' className='Login-signButton'>회원 가입하러가기</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}