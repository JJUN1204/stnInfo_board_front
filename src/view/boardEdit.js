import '../css/common.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from "react-quill";

function BoardEdit() {
    // 입력 데이터를 저장하기 위한 상태
    const [input, setInput] = useState({
        idx: '',
        title: '',
        writerId: '',
        email: '',
        isPrivate: '',
        isAlert: '',
        content: '',
        files: [], // 파일 객체를 저장하기 위한 배열
    });

    const navigate = useNavigate();
    const { boardIdx } = useParams();

    // ReactQuill 에디터의 설정
    const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link", "image"],
            [{ align: [] }, { color: [] }, { background: [] }],
            ["clean"],
        ],
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "align",
        "color",
        "background",
    ];

    // 컴포넌트가 마운트되거나 boardIdx가 변경될 때 데이터를 가져옴
    useEffect(() => {
        fetchData();
        getFileName();
    }, [boardIdx]);

    // input 상태가 변경될 때마다 콘솔에 출력
    useEffect(() => {
        console.log(input);
    }, [input]);

    // 서버에서 게시물 데이터를 가져오는 함수
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getBoardIdx?idx=${boardIdx}`);
            setInput(prevState => ({
                ...prevState,
                idx: response.data.idx,
                title: response.data.title,
                writerId: response.data.writerId,
                email: response.data.email,
                isPrivate: response.data.isPrivate,
                isAlert: response.data.isAlert,
                content: response.data.content
            }));
        } catch (error) {
            console.log(error);
        }
    };

    // 서버에서 파일 이름을 가져오는 함수
    const getFileName = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getFileNames?boardIdx=${boardIdx}`);
            setInput(prevState => ({
                ...prevState,
                files: response.data
            }));
        } catch (e) {
            console.log(e);
        }
    };

    // 공지사항 체크박스를 변경하는 함수
    const handleAlertChange = () => {
        setInput(prevState => ({
            ...prevState,
            isAlert: prevState.isAlert === 1 ? 0 : 1,
            isPrivate: prevState.isAlert === 1 ? prevState.isPrivate : 0
        }));
    };

    // 비밀글 체크박스를 변경하는 함수
    const handlePrivateChange = () => {
        setInput(prevState => ({
            ...prevState,
            isPrivate: prevState.isPrivate === 1 ? 0 : 1,
            isAlert: prevState.isPrivate === 1 ? prevState.isAlert : 0
        }));
    };

    const handleChangeFile = (event) => {
        const fileList = Array.from(event.target.files); // 파일 목록을 배열로 변환
        console.log(fileList); // 파일 목록을 콘솔에 출력
        setInput({
            ...input,
            files: [...input.files, ...fileList] // 기존 파일 목록에 새 파일을 추가
        });
    };
    
    const handleDeleteFile = (index) => {
        setInput({
            ...input,
            files: input.files.filter((_, i) => i !== index) // 선택된 파일을 목록에서 제거
        });
    };
    

    // 게시물을 업데이트하는 함수
    const boardUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append('idx', input.idx);
            formData.append('title', input.title);
            formData.append('writerId', input.writerId);
            formData.append('email', input.email);
            formData.append('isPrivate', input.isPrivate);
            formData.append('isAlert', input.isAlert);
            formData.append('content', input.content);
            input.files.forEach((file, index) => {
                formData.append(`file${index}`, file); // 파일마다 고유한 키를 생성하여 추가
            });

            const response = await axios.put(`http://localhost:8081/updateBoard`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.result === "UPDATE_COMPLETE") {
                navigate(`/boardview/${boardIdx}`);
            }
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
                    <div className="wrap_write">
                        <dl className="write_tit">
                            <dt>제목</dt>
                            <dd><input type="text" className="comm_inp_text" style={{ width: "100%" }} value={input.title} onChange={(e) => setInput({ ...input, title: e.target.value })} /></dd>
                        </dl>
                        <div className="write_info">
                            <dl className="info">
                                <dt>작성자</dt>
                                <dd><input type="text" className="comm_inp_text" style={{ width: "80px" }} value={input.writerId} readOnly /></dd>
                                <dt>비밀번호</dt>
                                <dd><input type="password" className="comm_inp_text" style={{ width: "100px" }} value={input.pwd} readOnly /></dd>
                                <dt>이메일</dt>
                                <dd><input type="text" className="comm_inp_text" style={{ width: "150px" }} value={input.email} readOnly /></dd>
                            </dl>
                            <dl className="side">
                                <dt>공지사항</dt>
                                <dd>
                                    <label className="comm_swich">
                                        <input type="checkbox" name='isAlert' checked={input.isAlert === 1} onChange={handleAlertChange} disabled={input.isPrivate === 1} />
                                        <span className="ico_txt"></span>
                                    </label>
                                </dd>
                                <dt>비밀글</dt>
                                <dd>
                                    <label className="comm_swich">
                                        <input type="checkbox" name='isPrivate' checked={input.isPrivate === 1} onChange={handlePrivateChange} disabled={input.isAlert === 1} />
                                        <span className="ico_txt"></span>
                                    </label>
                                </dd>
                            </dl>
                        </div>
                        <div className="write_cont">
                            <ReactQuill
                                style={{ height: "350px" }}
                                theme="snow"
                                modules={modules}
                                formats={formats}
                                value={input.content || ""}
                                onChange={(content, delta, source, editor) => setInput(prevState => ({ ...prevState, content: editor.getHTML() }))}
                            />
                        </div>
                        <div className="write_file">
                            <strong className="tit_file"><span className="ico_img file">첨부파일</span> 첨부파일</strong>
                            <div className="cont_file">
                                <input type="file" className="comm_inp_file" style={{ width: "100%" }} multiple onChange={handleChangeFile} />
                                <ul className="list_file_inline mt_5">
                                    {input.files.map((file, index) => (
                                        <li key={index}>
                                            {file.split("=")[1]} {/* 파일 이름 출력 */}
                                            <button className="btn_ico_del" onClick={() => handleDeleteFile(index)}>삭제</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="comm_paging_btn">
                        <div className="flo_side left">
                            <button className="comm_btn_round fill"><Link to='/'>목록</Link></button>
                        </div>
                        <div className="flo_side right">
                            <button className="comm_btn_round"><Link to={`/boardview/${boardIdx}`}>취소</Link></button>
                            <button className="comm_btn_round fill" onClick={boardUpdate}>수정</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BoardEdit;
