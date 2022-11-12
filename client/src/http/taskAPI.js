import { $authHost } from "./index";

export const createTask = async (task) => {
  const { data } = await $authHost.post("task/create", task);
  console.log(data);
  return data;
};
export const updateTask = async (task) => {
  const { data } = await $authHost.post("task/update", task);
  console.log(data);
  return data;
};
export const getAllTask = async (id) => {
  const { data } = await $authHost.post("task/get", { id });
  console.log(data);
  return data;
};
export const getGroupByResponsible = async (id) => {
  const { data } = await $authHost.post("task/getGroupByResponsible", {
    id,
  });
  console.log(data);
  return data;
};
export const getGroupByDate = async (id, date) => {
  const { data } = await $authHost.post("task/getGroupByDate", {
    id,
    date,
  });
  console.log(data);
  return data;
};
export const getSort = async (id, sort, date) => {
  const responsible = sort.responsible;
  const dateEnd = sort.dateEnd;
  const dates = sort.dates;
  const endDate = sort.endDates;

  const { data } = await $authHost.post("task/getSort", {
    id,
    responsible,
    dateEnd,
    dates,
    date,
    endDate,
  });
  console.log(data);
  return data;
};
