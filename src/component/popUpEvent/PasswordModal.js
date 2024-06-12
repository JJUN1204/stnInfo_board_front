import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PasswordModal({ isOpen, closeModal, boardIdx, modalAction, openFileModal, commentIdx, refreshComments }) {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const checkPassword = async (password, boardIdx, commentIdx = null) => {
        try {
            const response = await axios.post('http://localhost:8081/checkPassword', null, {
                params: { boardIdx: boardIdx, password: password, idx: commentIdx }
            });
            return response.data;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    const handlePasswordSubmit = async () => {
        const isValidPassword = await checkPassword(password, boardIdx, modalAction.includes('Comment') ? commentIdx : null);
        if (!isValidPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            setPassword('');
            return;
        }

        console.log(modalAction)

        if (modalAction === 'private') {
            navigate(`/boardview/${boardIdx}`);
        } else if (modalAction === 'file') {
            openFileModal(boardIdx);
        } else if (modalAction === 'update') {
            navigate(`/boardview/${boardIdx}/boardEdit`);
        } else if (modalAction === 'delete') {
            try {
                const response = await axios.delete(`http://localhost:8081/deleteBoard?idx=${boardIdx}`);
                if (response.data.result === "DELETE_COMPLETE") {
                    navigate('/'); // 홈으로 이동
                }else{
                    alert(response.data.result);
                }
            } catch (e) {
                console.log(e);
            }
        } else if(modalAction === 'reply'){
            navigate(`/boardview/${boardIdx}/boardReply`);
        } else if (modalAction === 'deleteComment') {
            try {
                const response = await axios.delete(`http://localhost:8081/deleteCommentByIdx?idx=${commentIdx}`);
                if (response.data.result === "DELETE_COMMENT_COMPLETE") {
                    refreshComments();
                }
            } catch (e) {
                console.log(e);
            }
        } 

        closeModal();
    };

    if (!isOpen) return null;

    return (
        <div className="comm_popup">
            <div className="wrap_tit">
                <span className="tit_pop">비밀번호 확인</span>
                <button type="button" className="btn_close" onClick={closeModal}>닫기</button>
            </div>
            <div className="wrap_cont">
                비밀번호 <input type="password" className="comm_inp_text" style={{ width: '100px' }} onChange={(e) => setPassword(e.target.value)} value={password} />
            </div>
            <div className="wrap_bottom">
                <button className="comm_btn_round" onClick={closeModal}>닫기</button>
                <button className="comm_btn_round fill" onClick={handlePasswordSubmit}>확인</button>
            </div>
        </div>
    );
}

export default PasswordModal;
