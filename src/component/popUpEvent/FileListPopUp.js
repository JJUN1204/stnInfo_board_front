import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FileListPopUp({ isOpen, closeModal, boardIdx, onPasswordSuccess }) {

    useEffect(() => {
        getFileName();
    }, []);

    // const privateBoard = (isPrivate, boardIdx) => {
    //     console.log(isPrivate);
    //     console.log(boardIdx);

    //     if(isPrivate === 1){
    //         openPrivateModal(boardIdx);
    //     }else{
    //         navigate(`/boardview/${boardIdx}`);
    //     }
       
    // };


    const [fileNames, setFileNames] = useState([]);

    const getFileName = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getFileNames?boardIdx=${boardIdx}`);
            setFileNames(response.data);
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


    if (!isOpen) return null;



    return (

        <div className="comm_popup">
            <div className="wrap_tit">
                <span className="tit_pop">첨부파일</span>
                <button type="button" className="btn_close" onClick={closeModal}>닫기</button>
            </div>
            <div className="wrap_cont">
                <ul className="list_file">
                    {fileNames.map((fileName, index) => (
                        <li key={index}><a  href="javascript:;" onClick={() => downloadImage(fileName)}>{fileName.split("=")[1]}</a></li>
                    ))}
                </ul>
            </div>
            <div className="wrap_bottom">
                <button className="comm_btn_round" onClick={closeModal}>닫기</button>
            </div>
        </div>

    );
}

export default FileListPopUp;
