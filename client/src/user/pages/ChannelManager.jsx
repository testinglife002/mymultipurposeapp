// src/user/pages/ChannelManager.jsx
// ✅ src/admin/pages/ChannelManager.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest";
import "./ChannelManager.css";
import { FiEdit, FiTrash2, FiCheckCircle } from "react-icons/fi";

const ChannelManager = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Create form
  const [channelName, setChannelName] = useState("");
  const [channelType, setChannelType] = useState("");
  const [channelDesc, setChannelDesc] = useState("");
  const [channelTags, setChannelTags] = useState("");
  const [channelImage, setChannelImage] = useState("");

  // Editing state
  const [editingChannel, setEditingChannel] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    type: "",
    description: "",
    tags: "",
    channelImage: "",
  });

  const [selectedChannel, setSelectedChannel] = useState(null);

  // --- API calls ---
  const fetchChannels = async () => {
    try {
      const res = await newRequest.get("/channels");
      setChannels(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  {/* 
    // Fetch channels
  const fetchChannels = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setChannels(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };
    */}

  const addChannel = async () => {
    if (!channelName || !channelImage) return;
    try {
      const res = await newRequest.post("/channels", {
        name: channelName,
        type: channelType,
        description: channelDesc,
        tags: channelTags
          ? channelTags.split(",").map((t) => t.trim())
          : [],
        channelImage,
      });
      setChannels([...channels, res.data]);
      setChannelName("");
      setChannelType("");
      setChannelDesc("");
      setChannelTags("");
      setChannelImage("");
    } catch (err) {
      console.error(err);
    }
  };

  const saveChannel = async (id) => {
    try {
      const res = await newRequest.put(`/channels/${id}`, {
        ...editData,
        tags: editData.tags
          ? editData.tags.split(",").map((t) => t.trim())
          : [],
      });
      setChannels(channels.map((c) => (c._id === id ? res.data : c)));
      setEditingChannel(null);
      setEditData({
        name: "",
        type: "",
        description: "",
        tags: "",
        channelImage: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingChannel(null);
    setEditData({
      name: "",
      type: "",
      description: "",
      tags: "",
      channelImage: "",
    });
  };

  const deleteChannel = async (id) => {
    if (!window.confirm("Delete this channel?")) return;
    try {
      await newRequest.delete(`/channels/${id}`);
      setChannels(channels.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  return (
    <div className="channel-manager">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Channels</h3>
        <div className="add-row">
          <input
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Channel Name"
          />
          <input
            value={channelType}
            onChange={(e) => setChannelType(e.target.value)}
            placeholder="Type"
          />
          <input
            value={channelDesc}
            onChange={(e) => setChannelDesc(e.target.value)}
            placeholder="Description"
          />
          <input
            value={channelTags}
            onChange={(e) => setChannelTags(e.target.value)}
            placeholder="Tags (comma separated)"
          />
          <input
            value={channelImage}
            onChange={(e) => setChannelImage(e.target.value)}
            placeholder="Image URL"
          />
          <button onClick={addChannel}>Add</button>
        </div>

        {/* View toggle */}
        <div className="view-toggle">
          {["grid", "list", "table"].map((mode) => (
            <button
              key={mode}
              className={viewMode === mode ? "active" : ""}
              onClick={() => setViewMode(mode)}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Channel List */}
        {viewMode === "table" ? (
          <table className="channels-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((c) =>
                editingChannel === c._id ? (
                  <tr key={c._id}>
                    <td>
                      <input
                        value={editData.channelImage}
                        onChange={(e) =>
                          setEditData({ ...editData, channelImage: e.target.value })
                        }
                        placeholder="Image URL"
                      />
                    </td>
                    <td>
                      <input
                        value={editData.name}
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        placeholder="Name"
                      />
                    </td>
                    <td>
                      <input
                        value={editData.type}
                        onChange={(e) =>
                          setEditData({ ...editData, type: e.target.value })
                        }
                        placeholder="Type"
                      />
                    </td>
                    <td>
                      <input
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({ ...editData, description: e.target.value })
                        }
                        placeholder="Description"
                      />
                    </td>
                    <td>
                      <input
                        value={editData.tags}
                        onChange={(e) =>
                          setEditData({ ...editData, tags: e.target.value })
                        }
                        placeholder="Tags"
                      />
                    </td>
                    <td>
                      <button onClick={() => saveChannel(c._id)}>Save</button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={c._id}>
                    <td>
                      <img src={c.channelImage} alt={c.name} className="thumb" />
                    </td>
                    <td>{c.name}</td>
                    <td>{c.type}</td>
                    <td>{c.description}</td>
                    <td>{c.tags.join(", ")}</td>
                    <td>
                      <button
                        onClick={() => {
                          setEditingChannel(c._id);
                          setEditData({
                            name: c.name,
                            type: c.type || "",
                            description: c.description || "",
                            tags: c.tags.join(", "),
                            channelImage: c.channelImage,
                          });
                        }}
                      >
                        ✏️
                      </button>
                      <button onClick={() => deleteChannel(c._id)}>🗑</button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          <div className={`channels ${viewMode}`}>
            {channels.map((c) =>
              editingChannel === c._id ? (
                <div key={c._id} className="edit-row">
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                  />
                  <button onClick={() => saveChannel(c._id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div key={c._id} className="channel-card">
                  <img src={c.channelImage} alt={c.name} />
                  <h4>{c.name}</h4>
                  <p>{c.type}</p>
                  <p>{c.description}</p>
                  <small>{c.tags.join(", ")}</small>
                  <div className="actions">
                    <button
                      onClick={() => {
                        setEditingChannel(c._id);
                        setEditData({
                          name: c.name,
                          type: c.type || "",
                          description: c.description || "",
                          tags: c.tags.join(", "),
                          channelImage: c.channelImage,
                        });
                      }}
                    >
                      ✏️
                    </button>
                    <button onClick={() => deleteChannel(c._id)}>🗑</button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

        <h2>All Channels</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="channel-grid">
          {channels.map((channel) => (
            <div
              key={channel._id}
              className={`channel-card ${
                selectedChannel && selectedChannel._id === channel._id
                  ? "selected"
                  : ""
              }`}
            >
              <img
                src={channel.channelImage}
                alt={channel.name}
                className="channel-image"
                onClick={() => handleSelectChannel(channel)}
              />
              <div className="channel-info" onClick={() => handleSelectChannel(channel)}>
                <h3>{channel.name}</h3>
                <p>{channel.type}</p>
              </div>
              <div className="channel-actions">
                <button onClick={() => handleEdit(channel)} title="Edit">
                  <FiEdit />
                </button>
                <button
                  onClick={() => handleDelete(channel._id)}
                  title="Delete"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Selected Channel Preview */}
      {selectedChannel && (
        <div className="channel-preview">
          <h2>
            <FiCheckCircle /> Selected Channel: {selectedChannel.name}
          </h2>
          <img
            src={selectedChannel.channelImage}
            alt={selectedChannel.name}
            className="preview-image"
          />
          <p><strong>Type:</strong> {selectedChannel.type || "N/A"}</p>
          <p><strong>Description:</strong> {selectedChannel.description}</p>
          <p><strong>Tags:</strong> {selectedChannel.tags.join(", ")}</p>
        </div>
      )}

    </div>
  );
};

export default ChannelManager;
