import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FloatingButton from "../ui/FloatingButton";
import "../../styles/memo.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchMemo, updateMemo } from "../../store/slices/memoSlice";
import { fetchFolders } from "../../store/slices/folderSlice";
import { addScrap, removeScrap } from "../../store/slices/scrapSlice";
import Modal from "../common/Modal";

const CustomComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold text-blue-600">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-blue-500">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-bold text-blue-400">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-800 leading-relaxed mb-4">{children}</p>
  ),
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em className="text-blue-500">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-gray-500 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="bg-gray-100 border-l-4 border-blue-500 px-4 py-3 my-4">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
  li: ({ children }) => <li className="mb-2">{children}</li>,
  code: ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <pre className="bg-gray-200 p-4 rounded overflow-x-auto">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    ) : (
      <code className="bg-gray-200 rounded px-2 py-1 text-sm" {...props}>
        {children}
      </code>
    );
  },
};

const Memo = ({ articleId }) => {
  const dispatch = useDispatch();
  const { memo, loading, error } = useSelector((state) => state.memo);
  const { folders = [] } = useSelector((state) => state.folder);
  const [markdown, setMarkdown] = useState("# 마크다운을 입력하세요");
  const [isPreview, setIsPreview] = useState(false);
  const [category, setCategory] = useState("");
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);

  const handleFolderChange = async (e) => {
    const newFolderId = e.target.value;

    if (memo?.scrapId && articleId) {
      try {
        await dispatch(removeScrap(memo.scrapId));

        await dispatch(addScrap({
          articleId: articleId,
          folderId: newFolderId
        }));

        await dispatch(fetchMemo(articleId));

        setCategory(newFolderId);
      } catch (error) {
        console.error("Error changing folder:", error);
      }
    }
  };


  useEffect(() => {
    console.log("📝 메모 컴포넌트가 마운트되었습니다");
    console.log("현재 기사 ID:", articleId);

    if (articleId) {
      dispatch(fetchMemo(articleId)).then((response) => {
        // 기존 메모가 있는 경우
        if (response.payload?.content) {
          setMarkdown(response.payload.content);
          // 메모의 폴더 ID로 카테고리 설정
          if (response.payload.folderId) {
            setCategory(response.payload.folderId.toString());
          }

        // 새로운 메모인 경우
        } else {
          setMarkdown("# 마크다운을 입력하세요");
        }
        // 폴더 ID 설정
        // const latestFolder = folders?.content?.[0];
        // if (latestFolder) {
        //   setCategory(latestFolder.folderId.toString());
        // }
      });
      dispatch(fetchFolders());
    }
  }, [dispatch, articleId]);

  // Add this new useEffect to update markdown when memo changes
  useEffect(() => {
    if (memo?.content) {
      setMarkdown(memo.content);
    }
  }, [memo]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${String(date.getDate()).padStart(2, "0")}`;
  };
  const handleInputChange = (e) => {
    setMarkdown(e.target.value);
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  // 현재 날짜 가져오기
  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}/${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}/${String(currentDate.getDate()).padStart(2, "0")}`;


  const handleSave = async () => {
    if (memo?.memoId) {
      await dispatch(updateMemo({
        memoId: memo.memoId,
        content: markdown,
      }));
      // 저장 후 메모 다시 불러오기
      const response = await dispatch(fetchMemo(articleId));
      console.log("수정된 메모 데이터:", response.payload); // 업데이트된 데이터 로깅
      setShowSaveConfirmModal(true);
    }
  };

  return (
    <div className="markdown-container p-4 h-full flex flex-col">
      {/* 상단 작성일자와 카테고리 */}
      <div className="grid grid-cols-1 gap-2 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <label className="text-sm text-gray-500">작성일자</label>
            <div>{memo ? formatDate(memo.createdAt) : formattedDate}</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 mb-5">
          <div className="text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
          </div>
          <div className="flex-grow">
            <label className="text-sm text-gray-500">폴더</label>
            <select
              value={category}
              onChange={handleFolderChange}
              className="block w-full mt-1 text-gray-700 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
            >
              {folders?.content &&
                folders.content.map((folder) => (
                  <option key={folder.folderId} value={folder.folderId}>
                    {folder.folderName}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* 마크다운 에디터 및 미리보기 */}
      <div className="flex-grow overflow-hidden my-4">
        {!isPreview ? (
          <textarea
            className="markdown-editor w-full h-full min-h-[300px] border border-gray-300 rounded "
            value={markdown}
            onChange={handleInputChange}
          />
        ) : (
          <div className="markdown-preview w-full h-full min-h-[300px] border border-gray-300 rounded overflow-auto">
            <ReactMarkdown
              components={CustomComponents}
              remarkPlugins={[remarkGfm]}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* 저장 버튼 */}
      <div className="mt-4 text-center flex-shrink-0">
        <button
          onClick={handleSave}
          className="preview-button bg-[#1E4C9A] text-white px-4 py-2 rounded"
        >
          저장하기
        </button>
      </div>

      {/* 플로팅 버튼 */}
      <FloatingButton
        text={isPreview ? "메모" : "미리보기"}
        color="from-[#1B2C7A] to-[#72B7CA] fixed bottom-8 right-8"
        onClick={togglePreview}
      />

      {/* 메모 저장 확인 모달 */}
      {showSaveConfirmModal && (
        <Modal
          type="confirm"
          title="메모 저장"
          message="메모가 저장되었습니다."
          onClose={() => setShowSaveConfirmModal(false)}
          onConfirm={() => setShowSaveConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default Memo;
