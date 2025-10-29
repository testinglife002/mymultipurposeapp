// apps/taskmanager/pages/TaskDetails.jsx
// apps/taskmanager/pages/TaskDetails.jsx
// src/pages/TaskDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import newRequest from "../../../api/newRequest";
import Tabs from "../components/Tabs";
import Button from "../components/Button";
import SubTaskModal from "../components/SubTaskModal";
import UserListAlt from "../components/UserListAlt";
import SelectList from "../components/SelectList";
import { TextField, FormControl, InputLabel, Select, MenuItem, Grid, Chip } from "@mui/material";
import { BiImages } from "react-icons/bi";
import { MdContentCopy, MdEdit, MdDelete, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp, MdTaskAlt } from "react-icons/md";
import { FaTasks } from "react-icons/fa";
import { RxActivityLog } from "react-icons/rx";
import "./TaskDetails.css";
import ActivitiesPanel from "./ActivitiesPanel";

const LISTS = ["TODO", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "NORMAL", "LOW"];
const TABS = [
  { title: "Task Detail", icon: <FaTasks /> },
  { title: "Activities/Timeline", icon: <RxActivityLog /> },
];

const TaskDetails = ({ users = [] }) => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [subTaskModalOpen, setSubTaskModalOpen] = useState(false);

  const [formData, setFormData] = useState({ title: "", description: "", projectId: "", date: "", start: "" });
  const [stage, setStage] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORITY[2]);
  const [team, setTeam] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await newRequest.get(`/tasks/${id}`);
        const t = res.data.task;
        setTask(t);
        if (t) {
          setFormData({
            title: t.title || "",
            description: t.description || "",
            projectId: t.project?._id || "",
            date: t.date ? t.date.split("T")[0] : "",
            start: t.start ? t.start.split("T")[0] : "",
          });
          setStage(t.stage?.toUpperCase() || LISTS[0]);
          setPriority(t.priority?.toUpperCase() || PRIORITY[2]);
          setTeam(t.team || []);
          setAssets(t.assets || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSelectAssets = (e) => setAssets([...e.target.files]);

  const handleUpdateTask = async () => {
    try {
      const payload = { ...formData, stage: stage.toLowerCase(), priority: priority.toLowerCase(), team, assets };
      const res = await newRequest.put(`/tasks/update/${id}`, payload);
      setTask(res.data.task);
      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  const handleDuplicateTask = async () => {
    try {
      const res = await newRequest.post(`/tasks/duplicate/${id}`);
      alert(`Task duplicated: ${res.data.newTask.title}`);
    } catch (err) {
      console.error(err);
      alert("Failed to duplicate task");
    }
  };

  const handleDeleteSubtask = async (index) => {
    const updatedSubtasks = task.subTasks.filter((_, i) => i !== index);
    await newRequest.put(`/tasks/update/${id}`, { subTasks: updatedSubtasks });
    setTask({ ...task, subTasks: updatedSubtasks });
  };

  const handleEditSubtask = async (index) => {
    const newTitle = prompt("Edit Subtask title", task.subTasks[index].title);
    if (!newTitle) return;
    const updatedSubtasks = [...task.subTasks];
    updatedSubtasks[index].title = newTitle;
    await newRequest.put(`/tasks/update/${id}`, { subTasks: updatedSubtasks });
    setTask({ ...task, subTasks: updatedSubtasks });
  };

  if (loading) return <p>Loading...</p>;
  if (!task) return <p>Task not found.</p>;

  return (
    <div className="taskdetails-container">
      <div className="taskdetails-header">
        {editMode ? (
          <TextField fullWidth label="Task Title" name="title" value={formData.title} onChange={handleChange} />
        ) : (
          <h1>{task.title}</h1>
        )}
        <div className="taskdetails-actions">
          {editMode ? <Button onClick={handleUpdateTask}>Save</Button> : <Button onClick={() => setEditMode(true)} icon={<MdEdit />}>Edit</Button>}
          <Button onClick={handleDuplicateTask} icon={<MdContentCopy />}>Duplicate</Button>
          <Button onClick={() => setSubTaskModalOpen(true)}>+ Add Subtask</Button>
        </div>
      </div>

      <Tabs tabs={TABS} selected={selectedTab} setSelected={setSelectedTab}>
        {selectedTab === 0 && (
          <div className="taskdetails-content">
            <div className="taskdetails-left">
              {editMode && <TextField fullWidth multiline minRows={3} label="Description" name="description" value={formData.description} onChange={handleChange} />}
              {editMode && (
                <FormControl fullWidth margin="dense">
                  <InputLabel>Project</InputLabel>
                  <Select name="projectId" value={formData.projectId} onChange={handleChange}>
                    <MenuItem value=""><em>None</em></MenuItem>
                  </Select>
                </FormControl>
              )}
              <UserListAlt team={team} setTeam={setTeam} allUsers={users} />
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}><SelectList label="Stage" lists={LISTS} selected={stage} setSelected={setStage} /></Grid>
                <Grid item xs={12} md={6}><SelectList label="Priority" lists={PRIORITY} selected={priority} setSelected={setPriority} /></Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth type="date" label="Due Date" name="date" value={formData.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth type="datetime-local" label="Start" name="start" value={formData.start} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                </Grid>
              </Grid>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <label htmlFor="imgUpload" className="upload-label"><BiImages size={24} /> Add Assets</label>
                  <input id="imgUpload" type="file" accept=".jpg,.png,.jpeg" multiple onChange={handleSelectAssets} className="file-input" />
                </Grid>
                <Grid item>{assets.map((file, i) => <Chip key={i} label={file.name || file} />)}</Grid>
              </Grid>

              <div className="task-subtasks">
                <p className="section-label">Subtasks</p>
                {task.subTasks?.map((st, i) => (
                  <div key={i} className="subtask-card">
                    <span>{st.title}</span>
                    <div className="subtask-actions">
                      <Button icon={<MdEdit />} onClick={() => handleEditSubtask(i)} />
                      <Button icon={<MdDelete />} onClick={() => handleDeleteSubtask(i)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="taskdetails-right">
              <p className="section-label">Assets</p>
              {assets.length ? (
                <div className="asset-grid">{Array.from(assets).map((img, i) => (<img key={i} src={typeof img === "string" ? img : URL.createObjectURL(img)} alt="asset" className="asset-img" />))}</div>
              ) : <p>No assets uploaded.</p>}
            </div>
          </div>
        )}

        
        {selectedTab === 1 && (
          <ActivitiesPanel
            activity={task.activities}
            taskId={task._id}
            onActivityAdded={(activities) => setTask({ ...task, activities })}
          />
        )}

      </Tabs>

      <SubTaskModal open={subTaskModalOpen} setOpen={setSubTaskModalOpen} taskId={id} onSubTaskAdded={(subTasks) => setTask({ ...task, subTasks })} />
    </div>
  );
};



export default TaskDetails;




