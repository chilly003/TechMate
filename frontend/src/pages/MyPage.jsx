import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/common/modal";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { IoAdd } from "react-icons/io5";
import { BsNewspaper, BsBookmark, BsQuestionCircle } from "react-icons/bs";
import { IoChevronBack, IoChevronForward } from "react-icons/io5"; // Add this import at the top
import { useDispatch, useSelector } from "react-redux";
import { fetchFolders, createFolder, deleteFolder, updateFolder } from "../store/slices/folderSlice";

const Mypage = () => {
  const dispatch = useDispatch();
  // Fix the selector to match the store structure
  const folderData = useSelector((state) => state.folder?.folders || { content: [] });
  const [activeFolder, setActiveFolder] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState("카리나"); // Dummy data
  const [newNickname, setNewNickname] = useState("");

  // Fetch folders when component mounts
  useEffect(() => {
    dispatch(fetchFolders());
  }, [dispatch]);

  // Update activeFolder when folders are loaded
  useEffect(() => {
    if (folderData.content.length > 0 && !activeFolder) {
      setActiveFolder(folderData.content[0].folderName);
    }
  }, [folderData.content, activeFolder]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    if (folderModalType === "add" && newFolderName.trim()) {
      // console.log("Creating new folder:", newFolderName);
      await dispatch(createFolder(newFolderName));
    } else if (folderModalType === "edit" && newFolderName.trim()) {
      const folderToEdit = folderData.content.find(f => f.folderName === activeFolder);
      if (folderToEdit) {
        // console.log("Updating folder:", folderToEdit.folderId, "with new name:", newFolderName);
        await dispatch(updateFolder({ folderId: folderToEdit.folderId, folderName: newFolderName }));
      }
    } else if (!folderModalType && newNickname.trim()) {
      setNickname(newNickname);
    }
    // console.log("Modal state before closing:", { folderModalType, newFolderName });
    handleCloseModal();
  };

  const handleEditClick = () => {
    setNewNickname(nickname);
    setIsModalOpen(true);
  };

  // Dummy data for activity statistics
  const stats = {
    readArticles: 153,
    scrappedArticles: 21,
    solvedQuizzes: 5,
  };

  // Dummy data for quiz history (March 2024)
  const quizHistory = Array(31)
    .fill(0)
    .map(() => Math.floor(Math.random() * 4)); // 0-3 quizzes per day

  const [folderModalType, setFolderModalType] = useState(null);

  const [newFolderName, setNewFolderName] = useState("");

  const handleFolderAction = (type, folder = null) => {
    console.log("Folder action triggered:", { type, folder });
    const activeFolder = folderData.content.find(f => f.folderName === folder);
    if (type === "delete" && activeFolder) {
      // console.log("Deleting folder:", activeFolder.folderId);
      dispatch(deleteFolder(activeFolder.folderId));
      return;
    }
    if (type === "edit" && activeFolder) {
      // console.log("Setting up edit for folder:", activeFolder.folderName);
      setNewFolderName(activeFolder.folderName);
    } else {
      setNewFolderName("");
    }
    setFolderModalType(type);
    setIsModalOpen(true);
    // console.log("Modal state after action:", { isModalOpen: true, folderModalType: type, newFolderName });
  };

  const scrollRef = React.useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (direction) => {
    if (direction === "left") {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } else {
      setCurrentIndex((prev) => Math.min(folderData.content.length - 3, prev + 1));
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
                <span>총 {stats.readArticles}개의 기사를 읽었습니다.</span>
              </div>
              <hr className="md-2" />
              <div className="flex items-center gap-3">
                <BsBookmark className="text-gray-600" size={20} />
                <span>
                  총 {stats.scrappedArticles}개의 기사를 스크랩했습니다.
                </span>
              </div>
              <hr className="md-2" />
              <div className="flex items-center gap-3 md-2">
                <BsQuestionCircle className="text-gray-600" size={20} />
                <span>총 {stats.solvedQuizzes}개의 퀴즈를 풀었습니다.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz History */}
        <div className="w-full md:w-2/3 h-full">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            퀴즈 풀이 현황
          </h2>
          <div className="bg-gray-50 rounded-xl p-4 h-[calc(100%-2rem)]">
            <div className="grid grid-cols-12 gap-2">
              {quizHistory.map((count, index) => (
                <div
                  key={index}
                  className={`w-full aspect-square rounded-sm ${
                    count === 0
                      ? "bg-gray-100"
                      : count === 1
                      ? "bg-gray-300"
                      : count === 2
                      ? "bg-gray-400"
                      : "bg-gray-600"
                  }`}
                  title={`${index + 1}일: ${count}개의 퀴즈`}
                />
              ))}
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
                className={`p-2 text-gray-600 hover:bg-gray-100 rounded-full ${
                  currentIndex === 0 ? "opacity-30" : ""
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
                        className={`flex-1 px-2 relative whitespace-nowrap text-center text-sm md:text-base ${
                          activeFolder === folder.folderName
                            ? "text-black border-b-2 border-black -mb-1"
                            : "text-gray-500"
                        }`}
                        onClick={() => setActiveFolder(folder.folderName)}
                      >
                        {folder.folderName}
                      </button>
                    ))}
                </div>
              </div>
              <button
                onClick={() => handleScroll("right")}
                className={`p-2 text-gray-600 hover:bg-gray-100 rounded-full ${
                  currentIndex >= folderData.content.length - 3
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
                <p>삭제하신다면 모든 스크랩 내용은 없어집니다.</p>
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
