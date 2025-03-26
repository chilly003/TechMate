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
import { fetchNickname, fetchActivity } from "../store/slices/myPageSlice";
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
// import { format } from "date-fns/format";
// import { subMonths } from "date-fns/subMonths";
// import { startOfMonth } from "date-fns/startOfMonth";
// import { endOfMonth } from "date-fns/endOfMonth";
// import { eachDayOfInterval } from "date-fns/eachDayOfInterval";


const Mypage = () => {
  const dispatch = useDispatch();
  const { nickname, activity, loading, error } = useSelector((state) => state.myPage);
  const [newNickname, setNewNickname] = useState("");
  const folderData = useSelector(
    (state) => state.folder?.folders || { content: [] }
  );
  const scraps = useSelector((state) => state.scrap?.scraps?.content || []);
  const [activeFolder, setActiveFolder] = useState(null);
  const [activeFolderId, setActiveFolderId] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Add calendar data generation
  const generateCalendarData = () => {
    const today = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(today, 11 - i);
      return {
        month: format(date, 'MMM'),
        fullName: format(date, 'MMMM'),
        days: eachDayOfInterval({
          start: startOfMonth(date),
          end: endOfMonth(date)
        })
      };
    });
    return months;
  };

  const months = generateCalendarData();

  // ... other code remains the same

  // Fetch folders when component mounts
  useEffect(() => {
    dispatch(fetchNickname());
    dispatch(fetchActivity());
    dispatch(fetchFolders());
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
    <div className="p-4 pt-20 md:p-24 max-w-7xl mx-auto ">
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
      <div className="flex flex-col md:flex-row gap-8 h-full mt-12">
        {/* Activity Statistics */}
        <div className="w-full md:w-1/3 h-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">활동 내역</h2>
          <div className="bg-gray-50 rounded-xl p-4 h-[calc(100%-2rem)]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 mt-2">
                <BsNewspaper className="text-gray-600" size={20} />
                <span>총 {activity.readArticlesCount}개의 기사를 읽었습니다.</span>
              </div>
              <hr className="md-2" />
              <div className="flex items-center gap-3">
                <BsBookmark className="text-gray-600" size={20} />
                <span>
                  총 {activity.scrapArticlesCount}개의 기사를 스크랩했습니다.
                </span>
              </div>
              <hr className="md-2" />
              <div className="flex items-center gap-3 md-2">
                <BsQuestionCircle className="text-gray-600" size={20} />
                <span>총 {activity.solvedQuizCount}개의 퀴즈를 풀었습니다.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz History - Updated Design */}
        <div className="w-full md:w-2/3 h-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">퀴즈 풀이 현황</h2>
          <div className="bg-gray-50 rounded-xl p-4 overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full" style={{ borderSpacing: '3px' }}>
                <thead>
                  <tr className="h-8 text-xs text-gray-400">
                    <td style={{ width: '28px' }}></td>
                    {months.map((month, idx) => (
                      <td
                        key={idx}
                        className="text-left"
                        colSpan={month.days.length}
                        style={{ position: 'relative' }}
                      >
                        <span style={{ position: 'absolute', top: 0 }}>{month.month}</span>
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, dayIdx) => (
                    <tr key={day} style={{ height: '10px' }}>
                      <td className="text-xs text-gray-400" style={{ position: 'relative' }}>
                        <span style={{
                          position: 'absolute',
                          bottom: dayIdx === 0 ? '0' : '5px',
                          left: '0'
                        }}>
                          {day}
                        </span>
                      </td>
                      {months.map(month =>
                        month.days
                          .filter(date => date.getDay() === dayIdx)
                          .map((date, idx) => (
                            <td
                              key={date.toISOString()}
                              className="w-[10px] h-[10px] rounded-sm"
                              style={{
                                backgroundColor: '#ebedf0',
                                cursor: 'pointer'
                              }}
                              title={`${format(date, 'yyyy-MM-dd')}: 0개의 퀴즈`}
                            />
                          ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2 flex items-center justify-end gap-2 text-xs text-gray-600">
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

      {/* Scrap Management Section */}
      <div className="mt-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">스크랩한 뉴스</h2>
        <div className="rounded-xl mt-4">
          {/* Folder Tabs */}
          <div className="flex items-center border-b border-gray-200">
            <div className="flex items-center flex-1">
              <button
                onClick={() => handleScroll("left")}
                className={`p-2 text-gray-600 hover:bg-gray-100 rounded-full ${currentIndex === 0 ? "opacity-30" : ""
                  }`}
                disabled={currentIndex === 0}
              >
                <IoChevronBack className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="w-full md:w-[300px] lg:w-[400px]">
                {/* Update the folders mapping */}
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
                className={`p-2 text-gray-600 hover:bg-gray-100 rounded-full ${currentIndex >= folderData.content.length - 3
                  ? "opacity-30"
                  : ""
                  }`}
                disabled={currentIndex >= folderData.content.length - 3}
              >
                <IoChevronForward className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="flex gap-1 md:gap-2">
                <button
                  className="p-2 text-gray-800 hover:bg-gray-100 rounded-full"
                  onClick={() => handleFolderAction("add")}
                >
                  <IoAdd className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              </div>
            </div>
            <div className="flex justify-end md:gap-2">
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
