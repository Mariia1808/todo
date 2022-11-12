const { User } = require("../models/models");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateJwt = (id, login, manager) => {
  return jwt.sign({ id, login, manager }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async getAll(req, res) {
    const data = await User.findAll();
    if (data.length === 0) {
      return res.json({ message: "Ничего не найдено" });
    }
    return res.json(data);
  }

  async getOne(req, res) {
    const { id } = req.params;
    try {
      const data = await User.findOne({ where: { id } });
      if (data === null) {
        return res.json({ message: "Ничего не найдено" });
      }
      return res.json(data);
    } catch (error) {
      return res.json({ message: "Некорректные данные" });
    }
  }

  async getManager(req, res) {
    try {
      const data = await User.findAll();
      if (data === null) {
        return res.json({ message: "Ничего не найдено" });
      } else {
        const arr = data.filter((user) => user.id === user.manager);
        return res.json(arr);
      }
    } catch (error) {
      return res.json({ message: "Некорректные данные" });
    }
  }
  async getResponsible(req, res) {
    const { manager } = req.params;
    console.log(manager)
    try {
      const data = await User.findAll({ where: { manager: manager } });
      if (data.length === 0) {
        return res.json({ message: "Ничего не найдено" });
      } else {
        return res.json(data);
      }
    } catch (error) {
      return res.json({ message: "Некорректные данные" });
    }
  }

  async registration(req, res) {
    let { name, lastname, patronymic, manager, login, password } = req.body;
    let user;
    try {
      if (!name && !lastname && !patronymic && !login && !password) {
        return res.json({ message: "Не все поля заполнены" });
      }
      const candidate = await User.findOne({ where: { login } });
      if (candidate) {
        return res.json({
          message: "Пользователь с таким login уже существует",
        });
      }
      if (!manager) {
        return res.json({ message: "Не выбран руководитель" });
      }
      const hashPassword = await bcrypt.hash(password, 5);
      if (manager === -1) {
        const data = (user = await User.create({
          lastname: lastname,
          name: name,
          patronymic: patronymic,
          login: login,
          password: hashPassword,
        }));
        await (
          await User.findOne({ where: { login } })
        ).update({ manager: user.id });
      } else {
        const getId = await User.findOne({ where: { manager } });
        if (getId.length !== 0) {
          const data = (user = await User.create({
            lastname: lastname,
            name: name,
            patronymic: patronymic,
            login: login,
            password: hashPassword,
          }));
          await (
            await User.findOne({ where: { login } })
          ).update({ manager: manager });
        } else {
          return res.json({ message: "Руководитель не найден" });
        }
      }
      const token = generateJwt(user.id, user.login, user.manager);
      return res.json({ token });
    } catch (error) {
      return res.json({ message: "Непредвиденная ошибка"});
    }
  }

  async check(req, res) {
    const token = generateJwt(req.id, req.login, req.manager);
    return res.json({ token });
  }

  async login(req, res) {
    const { login, password } = req.body;
    try {
      const user = await User.findOne({ where: { login } });
      if (!user) {
        return res.json({ message: "Пользователь не найден" });
      }
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        return res.json({ message: "Указан неверный пароль" });
      } else {
        const token = generateJwt(user.id, user.login, user.manager);
        return res.json({ token });
      }
    } catch (error) {
      return res.json({ message: "Непредвиденная ошибка"});
    }
  }
}
module.exports = new UserController();
