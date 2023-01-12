import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

class Users extends Model {
  declare id: number;
  declare username: string;
  declare role: number;
  declare email: string;
  declare password: string;
}

Users.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: STRING(50),
    allowNull: false,
  },
  role: {
    type: STRING(10),
    allowNull: false,
  },
  email: {
    type: STRING(50),
    allowNull: false,
  },
  password: {
    type: STRING(40),
  },
}, {
  sequelize: db,
  modelName: 'users',
  timestamps: false,
  freezeTableName: true,
});

export default Users;
