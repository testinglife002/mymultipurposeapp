import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Activity, Users } from "lucide-react";
import newRequest from "../../../api/newRequest";
import ListColumns from "./ListColumns";
import AssignUserModalUI from "./AssignUserModalUI";
import NavbarUI from "./NavbarUI";
import ActivitiesFeeds from "./ActivitiesFeeds";
import "./BoardDetailsPageAltUI.css";

export default function BoardDetailsPageAltUI() {
  const { boardId } = useParams();

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [newListTitle, setNewListTitle] = useState("");
  const [showAssign, setShowAssign] = useState(false);
  const [showActivityFeeds, setShowActivityFeeds] = useState(false);

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

  // Create a new list
  const handleCreateList = async () => {
    if (!newListTitle.trim()) return;
    try {
      const res = await newRequest.post(`/boards/${boardId}/lists`, {
        title: newListTitle.trim(),
      });
      setLists((prev) => [...prev, { ...res.data, cards: [] }]);
      setNewListTitle("");
    } catch (err) {
      console.error("Error creating list:", err.response?.data?.message || err.message);
    }
  };

  // Add member to board
  const handleAddMember = async () => {
    if (!selectedUser) return;
    try {
      const res = await newRequest.put(`/boards/${boardId}/members`, {
        email: selectedUser,
      });
      setMembers(res.data);
      setSelectedUser("");
    } catch (err) {
      console.error("Error adding member:", err.response?.data?.message || err.message);
    }
  };

  // Remove member from board
  const handleRemoveMember = async (memberId) => {
    try {
      await newRequest.delete(`/boards/${boardId}/members/${memberId}`);
      setMembers((prev) => prev.filter((m) => m._id !== memberId));
    } catch (err) {
      console.error("Error removing member:", err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div className="spinner-center">Loading...</div>;

  return (
    <div className="board-page-alt">
      <NavbarUI />

      <div className="board-header-controls">
        <div className="add-list">
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

        <div className="members-section">
            <h4>Members</h4>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
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

        <button className="btn-manage-members" onClick={() => setShowAssign(true)}>
          <Users size={18} /> Manage Members ({members.length})
        </button>

        <div
          className="activity-toggle-header"
          onClick={() => setShowActivityFeeds((prev) => !prev)}
        >
          <Activity size={22} />
        </div>
      </div>

      <div className="board-main-alt">
        <div className={`board-left-alt ${showAssign ? "dimmed" : ""}`}>
          <ListColumns
            boardId={boardId}
            lists={lists}
            setLists={setLists}
          />
        </div>

        <div
          className={`board-right-overlay-alt ${
            showActivityFeeds ? "expanded" : "collapsed"
          }`}
        >
          <ActivitiesFeeds board={board} />
        </div>
      </div>

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
    </div>
  );
}

