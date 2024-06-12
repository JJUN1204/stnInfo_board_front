import '../css/common.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from "react-quill";

function BoardEdit() {
    const [input, setInput] = useState({
        idx: '',
        title: '',
        writerId: '',
        pwd: '',
        email: '',
        isPrivate: '',
        isAlert: '',
        content: '',
        files: [],
        createAt: ''
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const { boardIdx } = useParams();

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

    useEffect(() => {
        fetchData();
        getFileName();
    }, [boardIdx]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getBoardIdx?idx=${boardIdx}`);
            setInput({
                idx: response.data.idx,
                title: response.data.title,
                writerId: response.data.writerId,
                email: response.data.email,
                isPrivate: response.data.isPrivate,
                isAlert: response.data.isAlert,
                content: response.data.content,
                createAt: response.data.createAt
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getFileName = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getFileNames?boardIdx=${boardIdx}`);
            setInput(prevInput => ({ ...prevInput, files: response.data }));
        } catch (e) {
            console.log(e);
        }
    };

    const handleAlertChange = () => {
        setInput(prevState => ({
            ...prevState,
            isAlert: prevState.isAlert === 1 ? 0 : 1,
            isPrivate: prevState.isAlert === 1 ? prevState.isPrivate : 0
        }));
    };

    const handlePrivateChange = () => {
        setInput(prevState => ({
            ...prevState,
            isPrivate: prevState.isPrivate === 1 ? 0 : 1,
            isAlert: prevState.isPrivate === 1 ? prevState.isAlert : 0
        }));
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const handleFileDelete = (fileNameToDelete) => {
        setFileNames(fileNames.filter(fileName => fileName !== fileNameToDelete));
    };

    const handleChangeFile = (event) => {
        const fileList = Array.from(event.target.files);
        setFiles([...files, ...fileList]);
        console.log(fileList);
    };

    const handleDeleteFile = (index) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

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
            files.forEach(file => {
                formData.append('files', file);
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
                                {fileNames.map((fileName, index) => (
                                    <li key={index}>
                                        {fileName.split("=")[1]}
                                        <button className="btn_ico_del" onClick={() => handleDeleteFile(fileName)}>삭제</button>
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