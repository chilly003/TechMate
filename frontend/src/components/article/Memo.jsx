import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import FloatingButton from "../ui/FloatingButton";
import "../../styles/memo.css";

/**
 * @description 스크랩된 기사의 메모 컴포넌트
 *
 * @todo [메모 내용] 기존 작성된 메모 내용 불러오기
 * @todo [메모 내용] 구현 방법: [서버에서 저장된 메모 데이터 조회]
 * @todo [메모 내용] 요구사항: [텍스트 에디터로 메모 내용 편집 가능]
 *
 * @todo [저장 기능] 메모 내용 서버 저장
 * @todo [저장 기능] 구현 방법: [작성된 메모 데이터를 서버로 전송]
 * @todo [저장 기능] 요구사항: [하단에 저장 버튼 배치]
 *
 * @todo [폴더 관리] 메모가 속한 폴더 수정 기능
 * @todo [폴더 관리] 구현 방법: [폴더 선택 드롭다운 구현]
 * @todo [폴더 관리] 요구사항: [현재 폴더 표시 및 변경 가능]
 *
 * @todo [작성일] 메모 작성일 표시
 * @todo [작성일] 구현 방법: [서버에서 받은 작성일 데이터 포맷팅]
 * @todo [작성일] 요구사항: [날짜 형식으로 표시]
 */

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
    strong: ({ children }) => (
        <strong>{children}</strong>
    ),
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
        const match = /language-(\w+)/.exec(className || '');
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


const Memo = () => {
  const [markdown, setMarkdown] = useState("# 마크다운을 입력하세요");
  const [isPreview, setIsPreview] = useState(false);
  const [category, setCategory] = useState("프론트엔드");

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

  // 카테고리 더미 데이터
  const categories = ["프론트엔드", "관심 유"];

  return (
    <div className="markdown-container p-4">
      {/* 상단 작성일자와 카테고리 */}
        <div className="grid grid-cols-1 gap-2">
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
              <div>{formattedDate}</div>
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
              <label className="text-sm text-gray-500">파일</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full mt-1 text-gray-700 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

      {/* 마크다운 에디터 및 미리보기 */}
      {!isPreview ? (
        <textarea
          className="markdown-editor w-full h-[300px] border border-gray-300 rounded p-2"
          value={markdown}
          onChange={handleInputChange}
        />
      ) : (
        <div className="markdown-preview w-full h-[300px] border border-gray-300 rounded p-2 overflow-auto">
          <ReactMarkdown
            components={CustomComponents}
            remarkPlugins={[remarkGfm]}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      )}

      {/* 저장 버튼 */}
      <div className="mt-4 text-center">
        <button className="preview-button bg-blue-500 text-white px-4 py-2 rounded">
          저장하기
        </button>
      </div>

      {/* 플로팅 버튼 (우측 하단 고정) */}
      <FloatingButton
        text={isPreview ? "메모" : "미리보기"}
        color="from-[#1B2C7A] to-[#72B7CA]"
        onClick={togglePreview}
      />
    </div>
  );
};

export default Memo;
