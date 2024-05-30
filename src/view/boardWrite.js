import '../css/common.css';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as DOMPurify from "dompurify";


function BoardWrite() {
    
    // 게시글의 제목, 작성자, 비밀번호, 이메일, 비밀글 여부, 공지사항 여부, 내용, 첨부 파일에 대한 상태 변수를 선언합니다.
    const [title, setTitle] = useState('');
    const [writerId, setWriterId] = useState('');
    const [pwd, setPwd] = useState('');
    const [email, setEmail] = useState('');
    const [isPrivate, setIsPrivate] = useState(0);
    const [isAlert, setIsAlert] = useState(0);
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);

    const navigate = useNavigate(); // React Router의 navigate hook을 사용하여 페이지 이동을 관리합니다.

    // 게시글 등록을 처리하는 함수입니다.
    const handleUpadte = async () => {
        const formData = new FormData();
            formData.append('title', title);
            formData.append('writerId', writerId);
            formData.append('pwd', pwd);
            formData.append('email', email);
            formData.append('isPrivate', isPrivate);
            formData.append('isAlert', isAlert);
            formData.append('content', content);
            files.forEach((file, index) => {
                formData.append('files', file);
            });
    
        try {
            const response = await axios.post('http://localhost:8081/insertBoard', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.data.result === "UPDATE_COMPLETE") {
                navigate('/'); // 등록이 완료되면 홈 페이지로 이동합니다.
            }
        } catch (e) {
            console.log(e);
        }
    };
    
    // Quill Editor의 모듈 및 포맷을 설정합니다.
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

    // 파일 선택 시 실행되는 함수입니다.
    const handleChangeFile = (event) => {
        const fileList = Array.from(event.target.files); // 파일 값을 배열로 변환합니다.
        setFiles([...files, ...fileList]); // 기존 파일 배열과 새로운 파일 배열을 합칩니다.
        console.log(fileList);
    };

    // 파일 삭제 시 실행되는 함수입니다.
    const handleDeleteFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    // 공지사항 체크박스 변경 시 실행되는 함수입니다.
    const handleAlertChange = () => {
        setIsAlert(prevState => prevState === 1 ? 0 : 1);
    };

    // 비밀글 체크박스 변경 시 실행되는 함수입니다.
    const handlePrivateChange = () => {
        setIsPrivate(prevState => prevState === 1 ? 0 : 1);
    };

    return (
        <><div id="WrapTitle">
            <div className="container">
                <h1 className="logo">STN INFOTECH</h1>
            </div>
        </div><div id="WrapContainer">
                <div className="container">
                    <div className="wrap_tit">
                        <h2 className="tit_cont">자유게시판</h2>
                    </div>
                    <div className="wrap_write">
                        <dl className="write_tit">
                            <dt>제목</dt>
                            <dd><input type="text" name='title' className="comm_inp_text" style={{ width: '100%' }} value={title} onChange={(e) => {setTitle(e.target.value)}}/></dd>
                        </dl>
                        <div className="write_info">
                            <dl className="info"> 
                                <dt>작성자</dt>
                                <dd><input type="text" name='writerId' className="comm_inp_text" style={{ width: '80px' }} value={writerId} onChange={(e) => {setWriterId(e.target.value)}}/></dd>
                                <dt>비밀번호</dt>
                                <dd><input type="text" name='pwd' className="comm_inp_text" style={{ width: '100px' }} value={pwd} onChange={(e) => {setPwd(e.target.value)}}/></dd>
                                <dt>이메일</dt>
                                <dd><input type="text" name='email' className="comm_inp_text" style={{ width: '150px' }} value={email} onChange={(e) => {setEmail(e.target.value)}}/></dd>
                            </dl>

                            <dl className="side">
                                <dt>공지사항</dt>
                                <dd>
                                    <label className="comm_swich">
                                        <input type="checkbox" name='isAlert' checked={isAlert === 1} onChange={handleAlertChange} disabled={isPrivate === 1} />
                                        <span className="ico_txt"></span>
                                    </label>
                                </dd>
                                <dt>비밀글</dt>
                                <dd>
                                    <label className="comm_swich">
                                        <input type="checkbox" name='isPrivate' checked={isPrivate === 1} onChange={handlePrivateChange} disabled={isAlert === 1}/>
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
                                value={content || ""}
                                sanitize={false}
                                onChange={(content, delta, source, editor) => setContent(editor.getHTML())}
                            />
                        </div>
                        <div className="write_file">
                            <strong className="tit_file"><span className="ico_img flie">첨부파일</span> 첨부파일</strong>
                            <div className="cont_file">
                                <input type="file" id='imgUpload' className="comm_inp_file" style={{ display: 'none' }} onChange={handleChangeFile} multiple />
                                <label htmlFor="imgUpload" className="comm_inp_text" style={{ width: '200px', textAlign: 'center', backgroundColor: '#f1f1f1', padding: '5px', borderRadius: '10px', cursor: 'pointer' }}>파일 선택</label>
                                <label>선택된 파일 개수: {files.length}</label>
                                <ul className="list_file_inline mt_5">
                                    {files.map((file, index) => (
                                        <li key={index}>
                                            {file.name}   
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
                            <button className="comm_btn_round"><Link to='/'>취소</Link></button>
                            <button className="comm_btn_round fill" onClick={handleUpadte}>등록</button>
                        </div>
                    </div>
                </div>
            </div></>

    );
}

export default BoardWrite;
