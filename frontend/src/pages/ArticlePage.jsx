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
  const [avgColor, setAvgColor] = useState({ r: 128, g: 128, b: 128 });
  const [textColor, setTextColor] = useState("text-black");
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentScrapId, setCurrentScrapId] = useState(null);
  const [isNewFolderMode, setIsNewFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showUnscrapModal, setShowUnscrapModal] = useState(false);
  const [scrapToRemove, setScrapToRemove] = useState(null);
  const { article, liked, scraped, scrapId, status, error } = useSelector((state) => state.article);
  const { scraps } = useSelector((state) => state.scrap);
  const { folders } = useSelector((state) => state.folder);
  const { loading: quizLoading, quizzes } = useSelector((state) => state.quiz);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchArticleDetail(id));
    dispatch(fetchFolders());
    // Find and set current scrap ID
    if (scraped) {
      const scrap = scraps?.content?.find(
        (scrap) => scrap.articleId === parseInt(id)
      );
      setCurrentScrapId(scrap?.scrapId || null);
    }
  }, [dispatch, id, scraped]);

  // Move the function definition here, before it's used
  const handleSidePanelToggle = () => {
    if (!isSidePanelOpen) {
      setShowQuiz(false); // Reset quiz state when opening panel
    }
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  // 퀴즈 버튼 클릭 핸들러 추가
  const handleQuizClick = () => {
    dispatch(fetchQuizzes(id));
    setShowQuiz(true);
    setIsSidePanelOpen(true);
  };

  // 사이드 패널 닫을 때 퀴즈 상태도 초기화
  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false);
    setShowQuiz(false);
  };


  // Modal handlers
  const handleAddScrap = (folderId) => {
    dispatch(addScrap({ articleId: id, folderId }))
      .unwrap()
      .then(() => {
        setShowFolderModal(false);
        setIsSidePanelOpen(true);
        dispatch(fetchArticleDetail(id)); // Refresh article details to update scraped status
      });
  };

  const handleRemoveScrap = () => {
    dispatch(removeScrap(scrapToRemove))
      .unwrap()
      .then(() => {
        setShowUnscrapModal(false);
        setIsSidePanelOpen(false);
        dispatch(fetchArticleDetail(id)); // Refresh article details to update scraped status
      });
  };

  // Modify scrap button click handler
  const handleScrapButtonClick = () => {
    if (scraped) {
      setScrapToRemove(scrapId);  // articleSlice의 scrapId 사용
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
    // Calculate average color from image
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = ListImage; // Changed back to IntroImage

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;
      let r = 0,
        g = 0,
        b = 0;

      for (let i = 0; i < imageData.length; i += 4) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
      }

      const pixels = imageData.length / 4;
      const avgR = r / pixels;
      const avgG = g / pixels;
      const avgB = b / pixels;

      setAvgColor({ r: avgR, g: avgG, b: avgB });

      // Calculate brightness using relative luminance formula
      const brightness = (0.299 * avgR + 0.587 * avgG + 0.114 * avgB) / 255;
      setTextColor(brightness > 0.5 ? "text-black" : "text-white");
    };
  }, []);

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
          className={
            scraped ? "opacity-100" : "opacity-0 pointer-events-none"
          }
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
          // onClick={() => {
          //   if (scraped) {
          //     const currentScrap = scraps.content.find(
          //       (scrap) => scrap.articleId === parseInt(id)
          //     );
          //     if (currentScrap) {
          //       setScrapToRemove(currentScrap.scrapId);
          //       setShowUnscrapModal(true);
          //     }
          //   } else {
          //     setShowFolderModal(true);
          //   }
          // }}
          onClick={handleScrapButtonClick}
        />
      </div>

      {/*scrap remove Modal */}
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
          onConfirm={handleRemoveScrap}
        />
      )}

      {/* Folder Selection Modal */}
      {showFolderModal && !isNewFolderMode && (
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
              setIsNewFolderMode(true);
            } else {
              handleAddScrap(option.value);
            }
          }}
        />
      )}

      {showFolderModal && isNewFolderMode && (
        <Modal
          type="edit"
          title="새 폴더 만들기"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onClose={() => {
            setIsNewFolderMode(false);
            setShowFolderModal(false);
          }}
          onConfirm={async () => {
            try {
              const result = await dispatch(createFolder(newFolderName)).unwrap();
              await dispatch(fetchFolders());
              handleAddScrap(result.data.folderId);
              setIsNewFolderMode(false);
              setNewFolderName("");
            } catch (error) {
              console.error('Failed to create folder:', error);
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
              quizLoading ? (
                <div className="flex items-center justify-center h-full min-h-[calc(100vh-16rem)] w-full">
                  <div className="flex flex-col items-center justify-center text-center space-y-6">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-24 w-24 border-[6px] border-gray-200"></div>
                      <div className="absolute top-0 animate-spin rounded-full h-24 w-24 border-[6px] border-blue-500 border-t-transparent"></div>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-800 mb-4">퀴즈 생성 중</p>
                      <p className="text-xl text-gray-600">잠시만 기다려주세요</p>
                      <p className="text-sm text-gray-500 mt-2">곧 퀴즈가 준비됩니다!</p>
                    </div>
                  </div>
                </div>
              ) : (
                <Quiz articleId={id} quizzes={quizzes} onClose={handleCloseSidePanel} />
              )
            ) : (
              <Memo />
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
                : "md:bg-[rgb(var(--avg-color))]"
              }`}
            style={{
              ...sharedStyle,
              "--avg-color": `${avgColor.r}, ${avgColor.g}, ${avgColor.b}`,
            }}
          >
            <div className="px-8 md:px-12 max-w-2xl relative z-10">
              <p
                className={`text-xl text-white font-bold ${isSidePanelOpen ? "" : "md:" + textColor
                  } mb-4`}
              >
                {article?.category}
              </p>
              <h1
                className={`text-4xl md:text-7xl font-extrabold mb-6 md:mb-8 leading-tight text-white 
                                ${isSidePanelOpen ? "" : "md:" + textColor}
                                decoration-4 underline underline-offset-8 ${isSidePanelOpen
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
            </div>
          </div>
        </div>

        {/* Content Section - Adjust width when side panel is open */}
        <div className="relative">
          <div className="h-screen" />
          <div className="relative bg-white min-h-screen z-10">
            <div className="w-full flex flex-col items-center">
              <div
                className={`w-full px-8 ${isSidePanelOpen ? "md:w-[85%]" : "md:w-[50%]"
                  } md:px-0 pt-16 md:pt-24 pb-10`}
              >
                <div className="text-left space-y-8">
                  {article?.content?.split("\n").map((paragraph, index) => {
                    // Skip empty paragraphs
                    if (!paragraph.trim()) return null;

                    // Check if paragraph is a photo description (contains reporter name and email)
                    const isPhotoDesc =
                      paragraph.includes("@") &&
                      (paragraph.includes("기자") ||
                        paragraph.includes("연합뉴스"));

                    return (
                      <p
                        key={index}
                        className={`${isPhotoDesc
                          ? "text-gray-500 text-sm italic"
                          : "text-lg leading-relaxed text-gray-800"
                          } ${index === 0 ? "font-semibold text-xl" : ""}`}
                      >
                        {paragraph.trim()}
                      </p>
                    );
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
              <div className="w-full bg-gray-50 py-16">
                <div className="w-[95%] md:w-[90%] max-w-[2000px] mx-auto px-8">
                  <h2 className="text-2xl font-bold mb-8">연관 기사</h2>
                  <div className="relative">
                    <div className="overflow-x-auto pb-4 hide-scrollbar">
                      <div className="flex gap-6 w-max">
                        {article?.similarArticles
                          ?.slice(0, 4)
                          .map((relatedArticle) => (
                            <div
                              key={relatedArticle.articleId}
                              className="w-[300px] flex-shrink-0 cursor-pointer group"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
