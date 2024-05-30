import '../css/common.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import parse from 'html-react-parser';
import axios from 'axios';

function BoardView() {
    // URL에서 boardIdx를 가져오기 위해 useParams 훅 사용
    const { boardIdx } = useParams();

    // 상태 변수 정의
    const [boardViewData, setBoardViewData] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [modalAction, setModalAction] = useState('');
    const [fileNames, setFileNames] = useState([]);
    const navigate = useNavigate();
    const [comment, setComment] = useState('');
    const [commentLists, setCommentLists] = useState([]);
    const [commentPwd, setCommentPwd] = useState('');

    
    const [selectedComment, setSelectedComment] = useState({});
    const [passWord, setPassWord] = useState('');

    // 컴포넌트가 마운트되거나 boardIdx가 변경될 때 실행되는 useEffect
    useEffect(() => {
        getBoardIdx(); // 게시글 정보 가져오기
        getFileName(); // 첨부 파일 이름 가져오기
        getComments(); // 댓글 목록 가져오기
    }, [boardIdx]);

    // 모달 열기
    const openModal = (action, comment) => {
        setModalAction(action);
        setSelectedComment(comment);
        console.log(selectedComment.pwd);
        console.log(selectedComment.idx);
        setIsOpen(true);
        
    }

    // 모달 닫기
    const closeModal = () => {
        setIsOpen(false);
        setPassWord('');
    }

    // 게시글 정보 가져오기
    const getBoardIdx = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getBoardIdx?idx=${boardIdx}`);
            setBoardViewData(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    // 비밀번호 확인 후 작업 수행
    const passWordTestForBoard = async () => {
        // 비밀번호 일치 여부 확인
        if (passWord !== boardViewData.pwd) {
            alert("비밀번호가 일치하지 않습니다.");
            setPassWord('');
            return;
        }

        // 모달 액션에 따른 작업 수행
        if (modalAction === 'update') {
            navigate(`/boardview/${boardIdx}/boardEdit`); // 게시글 수정 페이지로 이동
        } else if (modalAction === 'delete') {
            try {
                const response = await axios.delete(`http://localhost:8081/deleteBoard?idx=${boardIdx}`);
                if (response.data.result === "DELETE_COMPLETE") {
                    navigate('/'); // 홈으로 이동
                }
            } catch (e) {
                console.log(e);
            }
        }
    };

    // 댓글 패스워드 테스트
    const passWordTestForComment = async () => {
        
        // 비밀번호 일치 여부 확인
        if (passWord !== selectedComment.pwd) {
            alert("비밀번호가 일치하지 않습니다.");
            setPassWord('');
            return;
        }

        // 모달 액션에 따른 작업 수행
        if (modalAction === 'deleteComment') {
            deleteComment(selectedComment.idx); // 선택된 댓글 삭제
        } else if (modalAction === 'updateComment') {

        }
    };

    // 첨부 파일 이름 가져오기
    const getFileName = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getFileNames?boardIdx=${boardIdx}`);
            setFileNames(response.data);
            console.log(fileNames);
        } catch (e) {
            console.log(e);
        }
    };

    // 댓글 추가
    const addComment = async () => { 
        try {
            if (comment === "") {
                alert("비어있는 입력란이 있습니다.");
                return;
            }

            const response = await axios.post('http://localhost:8081/addComment', { 
                boardIdx: boardIdx,
                comment: comment,
                pwd: commentPwd
            });

            if (response.data.result === "ADD_COMMENT_COMPLETE") {
                setComment("");
                setCommentPwd("");
                getComments(); // 댓글 목록 갱신
            }

        } catch (e) {
            console.log(e);
        }
    };

    // 댓글 목록 가져오기
    const getComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getCommentByBoardIdx?boardIdx=${boardIdx}`);
            setCommentLists(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    // 댓글 삭제
    const deleteComment = async () => {

        // console.log();
        //  비밀번호 일치 여부 확인
        // if (passWord !== comment.pwd) {
        //     alert("비밀번호가 일치하지 않습니다.");
        //     setPassWord('');
        //     return;
        // }

        try {
            const response = await axios.delete(`http://localhost:8081/deleteCommentByIdx?idx=${selectedComment.idx}`);
            if (response.data.result === "DELETE_COMMENT_COMPLETE") {
                getComments(); // 댓글 목록 갱신
                closeModal(); // 모달 닫기
            }
        } catch (e) {
            console.log(e);
        }
    };

    // 이미지 다운로드
    const downloadImage = async (item) => {

        const apiUrl = "http://localhost:8081/image/download?fileName=" + item;

        try {
            const response = await axios.get(apiUrl,
                {
                    responseType: 'blob' // Blob 형식으로 데이터 받기
                }
            );


            const blob = new Blob([response.data], { type: "application/octet-stream" });
            const url = window.URL.createObjectURL(blob);

            // 다운로드 링크 생성
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.setAttribute('download', item.split("=")[1]);

            // 링크를 body에 추가하고 클릭하여 다운로드 시작
            document.body.appendChild(downloadLink);
            downloadLink.click();

            // 다운로드가 완료되면 링크 제거
            document.body.removeChild(downloadLink);
        } catch (e) {
            console.log("MemberList" + e)
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
                            <dd>30</dd>
                        </dl>
                        <div className="view_cont">
                            {typeof boardViewData.content === 'string' ? parse(boardViewData.content) : null}
                        </div>

                        <div className="view_file">
                            <strong className="tit_file"><span className="ico_img file">첨부파일</span>첨부파일 :</strong>
                            {fileNames.map((fileName, index) => (
                                <a onClick={() => { downloadImage(fileName) }}>{fileName.split("=")[1]}</a>
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
                                    <li>
                                        <div className="info">
                                            <strong>{comment.writerId}</strong> <span className="fc_g ml_5">{comment.createAt}</span>
                                            <span className="ml_10">
                                                <button className="comm_btn_small" onClick={() => openModal('deleteComment',comment )}>삭제</button>
                                                <button className="comm_btn_small" onClick={() => openModal('updateComment', comment)}>수정</button>
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
                                    비밀번호 <input type="text" className="comm_inp_text" onChange={(e) => setCommentPwd(e.target.value)} value={commentPwd} />
                                    <button type="button" className="comm_btn_round fill" onClick={addComment}>등록</button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="comm_paging_btn">
                        <div className="flo_side left">
                            <button className="comm_btn_round fill"><Link to='/'>목록</Link></button>
                            <button className="comm_btn_round" onClick={() => openModal('delete')}>삭제</button>
                        </div>
                        <div className="flo_side right">
                            <button className="comm_btn_round fill">답글</button>
                            <button className="comm_btn_round fill" onClick={() => openModal('update')}>수정</button>
                        </div>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="comm_popup" style={{ left: '30%' }}>
                    <div className="wrap_tit">
                        <span className="tit_pop">비밀번호 확인</span>
                        <button type="button" className="btn_close" onClick={closeModal}>닫기</button>
                    </div>
                    <div className="wrap_cont">
                        비밀번호 <input type="text" className="comm_inp_text" style={{ width: '100px' }} onChange={(e) => setPassWord(e.target.value)} value={passWord} />
                    </div>
                    <div className="wrap_bottom">
                        <button className="comm_btn_round" onClick={closeModal}>닫기</button>
                        //modalAction에 따라 다른 함수를 호출하도록 설정
                        <button className="comm_btn_round fill" onClick={modalAction === 'deleteComment' || modalAction === 'updateComment' ? passWordTestForComment()  : passWordTestForBoard()}>확인</button>
                    </div>
                </div>
            )}

        </>
    );
}

export default BoardView;
