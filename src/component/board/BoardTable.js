import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function BoardTable({ boardData, openPrivateModal, openFileModal, alertData, openEmailModal, searchText }) {
    const navigate = useNavigate();
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

    const privateBoard = (isPrivate, boardIdx) => {
        if (isPrivate === 1) {
            openPrivateModal(boardIdx, 'private');
        } else {
            navigate(`/boardview/${boardIdx}`);
        }
    };

    const privateFile = (isPrivate, boardIdx) => {
        if (isPrivate === 1) {
            openPrivateModal(boardIdx, 'file');
        } else {
            openFileModal(boardIdx);
        }
    };

    const privateEmail = (isPrivate, boardIdx) => {
        if (isPrivate === 1) {
            openEmailModal(boardIdx, 'email');
        } else {
            openEmailModal(boardIdx);
        }
    };

    const highlightText = (text, searchText) => {
        if (!searchText) return text;
        const regex = new RegExp(`(${searchText})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    };

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
            {alertData.map((item, index) => (
                <tr key={index}>
                    <td></td>
                    <td className="ta_l">
                        <a className="link_title" href="javascript:;">
                            {item.isAlert === 1 && <span className="txt_label notice">공지</span>}
                            <Link to={`/boardView/${item.idx}`}>{item.title}</Link>
                        </a>
                        {item.commentCount !== 0 &&
                            <a className="link_file" href="javascript:;">
                                <span className="txt_reply">({item.commentCount})</span>
                            </a>
                        }
                        {formattedDate === item.createAt &&
                            <span className="ico_new">N</span>
                        }
                    </td>
                    <td>
                        {item.fileCount !== 0 &&
                            <a className="link_file" href="javascript:;" onClick={() => privateFile(item.isPrivate, item.idx)}>
                                <span className="ico_img flie">첨부파일</span>{item.fileCount}
                            </a>
                        }
                    </td>
                    <td>
                        <button className="link_writer" onClick={() => privateEmail(item.isPrivate, item.idx)}>{item.writerId}</button>
                    </td>
                    <td>{item.createAt}</td>
                    <td>{item.view}</td>
                </tr>
            ))}
            <tbody>
                {boardData !== null && boardData.length > 0 ? (
                    boardData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.idx}</td>
                            <td className="ta_l">
                                <a className="link_title" href="javascript:;" onClick={() => privateBoard(item.isPrivate, item.idx)}>
                                    {item.isAlert === 1 && <span className="txt_label notice">공지</span>}
                                    {item.isPrivate === 1 && <span className="ico_img lock">비밀글</span>}
                                    <span dangerouslySetInnerHTML={{ __html: highlightText(item.title, searchText) }}></span>
                                </a>
                                {item.commentCount !== 0 && (
                                    <a className="link_file" href="javascript:;">
                                        <span className="txt_reply">({item.commentCount})</span>
                                    </a>
                                )}
                                {formattedDate === item.createAt && (
                                    <span className="ico_new">N</span>
                                )}
                            </td>
                            <td>
                                {item.fileCount !== 0 && (
                                    <a className="link_file" href="javascript:;" onClick={() => privateFile(item.isPrivate, item.idx)}>
                                        <span className="ico_img flie">첨부파일</span>{item.fileCount}
                                    </a>
                                )}
                            </td>
                            <td>
                                <button className="link_writer" onClick={() => privateEmail(item.isPrivate, item.idx)}>{item.writerId}</button>
                            </td>
                            <td>{item.createAt}</td>
                            <td>{item.view}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6">검색 결과가 없습니다.</td>
                    </tr>
                )}
            </tbody>

        </table>
    );
}

export default BoardTable;
