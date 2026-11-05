import { useState, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

export default function PostUpload() {

    const [postName, setPostName] = useState("");
    const [price, setPrice] = useState("");
    const [people, setPeople] = useState("");
    const [deadline, setDeadline] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const [error, setError] = useState("");

    const Upload = () => {

    }

    const textAreaRef = useRef(null);

    const handleResize = () => {
        const textarea = textAreaRef.current;
        if(textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    const inputHandle = () => {
        setError("");
    }

    const submit = () => {
        if (postName === "") {
            setError("상품명을 입력해주세요");
            return;
        }
        else if(price === "") {
            setError("가격을 입력해주세요");
            return;
        }
        else if(people === "") {
            setError("인원을 입력해주세요");
            return;
        }
        else if(deadline === "") {
            setError("마감 기한을 입력해주세요");
            return;
        }
        else if(location === "") {
            setError("모집 지역을 입력해주세요");
            return;
        }
        else if(description === "") {
            setError("상품설명을 입력해주세요");
            return;
        }
    }

    return (
        <main className='Post-container'>
            <div className='Post-box'>
                <section className='Post-leftside'>
                    <div className='Post-image Upload-image'>이미지 추가하기</div>

                    <button className='Post-chatBtn' onClick={()=>{
                        submit();
                    }}>완료</button>
                    <p className='Post-errorText'>{error}</p>
                </section>

                <section className='Upload-rightside'>
                    <div>
                        <label for="Upload-postName">상품명:</label>
                        <input id='Upload-postName'
                        placeholder='상품명을 입력해주세요' onChange={(e) => {
                            setPostName(e.target.value);
                            inputHandle();
                        }} value={postName}/>
                    </div>

                    <div>
                        <label for="Upload-price">가격:</label>
                        <input id='Upload-price'
                        placeholder='가격을 입력해주세요' onChange={(e) => {
                            setPrice(e.target.value);
                            inputHandle();
                        }} value={price}/>
                    </div>

                    <div>
                        <label for="Upload-people">인원:</label>
                        <input id='Upload-people'
                        placeholder='인원수를 입력해주세요' onChange={(e) => {
                            setPeople(e.target.value);
                            inputHandle();
                        }} value={people}/>
                    </div>

                    <div>
                        <label for="Upload-deadline">마감 기한:</label>
                        <input id='Upload-deadline' type='date'
                        placeholder='' onChange={(e) => {
                            setDeadline(e.target.value);
                            inputHandle();
                        }} value={deadline}/>
                    </div>

                    <div>
                        <label for="Upload-location">모집 지역:</label>
                        <input id='Upload-location'
                        placeholder='모집 지역을 명시해주세요' onChange={(e) => {
                            setLocation(e.target.value);
                            inputHandle();
                        }} value={location}/>
                    </div>

                    <div>
                        <label for="Upload-des">상품 설명:</label>
                        <textarea id='Upload-des'
                        ref={textAreaRef}
                        placeholder='상품 설명을 입력해주세요'
                        onInput={handleResize}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            inputHandle();
                        }} value={description}
                        rows="1"/>
                    </div>

                </section>
            </div>
        </main>
    )
}

