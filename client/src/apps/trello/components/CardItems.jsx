// src/components/CardItems.jsx
// src/components/CardItems.jsx
// src/components/CardItems.jsx
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Trash2, Edit3, PlusCircle } from "lucide-react";
import newRequest from "../../../api/newRequest";
import "./CardItems.css";

function CardItems({
  card,
  onDropCard,
  onDrop,
  setDraggedCard,
  draggedOverCardId,
  setDraggedOverCardId,
  onCardUpdate,
  onCardDelete,
}) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [commentText, setCommentText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate progress smoothly
  const calculateProgress = () => {
    const checklistProgress =
      card.checklists?.map((cl) => {
        const done = cl.items?.filter((i) => i.completed).length || 0;
        const total = cl.items?.length || 0;
        return { done, total };
      }) || [];
    const totalTasks = checklistProgress.reduce((acc, cl) => acc + cl.total, 0);
    const completedTasks = checklistProgress.reduce((acc, cl) => acc + cl.done, 0);
    return totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  };

  useEffect(() => {
    let animationFrame;
    const start = animatedProgress;
    const end = calculateProgress();
    const duration = 300; // ms
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = start + (end - start) * progress;
      setAnimatedProgress(value);
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.checklists]);

  // ---------- CARD ----------
  const handleSaveCard = async () => {
    if (title.trim() !== card.title) {
      const res = await newRequest.put(`/cards/${card._id}`, { title });
      onCardUpdate(res.data);
    }
    setShowModal(false);
  };

  const handleDeleteCard = async () => {
    await newRequest.delete(`/cards/${card._id}`);
    onCardDelete(card._id);
    setShowModal(false);
  };

  // ---------- COMMENTS ----------
  const addComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await newRequest.post(`/cards/${card._id}/comments`, {
        text: commentText,
      });
      onCardUpdate({ ...card, comments: [...(card.comments || []), res.data] });
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteComment = async (commentId) => {
    await newRequest.delete(`/cards/${card._id}/comments/${commentId}`);
    onCardUpdate({
      ...card,
      comments: card.comments.filter((c) => c._id !== commentId),
    });
  };

  // ---------- CHECKLISTS ----------
  const addChecklist = async () => {
    const res = await newRequest.post(`/cards/${card._id}/checklists`, {
      title: "New Checklist",
    });
    onCardUpdate({ ...card, checklists: [...(card.checklists || []), res.data] });
  };

  const deleteChecklist = async (checklistId) => {
    await newRequest.delete(`/cards/${card._id}/checklists/${checklistId}`);
    onCardUpdate({
      ...card,
      checklists: (card.checklists || []).filter((cl) => cl._id !== checklistId),
    });
  };

  const addChecklistItem = async (checklist, text) => {
    const res = await newRequest.post(
      `/cards/${card._id}/checklists/${checklist._id}/items`,
      { text }
    );
    const updatedChecklists = card.checklists.map((cl) =>
      cl._id === checklist._id ? { ...cl, items: [...cl.items, res.data] } : cl
    );
    onCardUpdate({ ...card, checklists: updatedChecklists });
  };

  const toggleChecklistItem = async (checklist, item) => {
    const res = await newRequest.put(
      `/cards/${card._id}/checklists/${checklist._id}/items/${item._id}/toggle`
    );
    const updatedChecklists = card.checklists.map((cl) =>
      cl._id === checklist._id
        ? { ...cl, items: cl.items.map((it) => (it._id === item._id ? res.data : it)) }
        : cl
    );
    onCardUpdate({ ...card, checklists: updatedChecklists });
  };

  const deleteChecklistItem = async (checklist, itemId) => {
    await newRequest.delete(
      `/cards/${card._id}/checklists/${checklist._id}/items/${itemId}`
    );
    const updatedChecklists = card.checklists.map((cl) =>
      cl._id === checklist._id
        ? { ...cl, items: cl.items.filter((it) => it._id !== itemId) }
        : cl
    );
    onCardUpdate({ ...card, checklists: updatedChecklists });
  };

  // ---------- DRAG & DROP ----------
  const handleDragStart = (e) => {
    setDraggedCard(card);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragEnd = () => setIsDragging(false);
  const handleDragOver = (e) => {
    e.preventDefault();
    setDraggedOverCardId(card._id);
  };
  const handleDrop = () => {
    if (onDropCard && setDraggedCard) onDropCard(draggedOverCardId);
    setDraggedOverCardId(null);
  };

  // ---------- PROGRESS ----------
  const checklistProgress =
    card.checklists?.map((cl) => {
      const done = cl.items?.filter((i) => i.completed).length || 0;
      const total = cl.items?.length || 0;
      return { title: cl.title, done, total };
    }) || [];

  const totalTasks = checklistProgress.reduce((acc, cl) => acc + cl.total, 0);
  const completedTasks = checklistProgress.reduce((acc, cl) => acc + cl.done, 0);
  const overallProgress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="card-item-container">
      <div
        className={`card-item ${isDragging ? "dragging" : ""} ${
          draggedOverCardId === card._id ? "drag-over" : ""
        }`}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="card-title-row">
          <span className="card-title-text" onClick={() => setShowModal(true)}>
            {card.title}
          </span>
          <div className="card-actions">
            <button className="icon-btn edit" onClick={() => setShowModal(true)}>
              <Edit3 size={16} />
            </button>
            <button className="icon-btn delete" onClick={handleDeleteCard}>
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Checklist progress preview */}
        {/* Trello-style animated progress preview */}
        <div className="checklist-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
          <span className="progress-text">
            {card.checklists?.reduce((acc, cl) => acc + (cl.items?.filter(i => i.completed).length || 0), 0)}/
            {card.checklists?.reduce((acc, cl) => acc + (cl.items?.length || 0), 0)} done
          </span>
        </div>
        
      </div>

      {/* ---- SINGLE CARD MODAL USING PORTAL ---- */}
      {showModal &&
        ReactDOM.createPortal(
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div
              className="modal-content large"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Edit & Preview Card</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  ✕
                </button>
              </div>

              <div className="modal-body">
                {/* Title */}
                <div className="input-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Comments */}
                <div className="comments-section">
                  <h4>Comments</h4>
                  <div className="comment-input-row">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button className="primary-btn" onClick={addComment}>
                      Add
                    </button>
                  </div>
                  <div className="comment-list">
                    {card?.comments?.map((c) => (
                      <div className="comment-item" key={c._id}>
                        <span>
                          <strong>{c.user?.username || "User"}:</strong> {c.text}
                        </span>
                        <button
                          className="icon-btn delete"
                          onClick={() => deleteComment(c._id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checklists */}
                <div className="checklists-section">
                  <div className="checklist-header">
                    <h4>Checklists</h4>
                    <button className="add-btn" onClick={addChecklist}>
                      <PlusCircle size={16} /> Add Checklist
                    </button>
                  </div>

                  {card.checklists?.map((cl) => (
                    <div className="checklist" key={cl._id}>
                      <div className="checklist-title">
                        <span>{cl.title}</span>
                        <button
                          className="icon-btn delete"
                          onClick={() => deleteChecklist(cl._id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="checklist-items">
                        {cl.items?.map((item) => (
                          <div className="checklist-item" key={item._id}>
                            <label>
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => toggleChecklistItem(cl, item)}
                              />
                              {item.text}
                            </label>
                            <button
                              className="icon-btn delete"
                              onClick={() => deleteChecklistItem(cl, item._id)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <form
                        className="add-item-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const text = e.target.elements.newItem.value;
                          if (text.trim()) {
                            addChecklistItem(cl, text);
                            e.target.reset();
                          }
                        }}
                      >
                        <input type="text" name="newItem" placeholder="Add item..." />
                        <button type="submit" className="primary-btn">
                          Add
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="secondary-btn"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button className="danger-btn" onClick={handleDeleteCard}>
                  Delete
                </button>
                <button className="primary-btn" onClick={handleSaveCard}>
                  Save
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default CardItems;










