// // apps/taskmanager/pages/Trash.jsx
// 3️⃣ Trash.jsx (fetch trashed tasks)
import React, { useEffect, useState } from "react";
import { MdDelete, MdOutlineRestore } from "react-icons/md";
import Title from "../components/Title";
import Button from "../components/Button";
import ConfirmatioDialog from "../components/ConfirmatioDialog";
import newRequest from "../../../api/newRequest";
import "./Trash.css";

const Trash = () => {
  const [tasks, setTasks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("delete");

  const fetchTrashed = async () => {
    try {
      const res = await newRequest.get("/tasks/trashed");
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTrashed();
  }, []);

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permanently delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  return (
    <div className="trash-container">
      <div className="trash-header">
        <Title title="Trashed Tasks" />
        <div className="trash-actions">
          <Button label="Restore All" icon={<MdOutlineRestore />} className="btn-restore" onClick={restoreAllClick} />
          <Button label="Delete All" icon={<MdDelete />} className="btn-delete" onClick={deleteAllClick} />
        </div>
      </div>

      <div className="trash-table-container">
        <table className="trash-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Priority</th>
              <th>Stage</th>
              <th>Modified On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((tk) => (
              <tr key={tk._id}>
                <td>{tk.title}</td>
                <td>{tk.priority}</td>
                <td>{tk.stage}</td>
                <td>{new Date(tk.date).toDateString()}</td>
                <td className="trash-actions-cell">
                  <MdOutlineRestore className="icon-restore" />
                  <MdDelete className="icon-delete" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmatioDialog open={openDialog} setOpen={setOpenDialog} msg={msg} setMsg={setMsg} type={type} />
    </div>
  );
};

export default Trash;
