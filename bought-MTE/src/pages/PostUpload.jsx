import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function PostUpload() {

    const navigate = useNavigate();

    const [postName, setPostName] = useState("");
    const [price, setPrice] = useState("");
    const [people, setPeople] = useState("");
    const [quantity, setQuantity] = useState("");
    const [deadline, setDeadline] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const [error, setError] = useState("");
    const [image, setImage] = useState("");
    const [submitting, setSubmitting] = useState(false);


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

    const selectImage = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
            setError('PNG, JPEG, WEBP 형식의 5MB 이하 이미지만 올릴 수 있습니다.');
            event.target.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setImage(String(reader.result));
        reader.onerror = () => setError('이미지를 읽지 못했습니다.');
        reader.readAsDataURL(file);
        setError('');
    };

    const submit = async (event) => {
        event.preventDefault();
        if (postName === "") {
            setError("상품명을 입력해주세요");
            return;
        }
        else if(price === "" || Number(price) < 1) {
            setError("가격을 입력해주세요");
            return;
        }
        else if(Number(people) < 2 || Number(people) > 50) {
            setError("모집 인원은 2~50명이어야 합니다.");
            return;
        }
        else if(quantity === "" || Number(quantity) % Number(people) !== 0) {
            setError("총 수량은 모집 인원으로 나누어 떨어져야 합니다.");
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
        setSubmitting(true);
        try {
            await api.createGroup({
                title: postName,
                description,
                price: Number(price),
                targetCount: Number(people),
                quantity: Number(quantity),
                deadline: deadline.length === 16 ? `${deadline}:00` : deadline,
                region: location,
                image: image || undefined,
            });
            navigate('/');
        } catch (requestError) {
            setError(requestError.message || '모집방 등록에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className='Post-container'>
            <div className='Post-box'>
                <section className='Post-leftside'>
                    <label className='Post-image Upload-image'>
                        {image ? <img src={image} alt='상품 미리보기'/> : '이미지 추가하기'}
                        <input type='file' accept='image/png,image/jpeg,image/webp' onChange={selectImage}/>
                    </label>

                    <button className='Post-chatBtn' type='submit' form='group-create-form' disabled={submitting}>{submitting ? '등록 중...' : '완료'}</button>
                    <p className='Post-errorText'>{error}</p>
                </section>

                <form id='group-create-form' className='Upload-rightside' onSubmit={submit} style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.7rem",
                }}>
                    <div>
                        <label htmlFor="Upload-postName">상품명:</label>
                        <input id='Upload-postName' maxLength={100}
                        placeholder='상품명을 입력해주세요' onChange={(e) => {
                            setPostName(e.target.value);
                            inputHandle();
                        }} value={postName}/>
                    </div>

                    <div>
                        <label htmlFor="Upload-price">가격:</label>
                        <input id='Upload-price' min='1'
                        placeholder='가격을 입력해주세요' onChange={(e) => {
                            setPrice(e.target.value);
                            inputHandle();
                        }} value={price}
                        type='number'/>
                    </div>

                    <div>
                        <label htmlFor="Upload-people">모집 인원:</label>
                        <input id='Upload-people' min='2' max='50'
                        placeholder='인원수를 입력해주세요' onChange={(e) => {
                            setPeople(e.target.value);
                            inputHandle();
                        }} value={people}
                        type='number'/>
                    </div>

                    <div>
                        <label htmlFor="Upload-quantity">총 수량:</label>
                        <input id='Upload-quantity' min='1' type='number' placeholder='상품 전체 수량' onChange={(e) => { setQuantity(e.target.value); inputHandle(); }} value={quantity}/>
                    </div>

                    <div>
                        <label htmlFor="Upload-deadline">마감 기한:</label>
                        <input id='Upload-deadline' type='datetime-local' min={new Date().toISOString().slice(0, 16)}
                        placeholder='' onChange={(e) => {
                            setDeadline(e.target.value);
                            inputHandle();
                        }} value={deadline}/>
                    </div>

                    <div>
                        <label htmlFor="Upload-location">모집 지역:</label>
                        <input id='Upload-location' maxLength={100}
                        placeholder='모집 지역을 명시해주세요' onChange={(e) => {
                            setLocation(e.target.value);
                            inputHandle();
                        }} value={location}/>
                    </div>

                    <div>
                        <label htmlFor="Upload-des">상품 설명:</label>
                        <textarea id='Upload-des'
                        ref={textAreaRef}
                        placeholder='상품 설명을 입력해주세요'
                        onInput={handleResize}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            inputHandle();
                        }} value={description}
                        rows="1" maxLength={2000}/>
                    </div>

                </form>
            </div>
        </main>
    )
}

