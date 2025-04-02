import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import ListImage from "../assets/images/ArticleCardImage.jpg";
import ArticleCard from "../components/article/ArticleCard";
import Memo from "../components/article/Memo";
import Quiz from "../components/article/Quiz";
import Modal from "../components/common/Modal";
import { fetchFolders, createFolder } from "../store/slices/folderSlice";
import { fetchQuizzes } from "../store/slices/quizSlice";
import {
  fetchArticleDetail,
  toggleLikeArticle,
} from "../store/slices/articleSilce";
import { addScrap, removeScrap } from "../store/slices/scrapSlice";
import FloatingButton from "../components/ui/FloatingButton";

const ArticlePage = () => {
  const navigate = useNavigate();
  // url 파라미터를 통해 기사 id 추출 (메모 컴포넌트 전달용)
  const { id } = useParams();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [textColor, setTextColor] = useState("text-black");
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFolderNameModal, setShowFolderNameModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showUnscrapModal, setShowUnscrapModal] = useState(false);
  const [scrapToRemove, setScrapToRemove] = useState(null);
  const { article, status, liked, scraped, scrapId } = useSelector(
    (state) => state.article
  );
  const { scraps } = useSelector((state) => state.scrap);
  const { folders } = useSelector((state) => state.folder);
  const { loading: quizLoading, error, quizzes } = useSelector((state) => state.quiz);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchArticleDetail(id));
    dispatch(fetchFolders());
    // Remove the unnecessary scraped state check since we're using Redux store
  }, [dispatch, id]);

  if (error) {
    console.log(error);
  }

  // Move the function definition here, before it's used
  const handleSidePanelToggle = () => {
    if (!isSidePanelOpen) {
      setShowQuiz(false); // Reset quiz state when opening panel
    }
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  // 퀴즈 버튼 클릭 핸들러 추가
  const handleQuizClick = () => {
    setShowQuiz(true);
    setIsSidePanelOpen(true);

    const fetchQuizWithRetry = () => {
      dispatch(fetchQuizzes(id))
        .unwrap()
        .then(() => {
          // Quiz loaded successfully
        })
        .catch((error) => {
          if (error.status === 404 && error.reason?.includes('퀴즈가 생성중')) {
            setTimeout(() => {
              console.log('퀴즈 생성 중... 재시도합니다.');
              fetchQuizWithRetry();
            }, 2000);
          } else {
            console.error('퀴즈 로딩 실패:', error);
            setShowQuiz(false);
            setIsSidePanelOpen(false);
          }
        });
    };

    fetchQuizWithRetry();
  };

  // 사이드 패널 닫을 때 퀴즈 상태도 초기화
  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false);
    setShowQuiz(false);
  };

  // Modify scrap button click handler
  const handleScrapButtonClick = () => {
    if (scraped) {
      setScrapToRemove(scrapId); // articleSlice의 scrapId 사용
      setShowUnscrapModal(true);
    } else {
      setShowFolderModal(true);
    }
  };

  // Add this useEffect for scroll reset
  // Modify the scroll reset useEffect
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsSidePanelOpen(false); // Close side panel when article changes
  }, [id]);


  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const sharedStyle = {
    filter: `brightness(${Math.max(0.6, 1 - scrollPosition * 0.002)})`,
  };

  const imageStyle = {
    transform: `scale(${1 + scrollPosition * 0.0008})`,
    ...sharedStyle,
  };

  return (
    <div className="relative ">
      {/* Floating Buttons */}
      <div
        className={`z-50 flex flex-col gap-2 fixed bottom-8 right-8 
        ${isSidePanelOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <FloatingButton
          text={<FiEdit size={24} />}
          color="from-green-500 to-green-600"
          onClick={handleSidePanelToggle}
          className={scraped ? "opacity-100" : "opacity-0 pointer-events-none"}
        />

        <FloatingButton
          text={
            liked ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />
          }
          color="from-pink-500 to-pink-600"
          onClick={() => {
            dispatch(toggleLikeArticle(id));
          }}
        />
        <FloatingButton
          text={
            scraped ? <BsBookmarkFill size={24} /> : <BsBookmark size={24} />
          }
          color="from-blue-500 to-blue-600"
          onClick={handleScrapButtonClick}
        />
      </div>

      {/* Folder Selection Modal */}
      {showFolderModal && (
        <Modal
          type="select"
          title="스크랩할 폴더 선택"
          options={folders?.content?.map((folder) => ({
            label: folder.folderName,
            value: folder.folderId,
          }))}
          onClose={() => setShowFolderModal(false)}
          onConfirm={(option) => {
            if (option.type === "new_folder") {
              setShowFolderModal(false);
              setShowFolderNameModal(true);
              return;
            }
            dispatch(addScrap({ articleId: id, folderId: option.value }))
              .unwrap()
              .then(() => {
                setShowFolderModal(false);
                setIsSidePanelOpen(true);
                dispatch(fetchArticleDetail(id)); // 스크랩 후 기사 정보 새로고침
              });
          }}
        />
      )}

      {/* scrap remove Modal */}
      {showUnscrapModal && (
        <Modal
          type="confirm"
          title="스크랩 취소"
          message={
            <>
              <p>정말 스크랩을 취소하시겠습니까?</p>
              <p>취소 후 모든 메모는 없어집니다.</p>
            </>
          }
          onClose={() => setShowUnscrapModal(false)}
          onConfirm={() => {
            dispatch(removeScrap(scrapToRemove))
              .unwrap()
              .then(() => {
                setShowUnscrapModal(false);
                setIsSidePanelOpen(false);
                dispatch(fetchArticleDetail(id)); // 스크랩 취소 후 기사 정보 새로고침
              });
          }}
        />
      )}

      {/* New Folder Name Modal */}
      {showFolderNameModal && (
        <Modal
          type="edit"
          title="새 폴더 만들기"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onClose={() => {
            setShowFolderNameModal(false);
            setNewFolderName("");
          }}
          onConfirm={() => {
            if (newFolderName.trim()) {
              dispatch(createFolder(newFolderName.trim())).then(() => {
                dispatch(fetchFolders()); // 폴더 목록 새로고침
                setShowFolderNameModal(false);
                setNewFolderName("");
                setShowFolderModal(true); // 폴더 선택 모달 다시 열기
              });
            }
          }}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[100] ${isSidePanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="h-full  overflow-hidden">
          <button
            onClick={() => setIsSidePanelOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            className="flex-1 overflow-y-auto p-8"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onScroll={(e) => e.stopPropagation()}
            style={{ overscrollBehavior: "contain" }}
          >
            {showQuiz ? (
              <div className="flex-1 overflow-y-auto p-8">
                {quizLoading || !quizzes?.length ? (
                  <div className="flex items-center justify-center h-full min-h-[calc(100vh-16rem)] w-full">
                    <div className="flex flex-col items-center justify-center text-center space-y-6">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-24 w-24 border-[6px] border-gray-200"></div>
                        <div className="absolute top-0 animate-spin rounded-full h-24 w-24 border-[6px] border-blue-500 border-t-transparent"></div>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-gray-800 mb-4">
                          퀴즈 생성 중
                        </p>
                        <p className="text-xl text-gray-600">
                          잠시만 기다려주세요
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          AI가 기사를 분석하여 퀴즈를 만들고 있습니다
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Quiz
                    articleId={id}
                    quizzes={quizzes}
                    onClose={handleCloseSidePanel}
                  />
                )}
              </div>
            ) : (
              <Memo articleId={id} />
            )}
          </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out ${isSidePanelOpen ? "md:w-1/2" : "w-full"
          }`}
      >
        {/* Hero Section */}
        <div
          className={`fixed inset-0 flex flex-col ${isSidePanelOpen ? "" : "md:flex-row"
            } h-screen ${isSidePanelOpen ? "md:w-1/2" : "w-full"}`}
        >
          {/* Image Section */}
          <div
            className={`relative w-full h-full ${isSidePanelOpen ? "" : "md:w-1/2"
              } overflow-hidden`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                ...imageStyle,
                backgroundImage: `url(${article?.images[0]?.imageUrl})`,
              }}
            />
            <div
              className={`absolute inset-0 bg-black/50`}
            />
          </div>

          {/* Text Section */}
          <div
            className={`absolute ${isSidePanelOpen ? "" : "md:relative"
              } w-full ${isSidePanelOpen ? "" : "md:w-1/2"
              } h-full flex items-center ${isSidePanelOpen
                ? "bg-transparent"
                : "md:bg-black"
              }`}
          >
            <div className="px-8 md:px-12 max-w-2xl relative z-10">
              <p
                className={`text-xl text-white font-['Pretendard-Black'] ml-2 ${isSidePanelOpen ? "" : "md:" + textColor
                  } mb-4`}
              >
                {article?.category}
              </p>
              <h1
                className={`text-4xl md:text-h1 font-['Pretendard-Black'] mb-6 md:mb-8 leading-tight text-white
                                ${isSidePanelOpen ? "" : "md:" + textColor}
                                decoration-4 md:decoration-8 underline underline-offset-[5px] md:underline-offset-[15px] ${isSidePanelOpen
                    ? "decoration-white"
                    : "md:decoration-current"
                  }`}
              >
                {article?.title}
              </h1>
              <p
                className={`text-lg md:text-xl mb-4 md:mb-6 text-white ${isSidePanelOpen ? "" : "md:" + textColor
                  } opacity-80`}
              >
                {article?.summary}
              </p>
              <p
                className={`text-sm md:text-base text-white ${isSidePanelOpen ? "" : "md:" + textColor
                  } opacity-70`}
              >
                {article?.reporter}
              </p>
              <p
                className={`text-sm md:text-base text-white ${isSidePanelOpen ? "" : "md:" + textColor
                  } opacity-70`}
              >
                {article?.datetime}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section - Adjust width when side panel is open */}
        <div className="relative">
          <div className="h-screen" />
          <div className="relative bg-[#FDFBF7] min-h-screen z-10">
            <div className="w-full flex flex-col items-center">
              <div
                className={`w-full px-8 ${isSidePanelOpen ? "md:w-[85%]" : "md:w-[50%]"
                  } md:px-0 pt-16 md:pt-24 pb-10`}
              >
                <div className="text-left space-y-8">
                  {article?.content?.split("\n").map((paragraph, index, paragraphs) => {
                    // Skip empty paragraphs
                    if (!paragraph.trim()) return null;

                    const elements = [];

                    // Check if we should insert an image before this paragraph
                    // Skip first image as it's used in the hero section
                    if (article?.images && article.images.length > 1 && index > 0) {
                      // Calculate which image to show (excluding the first image)
                      const currentImageIndex = Math.floor(index / 3) + 1; // Every 3 paragraphs
                      if (currentImageIndex < article.images.length && index % 3 === 0) {
                        const image = article.images[currentImageIndex];
                        elements.push(
                          <div key={`image-${currentImageIndex}`} className="my-8">
                            <img
                              src={image.imageUrl}
                              alt={image.caption || "Article image"}
                              className="w-full h-auto rounded-lg shadow-lg"
                            />
                            {image.caption && (
                              <p className="mt-2 text-sm text-gray-500 italic">
                                {image.caption}
                              </p>
                            )}
                          </div>
                        );
                      }
                    }

                    // Check if paragraph is a photo description
                    const isPhotoDesc =
                      paragraph.includes("@") &&
                      (paragraph.includes("기자") ||
                        paragraph.includes("연합뉴스"));

                    // Add the paragraph
                    elements.push(
                      <p
                        key={`paragraph-${index}`}
                        className={`${isPhotoDesc ? "text-gray-500 text-sm italic" : "text-lg leading-relaxed text-gray-800"} 
                        ${index === 0 ? "font-semibold text-xl" : ""}`}
                      >
                        {paragraph.trim()}
                      </p>
                    );

                    return elements;
                  })}
                </div>
              </div>

              {/* 퀴즈 풀기 버튼 */}
              <div className="mt-8 text-center flex-shrink-0 mb-12">
                <button
                  onClick={handleQuizClick}
                  className="preview-button bg-gradient-to-r from-[#1B2C7A] to-[#72B7CA] text-white px-6 py-2 rounded"
                >
                  퀴즈 풀기
                </button>
              </div>

              {/* Related Articles Section - Full width */}
              <div className="w-full bg-[#FDFBF7] py-16">
                <div className="w-[95%] md:w-[90%] max-w-[2000px] mx-auto px-8">
                  <h2 className="text-2xl font-['Pretendard-Black'] mb-8">연관 기사</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {article?.similarArticles
                      ?.slice(0, 4)
                      .map((relatedArticle) => (
                        <div
                          key={relatedArticle.articleId}
                          className="cursor-pointer group"
                          onClick={() =>
                            navigate(`/article/${relatedArticle.articleId}`)
                          }
                        >
                          <ArticleCard
                            id={relatedArticle.articleId}
                            title={relatedArticle.title}
                            journal={relatedArticle.journal}
                            category={relatedArticle.category}
                            summary={relatedArticle.summary || ""}
                            imageUrl={
                              relatedArticle.thumbnailImageUrl || ListImage
                            }
                            datetime={relatedArticle.datetime}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <footer className="w-full bg-[#111111] text-white">
                <div className="w-[95%] md:w-[90%] max-w-[2000px] mx-auto px-8 py-20">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Logo and Description */}
                    <div className="md:col-span-5 space-y-8">
                      <h2 className="text-4xl font-['Pretendard-Black']">TechMate</h2>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        IT 기술 뉴스를 더 쉽게 이해하고<br />
                        학습할 수 있도록 도와주는 서비스
                      </p>
                    </div>

                    {/* Navigation */}
                    {/* <div className="md:col-span-3 space-y-8">
                      <h3 className="text-xl font-semibold">Navigation</h3>
                      <ul className="space-y-4">
                        <li><a href="/home" className="text-gray-400 hover:text-white transition-colors">홈</a></li>
                        <li><a href="/scrap" className="text-gray-400 hover:text-white transition-colors">스크랩</a></li>
                        <li><a href="/mypage" className="text-gray-400 hover:text-white transition-colors">마이페이지</a></li>
                      </ul>
                    </div> */}

                    {/* Contact */}
                    <div className="md:col-span-4 space-y-8">
                      <h3 className="text-xl font-semibold">Contact</h3>
                      <ul className="space-y-4">
                        <li className="text-gray-400">SSAFY 12기 공통 프로젝트</li>
                        <li className="text-gray-400">B201팀</li>
                      </ul>
                    </div>
                  </div>

                  {/* Copyright */}
                  <div className="mt-16 pt-8 border-t border-gray-800">
                    <p className="text-gray-500 text-sm">
                      © 2025 TechMate. All rights reserved.
                    </p>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
