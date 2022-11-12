const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('users', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    lastname: {type: DataTypes.STRING, allowNull: false},
    patronymic: {type: DataTypes.STRING, allowNull: false},
    login: {type: DataTypes.CHAR, allowNull: false},
    password: {type: DataTypes.CHAR, allowNull: false},
    manager: {type: DataTypes.INTEGER, allowNull: true},
})

const Task = sequelize.define('tasks', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
    status: {type: DataTypes.STRING, allowNull: false},
    priority: {type: DataTypes.STRING, allowNull: false},
    creator: {type: DataTypes.INTEGER, allowNull: false},
    responsible: {type: DataTypes.INTEGER, allowNull: false},
    end_date: {type: DataTypes.DATE, allowNull: false},
    data_creation: {type: DataTypes.DATE, allowNull: false},
    update_date: {type: DataTypes.DATE, allowNull: false},
})

User.hasMany(Task, {foreignKey: 'responsible'})
Task.belongsTo(User, {foreignKey: 'responsible'}) 

User.hasMany(Task, {foreignKey: 'creator'})
Task.belongsTo(User, {foreignKey: 'creator'}) 

User.hasMany(User, {foreignKey: 'manager'})
User.belongsTo(User, {foreignKey: 'manager'})

module.exports = {
    User,
    Task
}