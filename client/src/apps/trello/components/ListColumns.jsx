// src/components/ListColumns.jsx
// src/components/ListColumns.jsx
import React, { useEffect, useRef, useState } from "react";
import { BsTrash, BsPencil } from "react-icons/bs";
import CardItems from "./CardItems";
import newRequest from "../../../api/newRequest";
import "./ListColumns.css";

function ListColumns({ boardId }) {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editList, setEditList] = useState(null);
  const [title, setTitle] = useState("");
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedOverCardId, setDraggedOverCardId] = useState(null);

  const scrollRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const scrollLeft = useRef(0);
  const scrollTop = useRef(0);

  useEffect(() => {
    fetchLists();
  }, [boardId]);

  const fetchLists = async () => {
    try {
      const res = await newRequest.get(`/lists/boards/${boardId}/lists`);
      setLists(res.data);
    } catch (err) {
      console.error("Failed to fetch lists:", err);
    }
  };

  const handleSaveList = async () => {
    try {
      if (editList) {
        const res = await newRequest.put(`/lists/${editList._id}`, { title });
        setLists((prev) =>
          prev.map((l) => (l._id === editList._id ? res.data : l))
        );
      } else {
        const res = await newRequest.post(`/lists/boards/${boardId}/lists`, { title });
        setLists((prev) => [...prev, { ...res.data, cards: [] }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowModal(false);
      setEditList(null);
      setTitle("");
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await newRequest.delete(`/lists/${listId}`);
      setLists((prev) => prev.filter((l) => l._id !== listId));
    } catch (err) {
      console.error(err);
    }
  };

  const addCardToList = async (listId, cardTitle) => {
    if (!cardTitle) return;
    try {
      const res = await newRequest.post(`/cards/${listId}/cards`, { title: cardTitle });
      setLists((prev) =>
        prev.map((list) =>
          list._id === listId ? { ...list, cards: [...list.cards, res.data] } : list
        )
      );
    } catch (err) {
      console.error("Failed to add card:", err.response?.data?.message || err.message);
    }
  };

  const addNewList = async () => {
    if (!newListTitle.trim()) return;
    try {
      const res = await newRequest.post(`/boards/${boardId}/lists`, { boardId, title: newListTitle.trim() });
      setLists((prev) => [...prev, { ...res.data, cards: [] }]);
      setNewListTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrop = async (cardId, fromListId, toListId, toIndex) => {
    if (!cardId || !fromListId || !toListId) return;

    const sourceCard = lists.find((list) => list._id === fromListId)?.cards.find((card) => card._id === cardId);
    if (!sourceCard) return;

    const newListsState = JSON.parse(JSON.stringify(lists));
    const fromList = newListsState.find((list) => list._id === fromListId);
    const toList = newListsState.find((list) => list._id === toListId);

    fromList.cards = fromList.cards.filter((card) => card._id !== cardId);
    if (typeof toIndex === "number") toList.cards.splice(toIndex, 0, sourceCard);
    else toList.cards.push(sourceCard);

    setLists(newListsState);

    try {
      await newRequest.put(`/cards/move`, {
        cardId,
        fromListId,
        toListId,
        toIndex,
        targetCardId: null,
      });
      // 🔄 Refresh lists after successful move
      await fetchLists();
    } catch (err) {
      console.error("Failed to move card:", err);
      fetchLists();
    }
  };

  const handleCardDrop = async (draggedCard, targetCardId, toListId) => {
    try {
      const payload = {
        cardId: draggedCard._id,
        fromListId: draggedCard.list,
        toListId,
        targetCardId: targetCardId || null,
        toIndex: null,
      };
      await newRequest.put("/cards/move", payload);
      // 🔄 Refresh lists to reflect live changes
       await fetchLists();
    } catch (err) {
      console.error("Failed to move card:", err);
    }
  };

  const handleCardUpdate = (updatedCard) => {
    setLists((prevLists) =>
      prevLists.map((list) => {
        if (list._id !== updatedCard.list) return list;
        return { ...list, cards: list.cards.map((c) => (c._id === updatedCard._id ? updatedCard : c)) };
      })
    );
  };

  const handleCardDelete = (cardId) => {
    setLists((prevLists) =>
      prevLists.map((list) => ({ ...list, cards: list.cards.filter((c) => c._id !== cardId) }))
    );
  };

  // Drag-to-pan (horizontal + vertical)
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const onMouseDown = (e) => {
      isDown.current = true;
      slider.classList.add("dragging");
      startX.current = e.pageX - slider.offsetLeft;
      startY.current = e.pageY - slider.offsetTop;
      scrollLeft.current = slider.scrollLeft;
      scrollTop.current = slider.scrollTop;
    };

    const onMouseUp = () => {
      isDown.current = false;
      slider.classList.remove("dragging");
    };

    const onMouseLeave = () => {
      isDown.current = false;
      slider.classList.remove("dragging");
    };

    const onMouseMove = (e) => {
      if (!isDown.current) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const y = e.pageY - slider.offsetTop;
      slider.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2;
      slider.scrollTop = scrollTop.current - (y - startY.current) * 1.0;
    };

    // touch support
    let touchStartX = 0, touchStartY = 0, touchScrollLeft = 0, touchScrollTop = 0;
    const onTouchStart = (e) => {
      touchStartX = e.touches[0].pageX;
      touchStartY = e.touches[0].pageY;
      touchScrollLeft = slider.scrollLeft;
      touchScrollTop = slider.scrollTop;
    };
    const onTouchMove = (e) => {
      const x = e.touches[0].pageX;
      const y = e.touches[0].pageY;
      slider.scrollLeft = touchScrollLeft - (x - touchStartX) * 1.2;
      slider.scrollTop = touchScrollTop - (y - touchStartY) * 1.0;
    };

    slider.addEventListener("mousedown", onMouseDown);
    slider.addEventListener("mouseleave", onMouseLeave);
    slider.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    slider.addEventListener("touchstart", onTouchStart, { passive: true });
    slider.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      slider.removeEventListener("mouseleave", onMouseLeave);
      slider.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      slider.removeEventListener("touchstart", onTouchStart);
      slider.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <div className="lists-wrapper">
      <div className="scroll-container" ref={scrollRef}>
        <div className="lists-row">
          {lists.map((list) => (
            <div key={list._id} className="list-column">
              <div className="list-header">
                <h5 className="list-title">{list.title}</h5>
                <div className="list-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => {
                      setEditList(list);
                      setTitle(list.title);
                      setShowModal(true);
                    }}
                  >
                    <BsPencil />
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDeleteList(list._id)}
                  >
                    <BsTrash />
                  </button>
                </div>
              </div>

              <div className="cards-container">
                {list.cards.map((card) => (
                  <CardItems
                    key={card._id}
                    card={card}
                    setDraggedCard={setDraggedCard}
                    draggedOverCardId={draggedOverCardId}
                    setDraggedOverCardId={setDraggedOverCardId}
                    onCardUpdate={handleCardUpdate}
                    onCardDelete={handleCardDelete}
                    onDropCard={(targetCardId) =>
                      handleCardDrop(draggedCard, targetCardId, list._id)
                    }
                    onDrop={(toListId, toIndex) =>
                      handleDrop(card._id, list._id, toListId, toIndex)
                    }
                  />
                ))}
              </div>

              <input
                className="add-card-input"
                placeholder="Add card..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    addCardToList(list._id, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          ))}

          <div className="list-column new-list">
            <input
              className="add-list-input"
              placeholder="New list title..."
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addNewList();
              }}
            />
            <button className="btn btn-add-list" onClick={addNewList}>
              + Add List
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h5>{editList ? "Edit List" : "Add List"}</h5>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="modal-actions">
              <button className="btn btn-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-save" onClick={handleSaveList}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListColumns;
 






