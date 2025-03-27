import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/common/Modal";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { BsNewspaper, BsBookmark, BsQuestionCircle } from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import ArticleCard from "../components/article/ArticleCard";
import {
  fetchFolders,
  createFolder,
  deleteFolder,
  updateFolder,
} from "../store/slices/folderSlice";
import { fetchScraps } from "../store/slices/scrapSlice";
import { fetchNickname, fetchActivity, fetchQuizHistory } from "../store/slices/myPageSlice";
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";


const generateCalendarData = () => {
  const today = new Date();
  const startDate = new Date(today.getFullYear() - 1, today.getMonth(), 1);
  const endDate = today;

  // 시작일을 일요일로 맞추기
  const firstSunday = new Date(startDate);
  while (firstSunday.getDay() !== 0) {
    firstSunday.setDate(firstSunday.getDate() - 1);
  }

  // 주 단위로 데이터 생성
  const weeks = [];
  let currentDate = new Date(firstSunday);

  while (currentDate <= endDate) {
    let week = [];
    for (let i = 0; i < 7; i++) {
      if (currentDate <= endDate && currentDate >= startDate) {
        week.push(new Date(currentDate));
      } else {
        week.push(null);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }

  // 월 데이터 생성
  const months = [];
  let currentMonth = startDate.getMonth();
  let currentYear = startDate.getFullYear();
  let weekCounter = 0;

  while (currentYear < endDate.getFullYear() ||
    (currentYear === endDate.getFullYear() && currentMonth <= endDate.getMonth())) {
    const monthWeeks = weeks.filter((week, index) => {
      const firstDayOfWeek = week.find(day => day !== null);
      return firstDayOfWeek &&
        firstDayOfWeek.getMonth() === currentMonth &&
        firstDayOfWeek.getFullYear() === currentYear;
    });

    months.push({
      month: format(new Date(currentYear, currentMonth), 'MMM'),
      weeksCount: monthWeeks.length
    });

    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  return { weeks, months };
};


const Mypage = () => {
  const dispatch = useDispatch();
  // Add quizHistory to the destructured state
  const { nickname, activity, quizHistory, loading, error } = useSelector((state) => state.myPage);
  const [newNickname, setNewNickname] = useState("");
  const folderData = useSelector(
    (state) => state.folder?.folders || { content: [] }
  );
  const scraps = useSelector((state) => state.scrap?.scraps?.content || []);
  const [activeFolder, setActiveFolder] = useState(null);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // months 변수를 calendarData로 변경
  const calendarData = generateCalendarData();
  // console.log('Calendar Data:', calendarData); // Add this line temporarily to verify the data

  // Fetch folders when component mounts
  useEffect(() => {
    dispatch(fetchNickname());
    dispatch(fetchActivity());
    dispatch(fetchFolders());
    dispatch(fetchQuizHistory());
  }, [dispatch]);

  // Update activeFolder when folders are loaded
  useEffect(() => {
    if (folderData.content.length > 0 && !activeFolder) {
      const firstFolder = folderData.content[0];
      setActiveFolder(firstFolder.folderName);
      setActiveFolderId(firstFolder.folderId);
    }
  }, [folderData.content, activeFolder]);

  useEffect(() => {
    if (activeFolderId) {
      console.log('Dispatching fetchScraps for folder ID:', activeFolderId);
      dispatch(fetchScraps(activeFolderId));
    }
  }, [activeFolderId, dispatch]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFolderAction = (type, folder = null) => {
    const activeFolder = folderData.content.find(
      (f) => f.folderName === folder
    );
    if (type === "delete" && activeFolder) {
      setFolderModalType(type);
      setIsModalOpen(true);
      return;
    }
    if (type === "edit" && activeFolder) {
      setNewFolderName(activeFolder.folderName);
    } else {
      setNewFolderName("");
    }
    setFolderModalType(type);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    if (folderModalType === "add" && newFolderName.trim()) {
      await dispatch(createFolder(newFolderName));
    } else if (folderModalType === "edit" && newFolderName.trim()) {
      const folderToEdit = folderData.content.find(
        (f) => f.folderName === activeFolder
      );
      if (folderToEdit) {
        await dispatch(
          updateFolder({
            folderId: folderToEdit.folderId,
            folderName: newFolderName,
          })
        );
      }
    } else if (folderModalType === "delete") {
      const folderToDelete = folderData.content.find(
        (f) => f.folderName === activeFolder
      );
      if (folderToDelete) {
        await dispatch(deleteFolder(folderToDelete.folderId));
        if (folderData.content.length > 1) {
          const nextFolder = folderData.content.find(f => f.folderId !== folderToDelete.folderId);
          setActiveFolder(nextFolder.folderName);
          setActiveFolderId(nextFolder.folderId);
        } else {
          setActiveFolder(null);
          setActiveFolderId(null);
        }
        await dispatch(fetchFolders());
      }
    } else if (!folderModalType && newNickname.trim()) {
      setNickname(newNickname);
    }
    handleCloseModal();
  };

  const handleEditClick = () => {
    setNewNickname(nickname || "");
    setIsModalOpen(true);
  };

  const [folderModalType, setFolderModalType] = useState(null);

  const [newFolderName, setNewFolderName] = useState("");

  const scrollRef = React.useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (direction) => {
    if (direction === "left") {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } else {
      setCurrentIndex((prev) =>
        Math.min(folderData.content.length - 3, prev + 1)
      );
    }
  };

  return (
    <div className="px-8 pt-20 md:p-24 max-w-7xl mx-auto ">
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center">
          <div className="bg-[#1a237e] text-white text-3xl md:text-5xl font-bold">
            {nickname}
          </div>
          <span className="text-3xl md:text-5xl font-bold ml-1">님</span>
        </div>
        <div
          className="text-[#666] bg-gray-100 p-2 rounded-full cursor-pointer hover:bg-gray-200"
          onClick={handleEditClick}
        >
          <FiEdit2 size={20} />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col gap-8 h-full mt-12 pb-4">
        {/* Activity Statistics */}
        <div className="w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">활동 내역</h2>
          <div className="bg-gray-50 rounded-xl p-4 inline-block">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <BsNewspaper className="text-gray-600" size={20} />
                <span>총 {activity.readArticlesCount}개의 기사를 읽었습니다.</span>
              </div>
              <hr className="md-2" />
              <div className="flex items-center gap-3">
                <BsBookmark className="text-gray-600" size={20} />
                <span>총 {activity.scrapArticlesCount}개의 기사를 스크랩했습니다.</span>
              </div>
              <hr className="md-2" />
              <div className="flex items-center gap-3">
                <BsQuestionCircle className="text-gray-600" size={20} />
                <span>총 {activity.solvedQuizCount}개의 퀴즈를 풀었습니다.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz History - Full Width */}
        <div className="w-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 pt-3">퀴즈 풀이 현황</h2>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full" style={{ borderSpacing: '2px' }}>
                <thead>
                  <tr className="h-8 text-xs text-gray-400">
                    <td className="w-[50px] min-w-[50px]"></td>
                    {calendarData.months.map((month, idx) => (
                      <td
                        key={idx}
                        className="text-left"
                        colSpan={month.weeksCount}
                        style={{
                          position: 'relative',
                          height: '20px',
                          minWidth: `${month.weeksCount * 14}px`
                        }}
                      >
                        <span style={{ position: 'absolute', top: 0 }}>{month.month}</span>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIdx) => (
                    <tr key={day}>
                      <td className="text-xs text-gray-400 h-[12px]" style={{ position: 'relative' }}>
                        <span style={{
                          position: 'absolute',
                          bottom: dayIdx === 0 ? '0' : '1px',
                          left: '0'
                        }}>
                          {day}
                        </span>
                      </td>

                      {/* // In the calendar cell rendering part */}
                      {calendarData.weeks.map((week, weekIdx) => {
                        const date = week[dayIdx];
                        if (!date) return (
                          <td
                            key={weekIdx}
                            className="w-[12px] h-[12px]"
                            style={{
                              minWidth: '12px',
                              maxWidth: '12px'
                            }}
                          />
                        );
                        
                        const formattedDate = format(date, 'yyyy-MM-dd');
                        // console.log(formattedDate)
                        // Convert string to number and ensure it's a valid number
                        const quizCount = parseInt(quizHistory?.[formattedDate]) || 0;
                        // console.log(quizCount)

                        const getBackgroundColor = (count) => {
                          // Ensure count is treated as a number
                          const numCount = parseInt(count);
                          if (numCount === 0) return '#ebedf0';
                          if (numCount === 1) return '#9be9a8';
                          if (numCount === 2) return '#40c463';
                          if (numCount >= 3) return '#216e39';
                          return '#ebedf0';  // default color
                        };
                        
                        return (
                          <td
                            key={weekIdx}
                            className="w-[12px] h-[12px] rounded-sm"
                            style={{
                              backgroundColor: getBackgroundColor(quizCount),
                              cursor: 'pointer',
                              minWidth: '12px',
                              maxWidth: '12px'
                            }}
                            title={`${formattedDate}: ${quizCount}개의 퀴즈`}
                          />
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
                <span>퀴즈 풀이 수:</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: level === 0 ? '#ebedf0'
                          : level === 1 ? '#9be9a8'
                            : level === 2 ? '#40c463'
                              : '#216e39'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Modal */}
      {isModalOpen && (
        <Modal
          type="edit"
          title="닉네임 수정"
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
        >
          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            placeholder="닉네임을 입력하세요"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </Modal>
      )}

      {/* Scrap Management Section - Moved inside main container */}
      <div className="w-full">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 pt-8">스크랩한 뉴스</h2>
        <div className="rounded-xl mt-4">
          {/* Folder Tabs */}
          <div className="flex flex-col md:flex-row items-center border-b border-gray-200">
            <div className="flex items-center flex-1">
              <button
                onClick={() => handleScroll("left")}
                className={`p-2 text-gray-600 hover:bg-gray-100 rounded-full ${currentIndex === 0 ? "opacity-30" : ""}`}
                disabled={currentIndex === 0}
              >
                <IoChevronBack className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="w-full md:w-[300px] lg:w-[400px]">
                <div className="flex justify-between">
                  {folderData.content
                    .slice(currentIndex, currentIndex + 3)
                    .map((folder) => (
                      <button
                        key={folder.folderId}
                        className={`flex-1 px-2 relative whitespace-nowrap text-center text-sm md:text-base ${activeFolder === folder.folderName
                            ? "text-black border-b-2 border-black -mb-1"
                            : "text-gray-500"
                          }`}
                        onClick={() => {
                          setActiveFolder(folder.folderName);
                          setActiveFolderId(folder.folderId);
                        }}
                      >
                        {folder.folderName}
                      </button>
                    ))}
                </div>
              </div>
              <button
                onClick={() => handleScroll("right")}
                className={`p-2 text-gray-600 hover:bg-gray-100 rounded-full ${currentIndex >= folderData.content.length - 3 ? "opacity-30" : ""
                  }`}
                disabled={currentIndex >= folderData.content.length - 3}
              >
                <IoChevronForward className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            {/* Management buttons - Moved to new row on mobile */}
            <div className="flex justify-center w-full mt-4 md:mt-0 md:w-auto md:justify-end gap-2 pb-2 md:pb-0">
              <button
                className="p-2 text-gray-800 hover:bg-gray-100 rounded-full"
                onClick={() => handleFolderAction("add")}
              >
                <IoAdd className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                onClick={() => handleFolderAction("edit", activeFolder)}
              >
                <FiEdit2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                onClick={() => handleFolderAction("delete", activeFolder)}
              >
                <FiTrash2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Article Cards Grid */}
        <div className="mt-8">
          {scraps.length === 0 ? (
            <div className="text-center text-gray-500 py-8">이 폴더에 스크랩된 뉴스가 없습니다.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scraps.map((scrap) => (
                <ArticleCard
                  key={scrap.scrapId}
                  id={scrap.articleId}
                  title={scrap.title}
                  journal={scrap.journal}
                  summary={scrap.summary}
                  category={scrap.category}
                  imageUrl={scrap.images?.[0]?.imageUrl}
                  datetime={scrap.datetime}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for folder actions */}
      {isModalOpen && folderModalType && (
        <Modal
          type={folderModalType === "delete" ? "confirm" : "edit"}
          title={
            folderModalType === "add"
              ? "폴더 추가"
              : folderModalType === "edit"
                ? "폴더명 수정"
                : "폴더 삭제"
          }
          message={
            folderModalType === "delete" ? (
              <div className="text-center">
                <p>폴더를 삭제하시겠습니까?</p>
                <p>삭제 후 모든 스크랩 내용은 없어집니다.</p>
              </div>
            ) : null
          }
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        >
          {folderModalType !== "delete" && (
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="폴더명을 입력하세요"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default Mypage;
