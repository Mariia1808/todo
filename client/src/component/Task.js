import styles from "./Task.module.scss";
import React, { useEffect, useState } from "react";
import { getOne } from "../http/userAPI";
import BasicModal from "./Modal";
import jwt_decode from "jwt-decode";

const Task = ({ data = [], id, responsibles, refreshion }) => {
  const [responsible, setResponsible] = useState("");
  let [open, setOpen] = useState(false);
  let date = new Date(data.end_date);
  const handleClose = () =>{
    refreshion(true)
  }
  const closeModal = () => {
    setOpen(!open)
  };
  const color =
    (data.status === "выполнена" && "green") ||
    (date < new Date() && "red") ||
    "grey";
  useEffect(() => {
    getOne(id).then((data) => setResponsible(data));
  }, [id, data.end_date]);
  
  return (
    <div className={styles.Task} onClick={() => setOpen(true)}>
      <p className={styles[`Task_title_${color}`]}>{data.title}</p>
      <p>Приоритет: {data.priority}</p>
      <p>
        Закончить до: 
        {` ${date.getDate()}\\${date.getMonth() + 1}\\${date.getFullYear()}`}
      </p>
      <p>
        Ответственный: {responsible.name} {responsible.lastname}
      </p>
      <p>Статус: {data.status}</p>
      <BasicModal
        openModal={open}
        data={data}
        responsible={responsibles}
        update
        closeModal={closeModal}
        handleClose={handleClose}
        suggest={
          !Boolean(
            jwt_decode(localStorage.getItem("token")).id === data.creator
          )
        }
      />
    </div>
  );
};

export default Task;
