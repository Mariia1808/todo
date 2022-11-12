import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "../App.module.scss";
import { useNavigate } from "react-router-dom";
import { auth } from "../http/userAPI";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const toNavigate = useNavigate();
  const send = () => {
    if (!login || !password) {
      setError("Не все поля заполнены");
    } else {
      setError("");
      auth(login, password).then((data) =>
        data ? setError(data) : toNavigate("/main")
      );
    }
  };
  return (
    <div className={styles.login}>
      <p className={styles.login_header}>Авторизация</p>
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
      <div className={styles.login_button}>
        <p
          className={styles.login_point}
          onClick={() => toNavigate("/registration")}
        >
          Нет аккаунта?
        </p>
        <Button onClick={() => send()} variant="contained">
          Войти
        </Button>
      </div>
    </div>
  );
};

export default Login;
