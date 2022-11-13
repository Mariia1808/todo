import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "../App.module.scss";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { getManager, registration } from "../http/userAPI";

const Registration = () => {
  const [managerID, setManagerID] = useState(null);
  const [manager, setManager] = useState([]);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [patronymic, setPatronymic] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleChange = (event) => {
    setManagerID(event.target.value);
  };

  useEffect(() => {
    getManager().then((data) => setManager(data));
  }, []);

  const send = () => {
    if (
      !managerID ||
      !name ||
      !lastname ||
      !patronymic ||
      !login ||
      !password
    ) {
      setError("Не все поля заполнены");
    } else {
      setError("");
      registration(name, lastname, patronymic, managerID, login, password).then(
        (data) => (data ? setError(data) : toNavigate("/main"))
      );
    }
  };

  const toNavigate = useNavigate();
  return (
    <div className={styles.registration}>
      <p className={styles.registration_header}>Регистрация</p>
      <TextField
        label="Имя"
        margin="normal"
        defaultValue={name}
        onChange={(e) => setName(e.target.value)}
        variant="filled"
      />
      <TextField
        label="Фамилия"
        margin="normal"
        defaultValue={lastname}
        onChange={(e) => setLastname(e.target.value)}
        variant="filled"
      />
      <TextField
        label="Отчество"
        margin="normal"
        defaultValue={patronymic}
        onChange={(e) => setPatronymic(e.target.value)}
        variant="filled"
      />
      <TextField
        select
        label="Выберите руководителя"
        value={managerID}
        onChange={handleChange}
        margin="normal"
        variant="filled"
      >
        <MenuItem value={null}></MenuItem>
        <MenuItem key={0} value={-1}>
          Я руководитель
        </MenuItem>
        {manager?.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.name} {option.lastname}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        defaultValue={login}
        onChange={(e) => setLogin(e.target.value)}
        label="Логин"
        margin="normal"
        variant="filled"
      />
      <TextField
        defaultValue={password}
        onChange={(e) => setPassword(e.target.value)}
        label="Пароль"
        margin="normal"
        type="password"
        variant="filled"
      />
      {error && <p>{error}</p>}
      <div className={styles.registration_button}>
        <p
          className={styles.registration_point}
          onClick={() => toNavigate("/login")}
        >
          Войти
        </p>
        <Button variant="contained" onClick={() => send()}>
          Зарегистрироваться
        </Button>
      </div>
    </div>
  );
};

export default Registration;
