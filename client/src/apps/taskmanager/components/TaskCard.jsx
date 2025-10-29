import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
} from "@mui/material";
import { MdDelete } from "react-icons/md";
import "./TaskCard.css";

const TaskCard = ({ task, onClick, onDelete }) => {
  return (
    <Card
      className="task-card"
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>

        <div className="task-card-badges">
          <Chip
            label={task.priority}
            className={`badge-${task.priority}`}
            size="small"
          />
          <Chip
            label={task.stage}
            className="badge-stage"
            size="small"
          />
        </div>

        {task.team?.length > 0 && (
          <div className="task-card-team">
            {task.team.map((user) => (
              <Chip
                key={user._id}
                label={user.username || user.name}
                size="small"
                className="badge-info"
              />
            ))}
          </div>
        )}
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(task._id);
          }}
          startIcon={<MdDelete />}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskCard;
