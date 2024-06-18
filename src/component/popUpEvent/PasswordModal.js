import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PasswordModal({ isOpen, closeModal, boardIdx, modalAction, openFileModal, commentIdx, refreshComments }) {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handlePasswordSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8081/processAction', null, {
                params: {
                    action: modalAction,
                    password: password,
                    boardIdx: boardIdx,
                    commentIdx: modalAction.includes('Comment') ? commentIdx : null
                }
            });

            if (response.data.result === "PASSWORDERROR") {
                alert("비밀번호가 일치하지 않습니다.");
                setPassword('');
                return;
            }

            switch (response.data.result) {
                case 'PRIVATE_ACCESS':
                    navigate(`/boardview/${boardIdx}`);
                    break;
                case 'FILE_ACCESS':
                    openFileModal(boardIdx);
                    break;
                case 'UPDATE_ACCESS':
                    navigate(`/boardview/${boardIdx}/boardEdit`);
                    break;
                case 'DELETE_COMPLETE':
                    navigate('/');
                    break;
                case 'DELETE_COMMENT_COMPLETE':
                    refreshComments();
                    break;
                default:
                    alert("오류");
                    break;
            }
        } catch (e) {
            console.log(e);
            alert("오류");
        } finally {
            closeModal();
        }
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
