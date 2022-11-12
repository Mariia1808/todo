const { or, Sequelize, Op, and } = require("sequelize");
const { Task } = require("../models/models");
require("dotenv").config();

class TaskController {
  async getAll(req, res) {
    let { id } = req.body;
    try {
      const data = await Task.findAll({
        where: or({ responsible: id }, { creator: id }),
        order: [["update_date", "DESC"]],
      });
      if (data.length === 0) {
        return res.json({ message: "Ничего не найдено" });
      }
      return res.json(data);
    } catch (e) {
      return res.json({ message: "Непредвиденная ошибка" });
    }
  }
  async getOne(req, res) {
    const { id } = req.params;
    try {
      const data = await Task.findOne({ where: { id } });
      if (data === null) {
        return res.json({ message: "Ничего не найдено" });
      }
      return res.json(data);
    } catch (error) {
      return res.json({ message: "Непредвиденная ошибка" });
    }
  }
  async getGroupByResponsible(req, res) {
    let { id } = req.body;
    //order так как group нельзя использовать с where и прочими условиями
    try {
      const data = await Task.findAll({
        where: { creator: id },
        order: ["responsible"],
      });
      if (data.length === 0) {
        return res.json({ message: "Ничего не найдено" });
      }
      return res.json(data);
    } catch (error) {
      return res.json({ message: "Некорректные данные" });
    }
  }
  async getGroupByDate(req, res) {
    let { id, date } = req.body;
    //order так как group нельзя использовать с where и прочими условиями
    try {
      const data = await Task.findAll({
        where: and(or({ responsible: id }, { creator: id }), {
          end_date: { [Op.gte]: date },
        }),
        order: ["end_date"],
      });
      if (data.length === 0) {
        return res.json({ message: "Ничего не найдено" });
      }
      return res.json(data);
    } catch (error) {
      return res.json({ message: "Некорректные данные" });
    }
  }
  async getSort(req, res) {
    let { id, responsible, dateEnd, dates, date, endDate } = req.body;
    let data;
    //order так как group нельзя использовать с where и прочими условиями
    try {
      if (responsible && dateEnd) {
        if (dateEnd === 1) {
          data = await Task.findAll({
            where: and(
              { responsible: responsible },
              { creator: id },
              {
                end_date: { [Op.gte]: dates },
              },
              {
                end_date: { [Op.lte]: endDate },
              }
            ),
            order: ["update_date"],
          });
        }
        if (dateEnd === 2) {
          data = await Task.findAll({
            where: and(
              { responsible: responsible },
              { creator: id },
              {
                end_date: { [Op.lte]: dates },
              },
              {
                end_date: { [Op.gt]: date },
              }
            ),
            order: ["update_date"],
          });
        }
        if (dateEnd === 3) {
          data = await Task.findAll({
            where: and(
              { responsible: responsible },
              { creator: id },
              {
                end_date: { [Op.gt]: dates },
              }
            ),
            order: ["update_date"],
          });
        }
      }
      if (!responsible && dateEnd) {
        if (dateEnd === 1) {
          data = await Task.findAll({
            where: and(
              or({ responsible: id }, { creator: id }),
              {
                end_date: { [Op.gte]: dates },
              },
              {
                end_date: { [Op.lte]: endDate },
              }
            ),
            order: ["update_date"],
          });
        }
        if (dateEnd === 2) {
          data = await Task.findAll({
            where: and(
              or({ responsible: id }, { creator: id }),
              {
                end_date: { [Op.lte]: dates },
              },
              {
                end_date: { [Op.gt]: date },
              }
            ),
            order: ["update_date"],
          });
        }
        if (dateEnd === 3) {
          data = await Task.findAll({
            where: and(or({ responsible: id }, { creator: id }), {
              end_date: { [Op.gt]: dates },
            }),
            order: ["update_date"],
          });
        }
      }
      if (responsible && !dateEnd) {
        data = await Task.findAll({
          where: and({ responsible: responsible }, { creator: id }),
          order: ["update_date"],
        });
      }
      if (data.length === 0) {
        return res.json({ message: "Ничего не найдено" });
      }
      return res.json(data);
    } catch (error) {
        console.log(error)
      return res.json({ message: "Некорректные данные" });
    }
  }
  async createTask(req, res) {
    const {
      title,
      description,
      status,
      priority,
      creator,
      responsible,
      end_date,
      data_creation,
      update_date,
    } = req.body;
    try {
      if (
        !title &&
        !description &&
        !status &&
        !priority &&
        !creator &&
        !responsible &&
        !end_date &&
        !data_creation &&
        !update_date
      ) {
        return res.json({ message: "Не все поля заполнены" });
      }

      const task = await Task.create({
        title,
        description,
        status,
        priority,
        creator,
        responsible,
        end_date,
        data_creation,
        update_date,
      });

      return res.json(task);
    } catch (error) {
      return res.json({ message: "Непредвиденная ошибка" });
    }
  }
  async updateTask(req, res) {
    const {
      id,
      title,
      description,
      status,
      priority,
      creator,
      responsible,
      end_date,
      data_creation,
      update_date,
    } = req.body;
    try {
      if (
        !id &&
        !title &&
        !description &&
        !status &&
        !priority &&
        !creator &&
        !responsible &&
        !end_date &&
        !data_creation &&
        !update_date
      ) {
        return res.json({ message: "Не все поля заполнены" });
      }
      const data = await (
        await Task.findOne({ where: { id } })
      ).update({
        title: title,
        description: description,
        status: status,
        priority: priority,
        creator: creator,
        responsible: responsible,
        end_date: end_date,
        data_creation: data_creation,
        update_date: update_date,
      });
      return res.json(data);
    } catch (error) {
      return res.json({ message: "Непредвиденная ошибка" });
    }
  }
}
module.exports = new TaskController();
