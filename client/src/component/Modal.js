import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styles from "./Task.module.scss";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { createTask, updateTask } from "../http/taskAPI";

const BasicModal = ({
  openModal,
  update,
  data,
  responsible,
  id,
  handleClose,
  suggest = false,
  closeModal,
}) => {
  const [task, setTask] = useState(
    data.length !== 0
      ? data
      : {
          title: "",
          description: "",
          status: 0,
          priority: 0,
          creator: id,
          responsible: id,
          end_date: "",
          data_creation: new Date(),
          update_date: new Date(),
        }
  );
  const [error, setError] = useState("");
  const handleChange = (value, what) => {
    setTask((prevState) => ({ ...prevState, [what]: value }));
  };
  const close = () => {
    handleClose();
  };
  const addTask = () => {
    setError('')
    for (let key in task) {
      if (!Boolean(task[key])) {
        setError("Не все поля заполнены");
        return;
      }
    }
    createTask(task).then(data => data.message? setError(data.message) : handleClose());
  };

  const refreshTask = () => {
    setError('')
    handleChange(new Date(), "update_date");
    for (let key in task) {
      if (!Boolean(task[key])) {
        setError("Не все поля заполнены");
        return;
      }
    }
    updateTask(task).then(data => data.message? setError(data.message) : handleClose());
  };

  const status = [
    { id: 0, item: "" },
    { id: 1, item: "к выполнению" },
    { id: 2, item: "выполняется" },
    { id: 3, item: "выполнена" },
    { id: 4, item: "отменена" },
  ];
  const priority = [
    { id: 0, item: "" },
    { id: 1, item: "высокий" },
    { id: 2, item: "средний" },
    { id: 3, item: "низкий" },
  ];
  
  return (
    <Modal open={openModal} onClose={closeModal}>
      <div className={styles.Modal}>
        <Typography>
          {update ? "Обновить задачу" : "Добавить задачу"}
        </Typography>
        <TextField
          disabled={suggest}
          label="Заголовок"
          margin="normal"
          fullWidth
          value={task["title"]}
          onChange={(e) => handleChange(e.target.value, "title")}
          variant="filled"
        />
        <TextField
          disabled={suggest}
          label="Описание"
          margin="normal"
          fullWidth
          multiline
          value={task["description"]}
          onChange={(e) => handleChange(e.target.value, "description")}
          variant="filled"
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            disabled={suggest}
            label="Дата окончания"
            value={task["end_date"]}
            // disablePast
            onChange={(e) => handleChange(e["$d"], "end_date")}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <TextField
          select
          disabled={suggest}
          fullWidth
          label="Выберите приоритет"
          value={task["priority"]}
          onChange={(e) => handleChange(e.target.value, "priority")}
          margin="normal"
          variant="filled"
        >
          {priority.map((option) => (
            <MenuItem key={option.id} value={option.item}>
              {option.item}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          label="Выберите статус"
          value={task["status"]}
          onChange={(e) => handleChange(e.target.value, "status")}
          margin="normal"
          variant="filled"
        >
          {status.map((option) => (
            <MenuItem key={option.id} value={option.item}>
              {option.item}
            </MenuItem>
          ))}
        </TextField>

        {id === jwt_decode(localStorage.getItem("token")).manager &&
          !responsible?.message && (
            <TextField
              select
              fullWidth
              label="Выберите ответственного"
              value={task["responsible"]}
              onChange={(e) =>
                handleChange(Number(e.target.value), "responsible")
              }
              margin="normal"
              variant="filled"
            >
              {responsible?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name} {option.lastname}
                </MenuItem>
              ))}
            </TextField>
          )}

        {error && <p>{error}</p>}
        <div>
          <Button onClick={() => close()}>Закрыть</Button>
          {update ? (
            <Button variant="contained" onClick={() => refreshTask()}>
              Обновить задачу
            </Button>
          ) : (
            <Button variant="contained" onClick={() => addTask()}>
              Добавить задачу
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BasicModal;
