import { $authHost, $host } from "./index";

export const registration = async (
  name,
  lastname,
  patronymic,
  manager,
  login,
  password
) => {
  const { data } = await $host.post("user/registration", {
    name,
    lastname,
    patronymic,
    manager,
    login,
    password,
  });
  console.log(data);
  if (data.token) {
    localStorage.setItem("token", data.token);
    return "";
  } else {
    return data.message;
  }
};

export const auth = async (login, password) => {
  const { data } = await $host.post("user/login", { login, password });
  console.log(data);
  if (data.token) {
    localStorage.setItem("token", data.token);
    return "";
  } else {
    return data.message;
  }
};

export const getManager = async () => {
  const { data } = await $host.get("user/manager");
  return data;
};

export const getResponsible = async (manager) => {
  const { data } = await $authHost.get("user/responsible/" + manager);
  return data;
};

export const getOne = async (id) => {
  const { data } = await $authHost.get("user/get/" + id);
  return data;
};
