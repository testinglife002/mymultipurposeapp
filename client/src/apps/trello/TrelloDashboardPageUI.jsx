// TrelloDashboardPageUI.jsx
import React, { useState, useEffect } from "react";
import newRequest from "../../api/newRequest";
import "./TrelloDashboardPageUI.css";
import CreateBoardModalUI from "./components/CreateBoardModalUI";
import BoardListUI from "./components/BoardListUI";

function TrelloDashboardPageUI({ user }) {
  const [boards, setBoards] = useState([]);
  const [loadingBoards, setLoadingBoards] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user) fetchBoards();
  }, [user]);

  const fetchBoards = async () => {
    setLoadingBoards(true);
    try {
      const { data } = await newRequest.get("/boards");
      setBoards(data);
    } catch (err) {
      console.error("Failed to fetch boards:", err.response?.data?.message || err.message);
    } finally {
      setLoadingBoards(false);
    }
  };

  const handleCreateBoard = async (boardData) => {
    try {
      const { data } = await newRequest.post("/boards", boardData);
      setBoards((prev) => [...prev, data]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create board:", err.response?.data?.message || err.message);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm("Are you sure you want to delete this board and all its contents?")) return;
    try {
      await newRequest.delete(`/boards/${boardId}`);
      setBoards((prev) => prev.filter((board) => board._id !== boardId));
    } catch (err) {
      console.error("Failed to delete board:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="trello-dashboard-page" style={{marginTop:'5%'}} >
      {/* Navbar */}
      <header className="trello-dashboard-navbar">
        <div className="trello-navbar-container">
          <div className="trello-navbar-brand">Your Boards</div>
          <div className="trello-navbar-right">
            <span className="navbar-welcome">Welcome, {user?.username || "Guest"}!</span>
            <button
              className="custom-btn primary"
              onClick={() => setIsModalOpen(true)}
            >
              ＋ Create Board
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="trello-dashboard-content">
        {loadingBoards ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <span>Loading boards...</span>
          </div>
        ) : (
          <BoardListUI boards={boards} onDeleteBoard={handleDeleteBoard} />
        )}
      </main>

      {/* Floating Create Board Button */}
      {user && (
        <button
          className="floating-create-btn"
          onClick={() => setIsModalOpen(true)}
          title="Create Board"
        >
          ＋
        </button>
      )}

      {/* Create Board Modal */}
      <CreateBoardModalUI
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBoardCreated={handleCreateBoard}
      />
    </div>
  );
}

export default TrelloDashboardPageUI;
