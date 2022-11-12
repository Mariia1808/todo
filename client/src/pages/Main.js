import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import jwt_decode from "jwt-decode";
import { getResponsible } from "../http/userAPI";
import BasicModal from "../component/Modal";
import { useNavigate } from "react-router-dom";
import {
  getAllTask,
  getGroupByDate,
  getGroupByResponsible,
  getSort,
} from "../http/taskAPI";
import styles from "../App.module.scss";
import Task from "../component/Task";
import CircularProgress from "@mui/material/CircularProgress";
import { MenuItem, TextField } from "@mui/material";

const Main = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState([]);
  const [task, setTask] = useState([]);
  const [error, setError] = useState("");
  let id = jwt_decode(localStorage.getItem("token")).id;
  let [sortTasks, setSortTasks] = useState({
    responsible: 0,
    dateEnd: 0,
    dates: new Date(),
    endDates: new Date(),
  });
  let [nameSort, setNameSort] = useState({ id: 0, name: "" });
  const date = new Date();
  let weekDate = new Date();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    id === jwt_decode(localStorage.getItem("token")).manager &&
      getResponsible(id).then((data) => setUser(data));
    getAllTask(id)
      .then((data) => (data.message ? setError(data.message) : setTask(data)))
      .finally(setLoading(false));
  }, [id]);

  const refresh = () => {
    handleChange(0, "responsible");
    handleChange(0, "dateEnd");
    setOpen(false);
    setError("");
    setTask([]);
    setLoading(true);
    getAllTask(id)
      .then((data) => (data.message ? setError(data.message) : setTask(data)))
      .then(setNameSort({ id: 0, name: "" }))
      .finally(setLoading(false));
  };

  const handleClose = () => {
    setOpen(false);
    setError("");
    setTask([]);
    setLoading(true);
    getAllTask(id)
      .then((data) => (data.message ? setError(data.message) : setTask(data)))
      .finally(setLoading(false));
  };

  const groupByResponsible = () => {
    setError("");
    setTask([]);
    setLoading(true);
    getGroupByResponsible(id)
      .then((data) => (data.message ? setError(data.message) : setTask(data)))
      .then(setNameSort({ id: 1, name: "Группировка по отвественным" }))
      .finally(setLoading(false));
  };

  const groupByDate = () => {
    setError("");
    setTask([]);
    setLoading(true);
    getGroupByDate(id, date)
      .then((data) => (data.message ? setError(data.message) : setTask(data)))
      .then(setNameSort({ id: 2, name: "Группировка по дате" }))
      .finally(setLoading(false));
  };
  const handleChange = (value, what) => {
    let startDay = new Date();
    let endDay = new Date();
    setSortTasks((prevState) => ({ ...prevState, [what]: value }));
    if (what === "dateEnd" && value === 1) {
      startDay.setHours(0, 0, 0, 0);
      setSortTasks((prevState) => ({ ...prevState, dates: startDay }));
      endDay.setHours(0, 0, 0, 0);
      endDay.setDate(weekDate.getDate() + 1);
      setSortTasks((prevState) => ({ ...prevState, endDates: endDay }));
    }
    if (what === "dateEnd" && (value === 2 || value === 3)) {
      weekDate.setDate(weekDate.getDate() + 7);
      setSortTasks((prevState) => ({ ...prevState, dates: weekDate }));
    }
  };
  const sortTask = () => {
    setError("");
    setTask([]);
    if (!sortTasks.dateEnd && !sortTasks.responsible) {
      setError("Ничего не выбрано");
    } else {
      setLoading(true);
      getSort(id, sortTasks, date)
        .then((data) => (data.message ? setError(data.message) : setTask(data)))
        .then(setNameSort({ id: 3, name: "Сортировка" }))
        .finally(setLoading(false));
    }
  };

  const toNavigate = useNavigate();
  const out = () => {
    localStorage.clear();
    toNavigate("/login");
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <div className={styles.Main}>
      <p>Ваш список дел, {jwt_decode(localStorage.getItem("token")).login}</p>
      <Button onClick={() => out()}>Выйти</Button>
      <div className={styles.Main_all}>
        <div className={styles.Main_all_sort}>
          {id === jwt_decode(localStorage.getItem("token")).manager &&
            !user?.message && (
              <TextField
                select
                fullWidth
                label="Выберите ответственного"
                value={sortTasks["responsible"]}
                onChange={(e) =>
                  handleChange(Number(e.target.value), "responsible")
                }
                margin="normal"
                variant="filled"
              >
                <MenuItem key={0} value={0}></MenuItem>
                {user?.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name} {option.lastname}
                  </MenuItem>
                ))}
              </TextField>
            )}
          <TextField
            select
            fullWidth
            label="Выберите дату завершения"
            value={sortTasks["dateEnd"]}
            onChange={(e) => handleChange(e.target.value, "dateEnd")}
            margin="normal"
            variant="filled"
          >
            <MenuItem key={0} value={0}></MenuItem>
            <MenuItem key={1} value={1}>
              На сегодня
            </MenuItem>
            <MenuItem key={2} value={2}>
              На неделю
            </MenuItem>
            <MenuItem key={3} value={3}>
              На будущее
            </MenuItem>
          </TextField>
          <Button variant="contained" onClick={() => sortTask()}>
            Сортировать
          </Button>
        </div>
        <div className={styles.Main_all_group}>
          {id === jwt_decode(localStorage.getItem("token")).manager && (
            <Button variant="contained" onClick={() => groupByResponsible()}>
              Группировка по ответственным
            </Button>
          )}
          <Button variant="contained" onClick={() => groupByDate()}>
            Группировка по дате
          </Button>
          <Button variant="contained" onClick={() => refresh()}>
            Сбросить все
          </Button>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Добавить задачу
          </Button>
        </div>
      </div>
      {loading && <CircularProgress />}
      <p>{nameSort.name && nameSort.name}</p>
      {error && <p>{error}</p>}
      {task?.map((item) => {
        return (
          <Task
            key={item.id}
            data={item}
            id={item.responsible}
            responsibles={user}
            refreshion={refresh}
          />
        );
      })}
      <BasicModal
        openModal={open}
        id={id}
        data={[]}
        refresh={refresh}
        handleClose={handleClose}
        responsible={user}
        closeModal={closeModal}
      />
    </div>
  );
};

export default Main;
