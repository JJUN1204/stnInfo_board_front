import '../css/common.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import axios from 'axios';
import PasswordModal from '../component/popUpEvent/PasswordModal';
import EditCommentPopUp from '../component/popUpEvent/EditCommentPopUp';
import BoardReply from './boardReply';

function BoardView() {
    //IDX 피람 깂
    const { boardIdx } = useParams();
    const navigate = useNavigate();

    const [boardViewData, setBoardViewData] = useState({});
    const [fileNames, setFileNames] = useState([]);
    const [comment, setComment] = useState('');
    const [commentLists, setCommentLists] = useState([]);
    const [commentPwd, setCommentPwd] = useState('');
    const [selectedComment, setSelectedComment] = useState({});
    const [commentIdx, setCommentIdx] = useState('');
    
    const [isReply, setIsReply] = useState(false);
    
    const [isBoardDelOpen, setIsBoardDelOpen] = useState(false);
    const [modalAction, setModalAction] = useState('');

    const [isCommentEditOpen, setIsCommentEditOpen] = useState(false);

    useEffect(() => {
        getBoardIdx();
        getFileName();
        getComments();
    }, [boardIdx, commentIdx]);

    const openBoardModal = (action, commentIdx) => {
        setModalAction(action);
        setCommentIdx(commentIdx);
        setIsBoardDelOpen(true);
    }

    const openReplyModal = () => {
        navigate(`/boardview/${boardIdx}/boardReply`);
    }

    const closeBoardModal = () => {
        setIsBoardDelOpen(false);
    }

    const openCommentEditModal = (commentIdx) => {
        setCommentIdx(commentIdx);
        setIsCommentEditOpen(true);
    }

    const closeCommentEditModal = () => {
        setIsCommentEditOpen(false);
    }

    const refreshComments = () => {
        getComments();
    }

    const getBoardIdx = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getBoardIdx?idx=${boardIdx}`);
            setBoardViewData(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    const getFileName = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getFileNames?boardIdx=${boardIdx}`);
            setFileNames(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    const generateRandomName = () => {
        const firstNames = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임"];
        const lastNames = ["민수", "서연", "지훈", "하늘", "지민", "도현", "예지", "현우", "수빈", "준호"];

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        return `${firstName} ${lastName}`;
    };

    const addComment = async () => {
        try {
            if (comment === "") {
                alert("비어있는 입력란이 있습니다.");
                return;
            }

            const writerId = generateRandomName();

            const response = await axios.post('http://localhost:8081/addComment', { 
                boardIdx: boardIdx,
                comment: comment,
                pwd: commentPwd,
            });

            if (response.data.result === "ADD_COMMENT_COMPLETE") {
                setComment("");
                setCommentPwd("");
                getComments();
            }

        } catch (e) {
            console.log(e);
        }
    };

    const getComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getCommentByBoardIdx?boardIdx=${boardIdx}`);
            setCommentLists(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    const downloadImage = async (item) => {
        const apiUrl = "http://localhost:8081/image/download?fileName=" + item;

        try {
            const response = await axios.get(apiUrl, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: "application/octet-stream" });
            const url = window.URL.createObjectURL(blob);

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.setAttribute('download', item.split("=")[1]);

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <>
            <div id="WrapTitle">
                <div className="container">
                    <h1 className="logo">STN INFOTECH</h1>
                </div>
            </div>
            <div id="WrapContainer">
                <div className="container">
                    <div className="wrap_tit">
                        <h2 className="tit_cont">자유게시판</h2>
                    </div>
                    <div className="wrap_view">
                        <dl className="view_tit">
                            <dt>제목</dt>
                            <dd><h3 className="tit">{boardViewData.title}</h3></dd>
                        </dl>
                        <dl className="view_info">
                            <dt>작성자</dt>
                            <dd>{boardViewData.writerId}</dd>
                            <dt>이메일</dt>
                            <dd><a href="#">{boardViewData.email}</a></dd>
                            <dt>작성일</dt>
                            <dd>{boardViewData.createAt}</dd>
                            <dt>조회수</dt>
                            <dd>{boardViewData.view}</dd>
                        </dl>
                        <div className="view_cont">
                            {typeof boardViewData.content === 'string' ? parse(boardViewData.content) : null}
                        </div>

                        <div className="view_file">
                            <strong className="tit_file"><span className="ico_img file">첨부파일</span>첨부파일 :</strong>
                            {fileNames.map((fileName, index) => (
                                <a key={index} onClick={() => downloadImage(fileName)}>{fileName.split("=")[1]}</a>
                            ))}
                        </div>
                    </div>

                    <div className="wrap_reply">
                        <div className="reply_tit">
                            <strong className="tit">댓글({commentLists.length})</strong>
                        </div>
                        <div className="reply_cont">
                            <ul className="list_reply">
                                {commentLists.map((comment, index) => (
                                    <li key={index}>
                                        <div className="info">
                                            <strong>유저</strong><span className="fc_g ml_5">{comment.createAt}</span>
                                            <span className="ml_10">
                                                <button className="comm_btn_small" onClick={() => openBoardModal('deleteComment', comment.idx)}>삭제</button>
                                                <button className="comm_btn_small" onClick={() => openCommentEditModal(comment.idx)}>수정</button>
                                            </span>
                                        </div>
                                        <div className="cont">
                                            {comment.comment}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <form>
                            <fieldset className="blind">댓글작성</fieldset>
                            <div className="reply_write">
                                <div className="wr_cont">
                                    <textarea className="comm_textarea" onChange={(e) => setComment(e.target.value)} value={comment}></textarea>
                                </div>
                                <div className="wr_btn">
                                    비밀번호 <input type="password" className="comm_inp_text" onChange={(e) => setCommentPwd(e.target.value)} value={commentPwd} />
                                    <button type="button" className="comm_btn_round fill" onClick={addComment}>등록</button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="comm_paging_btn">
                        <div className="flo_side left">
                            <button className="comm_btn_round fill"><Link to='/' style={{color:"white"}}>목록</Link></button>
                            <button className="comm_btn_round" onClick={() => openBoardModal('delete')}>삭제</button>
                        </div>
                        <div className="flo_side right">
                            <button className="comm_btn_round fill" onClick={() => openReplyModal()} disabled={boardViewData.isAlert === 1}>답글</button>
                            <button className="comm_btn_round fill" onClick={() => openBoardModal('update')}>수정</button>
                        </div>
                    </div>
                </div>
            </div>

            {isBoardDelOpen &&
                <PasswordModal isOpen={isBoardDelOpen} closeModal={closeBoardModal} boardIdx={boardIdx} modalAction={modalAction} commentIdx={commentIdx} refreshComments={refreshComments} openCommentEditModal={openCommentEditModal}></PasswordModal>
            }

            {isCommentEditOpen &&
                <EditCommentPopUp 
                    getComments={getComments}
                    isOpen={isCommentEditOpen}
                    closeModal={closeCommentEditModal}
                    commentIdx={commentIdx}
                ></EditCommentPopUp>
            }

        
            
        </>
    );
}

export default BoardView;
