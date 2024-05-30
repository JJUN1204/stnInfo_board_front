import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BoardTable({ boardData, openModal }) {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${
        (today.getMonth() + 1).toString().padStart(2, '0') //두 자리 수가 되도록
      }-${today.getDate().toString().padStart(2, '0')}`;

    useEffect(() => {
        console.log(formattedDate);
        console.log(boardData.createAt); 
    }, []); 



    return (
        <table className="tbl_board">
            <colgroup>
                <col style={{ width: "5%" }} />
                <col />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "8%" }} />
                <col style={{ width: "7%" }} />
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">No</th>
                    <th scope="col">제목</th>
                    <th scope="col">첨부파일</th>
                    <th scope="col">작성자</th>
                    <th scope="col">작성일</th>
                    <th scope="col">조회수</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                    <td className="ta_l">
                        <a className="link_title" href="javascript:;">
                            <span className="txt_label notice">공지</span> 공지사항 입니다.
                        </a>
                    </td>
                    <td>
                        <a className="link_file" href="javascript:;">
                            <span className="ico_img flie">첨부파일</span>10
                        </a>
                    </td>
                    <td>
                        <button className="link_writer" onClick={openModal}>홍길동</button>
                    </td>
                    <td>2024-04-15</td>
                    <td>358</td>
                </tr>
                {boardData && boardData.map((item, index) => (
                    <tr key={index}>
                        <td>{item.idx}</td>
                        <td className="ta_l">
                            <a className="link_title" href="javascript:;">
                                <Link to={`/boardView/${item.idx}`}>{item.title}</Link>
                            </a>
                            {item.commentCount !== 0 ?
                                <a className="link_file" href="javascript:;">
                                    <span className="txt_reply">({item.commentCount})</span>
                                </a>
                                :
                                null
                            }
                            {formattedDate === item.createAt ?
                                <span className="ico_new">N</span>
                                :
                                null
                            }
                            
                        </td>
                        <td>
                            {item.fileCount !== 0 ?
                                <a className="link_file" href="javascript:;">
                                    <span className="ico_img flie">첨부파일</span>{item.fileCount}
                                </a>
                                :
                                null
                            }
                        </td>
                        <td>
                            <button className="link_writer" onClick={openModal}>{item.writerId}</button>
                        </td>
                        <td>{item.createAt}</td>
                        <td>5</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default BoardTable;
