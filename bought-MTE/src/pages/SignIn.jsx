import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';

export default function Sign() {
    const navigate = useNavigate();

    const [userID, setUserID] = useState("");
    const [userPW, setUserPW] = useState("");
    const [userPh, setUserPh] = useState("");
    const [userAddress, setUserAddress] = useState("");
    const [error, setError] = useState(" ");

    // 카카오 우편번호 설정
    const scriptUrl = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    const open = useDaumPostcodePopup(scriptUrl);

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') extraAddress += data.bname;
            if (data.buildingName !== '') {
                extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }
        setUserAddress(fullAddress);
    };

    const handleAddressClick = () => {
        open({ onComplete: handleComplete });
    };

    const SignClicked = (e) => {
        e.preventDefault();

        if (userID === "") {
            setError("아이디를 입력해주세요");
            return;
        } else if (userPW === "") {
            setError("비밀번호를 제대로 입력해주세요");
            return;
        } else if (userPh === "" || userPh.length < 11) {
            setError("전화번호를 제대로 입력해주세요");
            return;
        } else if (userAddress === "") {
            setError("주소를 입력해주세요");
            return;
        }

        fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": userID,
                "password": userPW,
                "phone": userPh,
                "address": userAddress,
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.success) {
                console.log("회원가입 성공");
                navigate('/login');
            } else {
                console.log("회원가입 실패");
                setError("회원가입에 실패했습니다.");
            }
        })
        .catch((err) => {
            console.error("회원가입 중 에러 발생:", err);
            setError("서버와 통신할 수 없습니다.");
        });
    }

    const phoneInput = (value) => {
        const number = value.replace(/[^\d]/g, '');

        if (number.length <= 3) {
            setUserPh(number);
        } else if (number.length <= 7) {
            setUserPh(`${number.slice(0, 3)}-${number.slice(3)}`);
        } else if (number.length <= 11) {
            setUserPh(`${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7, 11)}`);
        } else {
            setUserPh(`${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7, 11)}`);
        }
    }

    return (
        <div className='Login-container'>
            <div className='Login-leftside'>
                <div className='Login-leftBox'></div>
            </div>
            <div className='Login-rightside'>
                <div className='Login-rightBox'>
                    <span>회원가입</span>
                    <div className='Login-inputBox'>
                        <div className='Login-IDBox'>
                            <label htmlFor='Login-ID'>아이디:</label>
                            <input id='Login-ID' onChange={(e) => {
                                setUserID(e.target.value);
                                setError("");
                            }} value={userID} />
                        </div>

                        <div className='Login-IDBox'>
                            <label htmlFor='Login-phone'>전화번호:</label>
                            <input id='Login-phone' onChange={(e) => {
                                phoneInput(e.target.value);
                                setError("");
                            }} value={userPh} maxLength={13} />
                        </div>

                        <div className='Login-IDBox'>
                            <label htmlFor='Login-address'>주소:</label>
                            <div>
                                <input 
                                    id='Login-address' 
                                    type='text'
                                    placeholder='주소 검색을 누르세요'
                                    value={userAddress}
                                    readOnly 
                                />
                                <button type="button" onClick={handleAddressClick} className='Login-addressBtn'>
                                    주소 검색
                                </button>
                            </div>
                        </div>

                        <div className='Login-IDBox Login-PWBox'>
                            <label htmlFor='Login-PW'>비밀번호:</label>
                            <input id='Login-PW' type='password' onChange={(e) => {
                                setUserPW(e.target.value);
                                setError("");
                            }} value={userPW} />
                        </div>
                        
                        <div className='Login-submitBox'>
                            <button id='Login-submitButton' onClick={SignClicked}>회원가입</button>
                            <span>{error}</span>
                        </div>

                        <Link to='/login' className='Login-signButton'>로그인 하러가기</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}