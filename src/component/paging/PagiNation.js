// Pagination.js
import React from 'react';

function Pagination({ currentPage, pageNumber, setCurrentPage }) {
    const pageGroup = Math.ceil(currentPage / 5);
    const firstPage = (pageGroup - 1) * 5;
    const lastPage = pageGroup * 5;
    
    const lastMove = () => {
        const lastPage = pageNumber.slice(-1)[0];
        setCurrentPage(lastPage);
    };

    return (
        <div className="comm_paging_btn">
            <div className="flo_side left">페이지 <strong className="fc_p">{currentPage}</strong>/{pageNumber.length}</div>
            <div className="wr_paging">
                <button className="btn_page first" onClick={() => setCurrentPage(pageNumber[0])} disabled={currentPage === 1 || pageNumber.length === 0}>
                    첫 페이지
                </button>
                <button className="btn_page prev" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1 || pageNumber.length === 0}>
                    이전
                </button>
                <span className="wr_page">
                    <div>
                        {pageNumber.slice(firstPage, lastPage).map((item, index) => (
                            <strong
                                className={`page ${currentPage === item ? 'on' : ''}`}
                                onClick={() => setCurrentPage(item)}
                                key={index}
                            >
                                {item}
                            </strong>
                        ))}
                    </div>
                </span>
                <button className="btn_page next" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === pageNumber.length || pageNumber.length === 0}>
                    다음
                </button>
                <button className="btn_page last" onClick={lastMove} disabled={currentPage === pageNumber.length || pageNumber.length === 0}>
                    마지막 페이지
                </button>
            </div>
        </div>
    );
}

export default Pagination;
