import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditCommentPopUp({ getComments, isOpen, closeModal, commentIdx }) {

    useEffect(() => {
        getCommentsByIdx();
    }, []);

    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [comment, setComment] = useState('');

    const getCommentsByIdx = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getCommentByIdx?idx=${commentIdx}`);
            setComment(response.data.comment); // 초기 comment 상태 설정
        } catch (e) {
            console.log(e);
        }
    };

    const commentUpdate = async () => {
        try {
            const response = await axios.put('http://localhost:8081/updateComment', null, {
                params: {
                    idx: commentIdx,
                    pwd: password,
                    comment: comment
                }
            });
            console.log(response.data);
            if (response.data.result === "UPDATE_COMMENT_COMPLETE") {
                closeModal();
                getComments();
                //navigate(`/boardview/${boardIdx}`); // 수정이 완료되면 해당 게시글로 이동합니다.
            } else if (response.data.result === "false") {
                alert("비밀번호가 일치하지 않습니다.");
            }
        } catch (e) {
            console.log(e);
        }
    };
    

    if (!isOpen) return null;

    return (
        <>
            <fieldset className="blind">댓글 수정</fieldset>
            <div className="comm_popup" style={{ "width": "400px" }}>
                <div className="wrap_tit">
                    <span className="tit_pop">댓글 수정</span>
                    <button type="button" className="btn_close" onClick={closeModal}>닫기</button>
                </div>
                <div className="wrap_cont">
                    <table className="tbl_pop">
                        <tbody>
                            <tr>
                                <th>비밀번호</th>
                                <td><input type="password" className="comm_inp_text" style={{ "width": "100%" }} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력해주세요." /></td>
                            </tr>
                            <tr>
                                <th>내용</th>
                                <td>
                                    <textarea className="comm_textarea" style={{ "width": "100%", "height": "90px" }} value={comment} onChange={(e) => setComment(e.target.value)} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="wrap_bottom">
                    <button className="comm_btn_round" onClick={closeModal}>닫기</button>
                    <button className="comm_btn_round fill" onClick={commentUpdate}>보내기</button>
                </div>
            </div>
        </>
    );
}

export default EditCommentPopUp;
