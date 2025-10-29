// client/src/pages/BoardDetailsPageUI.jsx
// client/src/pages/BoardDetailsPageUI.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiActivity, FiUsers, FiEdit3, FiTrash2 } from "react-icons/fi";
import { Activity, Users } from "lucide-react";
import newRequest from "../../../api/newRequest";
import ListColumns from "./ListColumns";
import NavbarUI from "./NavbarUI";
import ActivitiesFeeds from "./ActivitiesFeeds";
import "./BoardDetailsPageUI.css";
import AssignUserModalUI from "./AssignUserModalUI";

function BoardDetailsPageUI() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [members, setMembers] = useState([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [showAssign, setShowAssign] = useState(false);
  const [showActivityFeeds, setShowActivityFeeds] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editBoardData, setEditBoardData] = useState({ name: "", description: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /*
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await newRequest.get(`/boards/${boardId}`);
        setBoard(res.data);
        setLists(res.data.lists || []);
        setMembers(res.data.members || []);
        setEditBoardData({ name: res.data.name, description: res.data.description });
      } catch (err) {
        console.error("Failed to fetch board:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await newRequest.get("/users/allusers");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchBoard();
    fetchUsers();
  }, [boardId]);
  */

  // Fetch board details + lists
  useEffect(() => {
    const fetchBoardData = async () => {
      setLoading(true);
      try {
        const boardRes = await newRequest.get(`/boards/${boardId}`);
        setBoard(boardRes.data);
        setMembers(boardRes.data.members || []);

        const listsRes = await newRequest.get(`/boards/${boardId}/lists`);
        // Initialize cards array for each list
        const listsWithCards = await Promise.all(
          listsRes.data.map(async (list) => {
            const cardsRes = await newRequest.get(`/cards/list/${list._id}`);
            return { ...list, cards: cardsRes.data || [] };
          })
        );
        setLists(listsWithCards);
      } catch (err) {
        console.error("Error fetching board data:", err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await newRequest.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err.response?.data?.message || err.message);
      }
    };

    fetchBoardData();
    fetchUsers();
  }, [boardId]);

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return;
    try {
      const res = await newRequest.post(`/boards/${boardId}/lists`, {
        boardId,
        title: newListTitle.trim(),
      });
      setLists((prev) => [...prev, { ...res.data, cards: [] }]);
      setNewListTitle("");
    } catch (err) {
      console.error("Create list error:", err);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUser) return;
    try {
      const res = await newRequest.put(`/boards/${boardId}/members`, {
        email: selectedUser,
      });
      setMembers(res.data);
      setSelectedUser("");
    } catch (err) {
      console.error("Failed to add member:", err);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await newRequest.delete(`/boards/${boardId}/members/${memberId}`);
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
    } catch (err) {
      console.error("Failed to remove member:", err);
    }
  };

  const handleEditBoard = async () => {
    try {
      const res = await newRequest.put(`/boards/${boardId}`, editBoardData);
      setBoard(res.data);
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to update board:", err);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      await newRequest.delete(`/boards/${boardId}`);
      navigate("/boards");
    } catch (err) {
      console.error("Failed to delete board:", err);
    }
  };

  const scrollRef = useRef(null);
  useDragScroll(scrollRef);


  if (loading) return <div className="spinner-center">Loading...</div>;

  return (
    <div /* className="board-page" */  >

      <NavbarUI />

      {/* Board Header */}
      <div  className="board-header-controls"  >
        <div  className="add-list"  >
          <input
            type="text"
            placeholder="New list title..."
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
          />
          <button className="btn-primary" onClick={handleCreateList}>
            + Add List
          </button>
        </div>

        <button className="btn-members" onClick={() => setShowMembersModal(true)}>
          <FiUsers /> All Members ({members.length})
        </button>

        {/* Toggle Members Modal */}
        <button className="btn-manage-members" onClick={() => setShowAssign(true)}>
          <FiUsers />Manage Members ({members.length})
        </button>

        {/* Edit/Delete Board */}
        <button className="btn-edit-board" onClick={() => setShowEditModal(true)}>
          <FiEdit3 /> Edit Board
        </button>
        <button className="btn-delete-board" onClick={() => setShowDeleteModal(true)}>
          <FiTrash2 /> Delete Board
        </button>

        {/* Activity Feeds Toggle */}
        <div
          className="activity-toggle-header"
          onClick={() => setShowActivityFeeds((prev) => !prev)}
        >
          <FiActivity size={22} />
        </div>
      </div>

      {/* Board Content */}
      {/* Board Content */}
      <div className="board-main"   >
        <div
          ref={scrollRef} 
          className={`board-left ${showActivityFeeds ? "scaled" : ""}`}
        >
          <ListColumns boardId={boardId} />
        </div>
        {<div
          className={`board-right-overlay ${showActivityFeeds ? "expanded" : "collapsed"}`}
        >
          <ActivitiesFeeds board={board} />
        </div>}
      </div>

      {/* Members Modal */}
      {showMembersModal && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <div className="modal-header">
              <h5>Members</h5>
              <button className="close-btn" onClick={() => setShowMembersModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="members-section">
                <h4>Members</h4>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                  <option value="">Select user...</option>
                  {users.map((u) => (
                    <option key={u._id} value={u.email}>
                      {u.username} ({u.email})
                    </option>
                  ))}
                </select>
                <button onClick={handleAddMember} disabled={!selectedUser}>
                  Add Member
                </button>
                <ul>
                  {members.map((m) => (
                    <li key={m._id}>
                      {m.username} ({m.email})
                      <button onClick={() => handleRemoveMember(m._id)}>❌</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowMembersModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Members Modal */}
      {showAssign && (
        <AssignUserModalUI
          isOpen={showAssign}
          onClose={() => setShowAssign(false)}
          boardId={board?._id}
          existingMembers={members}
          users={users}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />
      )}



      {/* Edit Board Modal */}
      {showEditModal && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <div className="modal-header">
              <h5>Edit Board</h5>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label>Name</label>
              <input
                type="text"
                value={editBoardData.name}
                onChange={(e) =>
                  setEditBoardData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <label>Description</label>
              <textarea
                rows="3"
                value={editBoardData.description}
                onChange={(e) =>
                  setEditBoardData((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleEditBoard}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Board Modal */}
      {showDeleteModal && (
        <div className="custom-modal-backdrop">
          <div className="custom-modal">
            <div className="modal-header">
              <h5>Delete Board</h5>
              <button className="close-btn" onClick={() => setShowDeleteModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete this board?
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-delete" onClick={handleDeleteBoard}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <br/><br/>
    </div>
  );
}



function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false;
    let startX;
    let scrollLeft;

    const startDragging = (e) => {
      isDown = true;
      el.classList.add("drag-scroll-active");
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };

    const stopDragging = () => {
      isDown = false;
      el.classList.remove("drag-scroll-active");
    };

    const handleMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 1; // scroll speed factor
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener("mousedown", startDragging);
    el.addEventListener("mouseleave", stopDragging);
    el.addEventListener("mouseup", stopDragging);
    el.addEventListener("mousemove", handleMove);

    return () => {
      el.removeEventListener("mousedown", startDragging);
      el.removeEventListener("mouseleave", stopDragging);
      el.removeEventListener("mouseup", stopDragging);
      el.removeEventListener("mousemove", handleMove);
    };
  }, [ref]);
}

export default BoardDetailsPageUI;






