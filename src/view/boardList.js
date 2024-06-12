import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/common.css';
import BoardTable from '../component/board/BoardTable';
import Pagination from '../component/paging/PagiNation';
import PasswordModal from '../component/popUpEvent/PasswordModal';
import FileListPopUp from '../component/popUpEvent/FileListPopUp';
import EmailSendPopUp from '../component/popUpEvent/EmailSendPopUp';

function BoardList() {
    // 페이지 네이션
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumber, setPageNumber] = useState([]);

    // 비공개 모달
    const [isPrivateOpen, setIsPrivateOpen] = useState(false);
    const [isPrivateIdx, setIsPrivateIdx] = useState('');

    // 모달 공통
    const [modalAction, setModalAction] = useState('');

    // 파일 모달
    const [isFileListOpen, setIsFileListOpen] = useState(false);
    const [isFileIndex, setIsFileIndex] = useState('');

    // 이메일 모달
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [isEmailIndex, setIsEmailIndex] = useState('');
    const [email, setEmail] = useState('');


    // 게시글 데이터
    const [boardData, setBoardData] = useState([]);
    const [alertBoard, setAlertBoard] = useState([]);
    const [boardCount, setBoardCount] = useState(0);

    // 검색 상태 변수
    const [searchInput, setSearchInput] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchType, setSearchType] = useState('TITLE');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const getAllBoard = async () => {
        try {
            const response = await axios.get(`http://localhost:8081/getAllBoard?currentPage=${currentPage}&searchType=${searchType}&searchInput=${searchInput}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`);
            setBoardCount(response.data.totalData);
            setBoardData(response.data.data);
            setSearchInput("");
            setStartDate('');
            setEndDate('');
            setPageNumber(Array.from({ length: Math.ceil(response.data.totalData / 5) }, (_, index) => index + 1));
        } catch (e) {
            console.log(e);
        }
    };

    const getAlert = async () => {
        try {
            const response = await axios.get("http://localhost:8081/getAlert");
            setAlertBoard(response.data);
        } catch (e) {
            console.log(e);
        }
    };

    // 비공개 테스트 모달영역
    const openPrivateModal = (boardIdx, action) => {
        setIsPrivateOpen(true);
        setIsPrivateIdx(boardIdx);
        setModalAction(action);
    };

    const closePrivateModal = () => {
        setIsPrivateOpen(false);
    };

    // 파일 테스트 모달영역
    const openFileModal = (boardIdx) => {
        setIsFileListOpen(true);
        setIsFileIndex(boardIdx);
    };

    const closeFileModal = () => {
        setIsFileListOpen(false);
    };

    // 이메일 테스트 모달영역
    const openEmailModal = (boardIdx) => {
        setIsEmailOpen(true);
        setIsEmailIndex(boardIdx);
        
    };

    const closeEmailModal = () => {
        setIsEmailOpen(false);
    };

    // 모든 데이터 불러오기
    const AllData = () => {
        if(currentPage === 0){
            setCurrentPage(0);
        }else{
            setCurrentPage(pageNumber[0]);
        }
        
        getAllBoard();
        setSearchText('');
    };

    // 검색 데이터 불러오기
    const searchFunction = () => {
        setCurrentPage(pageNumber[0]);
        setSearchText(searchInput);
        getAllBoard();
    };

    useEffect(() => {
        getAllBoard(currentPage);
        getAlert(currentPage);
    }, [currentPage]);

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
                        <div className="ta_r">
                            총 갯수 <strong className="fc_p">{boardCount}</strong>건{" "}
                        </div>
                    </div>

                    <BoardTable boardData={boardData} openPrivateModal={openPrivateModal} openFileModal={openFileModal} alertData={alertBoard} openEmailModal={openEmailModal} searchText={searchText} />

                    <Pagination currentPage={currentPage} pageNumber={pageNumber} setCurrentPage={setCurrentPage} />

                    <div className="flo_side right">
                        <button className="comm_btn_round fill"><Link to='/boardwrite' style={{color:"white"}}>글쓰기</Link></button>
                    </div>

                    <div className="box_search">
                        등록일
                        <input type="date" className="comm_inp_date ml_5" onChange={(e) => setStartDate(e.target.value)} disabled={searchType !== "DATE"} /> ~
                        <input type="date" className="comm_inp_date" onChange={(e) => setEndDate(e.target.value)} disabled={searchType !== "DATE"} />
                        <select className="comm_sel ml_10" onChange={(e) => setSearchType(e.target.value)}>
                            <option value={'TITLE'}>제목</option>
                            <option value={'TITLEANDCONTENT'}>제목+내용</option>
                            <option value={'WRITER'}>작성자</option>
                            <option value={'DATE'}>날짜</option>
                        </select>
                        <input type="text" className="comm_inp_text" style={{ width: "300px" }} value={searchInput} onChange={(e) => setSearchInput(e.target.value)} disabled={searchType === "DATE"} />
                        <button className="comm_btn fill" onClick={searchFunction}>검색</button>

                        <button className="comm_btn fill" onClick={AllData}>전체목록</button>
                    </div>
                </div>
            </div>

            {isEmailOpen &&
                <EmailSendPopUp isOpen={isEmailOpen} closeModal={closeEmailModal} boardIdx={isEmailIndex}></EmailSendPopUp>
            }

            {isFileListOpen &&
                <FileListPopUp isOpen={isFileListOpen} closeModal={closeFileModal} boardIdx={isFileIndex}></FileListPopUp>
            }

            {isPrivateOpen &&
                <PasswordModal isOpen={isPrivateOpen} closeModal={closePrivateModal} boardIdx={isPrivateIdx} modalAction={modalAction} openFileModal={openFileModal}></PasswordModal>
            }
        </>
    );
}

export default BoardList;
