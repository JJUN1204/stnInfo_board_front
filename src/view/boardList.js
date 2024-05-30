import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/common.css';
import BoardTable from '../component/board/BoardTable';
import Pagination from '../component/paging/PagiNation';

function BoardList() {
    const [idx, setIdx] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumber, setPageNumber] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [boardCount, setBoardCount] = useState(0);
    const [boardEmail, setBoardEmail] = useState('');

    const [fileCount, setFileCount] = useState(0);
    const [commentCount, setComentCount] = useState(0);

    const [searchInput, setSearchInput] = useState('');
    const [searchType, setSearchType] = useState('TITLE');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [boardData, setBoardData] = useState([]);
    const [search, setSearch] = useState({
        searchType: 'TITLE',
        searchInput: '테스트',
        btnType: 'init'
       
    });


    const init = () => {
        setSearch({ searchType: 'TITLE', searchInput: '', btnType: 'init' });
    };

    useEffect(() => {
        getAllBoard();
    }, [search.btnType]);


    const getAllBoard = async () => {

        console.log(search.btnType)
        console.log(search)
        try {

            // 초기화 요청
            const response = await axios.get(`http://localhost:8081/getAllBoard?currentPage=${currentPage}&searchType=${search.searchType}&searchInput=${search.searchInput}&startDate=${startDate}&endDate=${endDate}`);
            setBoardData(response.data.data);
            setPageNumber(Array.from({ length: Math.ceil(response.data.totalData / 5) }, (_, index) => index + 1));




        } catch (e) {
            console.error(e);  // 오류 발생 시 콘솔에 로그 출력
        }
    };


    // const getBoardCount = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:8081/getBoardCount`);
    //         setBoardCount(response.data);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };

    // const getBoardEmail = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:8081/getEmail?idx=${idx}`);
    //         setBoardEmail(response.data);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };



    const openModal = () => {
        setIsOpen(true);
    }

    const closeModal = () => {
        setIsOpen(false);
    }

    // const allData = () => {
    //     setCurrentPage(pageNumber[0]);
    //     setSearchInput('');
    //     setStartDate('');
    //     setEndDate('');
    //     getAllBoard();
    // }

    // const searchFunction = () => {
    //     setCurrentPage(pageNumber[0]);
    //     getAllBoard();
    // }




    return (
        <><div id="WrapTitle">
            <div className="container">
                <h1 className="logo">STN INFOTECH</h1>
            </div>
        </div><div id="WrapContainer">
                <div className="container">
                    <div className="wrap_tit">
                        <h2 className="tit_cont">자유게시판</h2>
                        <div className="ta_r">
                            총 갯수 <strong className="fc_p">{boardCount}</strong>건{" "}
                        </div>
                    </div>

                    <BoardTable boardData={boardData} openModal={openModal} />

                    <Pagination currentPage={currentPage} pageNumber={pageNumber} setCurrentPage={setCurrentPage} />

                    <div className="flo_side right">
                        <button className="comm_btn_round fill"><Link to='/boardwrite'>글쓰기</Link></button>
                    </div>

                    <div className="box_search">
                        등록일
                        <input type="date" className="comm_inp_date ml_5" onChange={(e) => setStartDate(e.target.value)} disabled={search.searchType !== "DATE"} /> ~
                        <input type="date" className="comm_inp_date" onChange={(e) => setEndDate(e.target.value)} disabled={search.searchType !== "DATE"} />
                        <select className="comm_sel ml_10" onChange={(e) => setSearch({ ...search, searchType: e.target.value })}>
                            <option value={'TITLE'}>제목</option>
                            <option value={'TITLEANDCONTENT'}>제목+내용</option>
                            <option value={'WRITER'}>작성자</option>
                            <option value={'DATE'}>날짜</option>
                        </select>
                        <input type="text" className="comm_inp_text" style={{ width: "300px" }} value={searchInput} onChange={(e) => setSearch({ ...search, searchInput: e.target.value })} disabled={search.searchType === "DATE"} />
                        <button className="comm_btn fill" onClick={() => setSearch({ ...search, btnType: 'search' })}>검색</button>

                        <button className="comm_btn fill" onClick={init}>전체목록</button>
                    </div>
                </div>
            </div>
            {
                isOpen &&
                <div className="comm_popup" style={{ width: "400px", left: "73%" }}>
                    <form>
                        <fieldset className="blind">이메일 보내기</fieldset>
                        <div className="wrap_tit">
                            <span className="tit_pop">이메일 보내기</span>
                            <button type="button" className="btn_close" onClick={closeModal}>
                                닫기
                            </button>
                        </div>
                        <div className="wrap_cont">
                            <table className="tbl_pop">
                                <tbody>
                                    <tr>
                                        <th>보내는 사람</th>
                                        <td>
                                            <input type="text" className="comm_inp_text" style={{ width: "100%" }} onChange={null} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>받는 사람</th>
                                        <td>
                                            <input type="text" className="comm_inp_text" value={boardEmail} style={{ width: "100%" }} onChange={null} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>제목</th>
                                        <td>
                                            <input type="text" className="comm_inp_text" style={{ width: "100%" }} onChange={null} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>내용</th>
                                        <td>
                                            <textarea className="comm_textarea" style={{ width: "100%" }} onChange={null} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>파일</th>
                                        <td>
                                            <input type="file" className="comm_inp_file" style={{ width: "100%" }} onChange={null} />
                                            <ul className="list_file_inline mt_5">
                                                <li>
                                                    file_20240425.zip <button className="btn_ico_del">삭제</button>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="wrap_bottom">
                            <button className="comm_btn_round" onClick={closeModal}>닫기</button>
                            <button className="comm_btn_round fill">보내기</button>
                        </div>
                    </form>
                </div>
            }
        </>
    );
}

export default BoardList;
