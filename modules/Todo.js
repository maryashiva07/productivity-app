const {DataTypes} = require("sequelize");

const Sequelize = require("../config/database");


const Todo = Sequelize.define("Todo",{
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
      title:{
         type : DataTypes.STRING,
         allowNull: false
      },
      description:{
          type: DataTypes.STRING,
          allowNull: false
      },
      priority:{
        type: DataTypes.STRING,
        allowNull: false
      },
      status:{
         type: DataTypes.STRING,
         allowNull:false
      },
      userId: {
         type: DataTypes.INTEGER,
         allowNull: false
}
});

module.exports = Todo;