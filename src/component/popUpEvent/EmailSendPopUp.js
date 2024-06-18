import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

function SendEmailPopup({isOpen,closeModal ,boardIdx}) {
  const [from, setFrom] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState([]);
  const fileRef = useRef();

  useEffect(() => {
    getBoardIdx();
}, []);

const getBoardIdx = async () => {
    try {
        const response = await axios.get(`http://localhost:8081/getBoardIdx?idx=${boardIdx}`);
        setEmail(response.data.email);
    } catch (e) {
        console.log(e);
    }
};

  const handleChangeFile = (event) => {
    setFiles(Array.from(event.target.files));
  }

  const cancelSelectedFile = (file) => {
    const filteredFiles = files.filter((item) => item !== file);
    const dataTransfer = new DataTransfer();
    filteredFiles.forEach(file => {
      dataTransfer.items.add(file);
    });
    fileRef.current.files = dataTransfer.files;
    setFiles(filteredFiles);
  }

  const sendEmail = async () => {
    try {

      const formData = new FormData();
      formData.append("from", from);
      formData.append("to", email);
      formData.append("title", title);
      formData.append("content", content);
      files.forEach(file => {
        formData.append("files", file);
      });

      const res = await axios.post("http://localhost:8081/sendMail", formData);
      if (res.data.message === "SENDED_EMAIL") {
        closeModal();
      } else if (res.data.message === "SENDING_EMAIL_ERROR") {
        window.alert("이메일 전송 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("이메일 전송 중 오류:", error);
      window.alert("이메일 전송 중 오류가 발생했습니다.");
    }
  }


  if (!isOpen) return null;
  return (
    <div className="comm_popup">
      <fieldset className="blind">이메일 보내기</fieldset>
      <div className="wrap_tit">
        <span className="tit_pop">이메일 보내기</span>
        <button type="button" className="btn_close" onClick={closeModal}>닫기</button>
      </div>
      <div className="wrap_cont">
        <table className="tbl_pop">
          <tbody>
            <tr>
              <th>보내는 사람</th>
              <td><input type="text" className="comm_inp_text" style={{ width: "100%" }} value={from} onChange={(e) => setFrom(e.target.value)} /></td>
            </tr>
            <tr>
              <th>받는 사람</th>
              <td><input type="text" className="comm_inp_text" value={email} style={{ width: "100%" }} readOnly /></td>
            </tr>
            <tr>
              <th>제목</th>
              <td><input type="text" className="comm_inp_text" style={{ width: "100%" }} value={title} onChange={(e) => setTitle(e.target.value)} /></td>
            </tr>
            <tr>
              <th>내용</th>
              <td><textarea className="comm_textarea" style={{ width: "100%" }} value={content} onChange={(e) => setContent(e.target.value)} /></td>
            </tr>
            <tr>
              <th>파일</th>
              <td>
                <input type="file" className="comm_inp_file" style={{ width: "100%" }} ref={fileRef} onChange={handleChangeFile} multiple />
                <ul className="list_file_inline mt_5">
                  {files.map((item, index) => (
                    <li key={index}>
                      {item.name}
                      <button className="btn_ico_del" onClick={() => cancelSelectedFile(item)}>삭제</button>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="wrap_bottom">
        <button className="comm_btn_round" onClick={closeModal}>닫기</button>
        <button className="comm_btn_round fill" onClick={sendEmail}>보내기</button>
      </div>
    </div>
  );
}

export default SendEmailPopup;
