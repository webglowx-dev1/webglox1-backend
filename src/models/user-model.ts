import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelize } from './init';

class UserModel extends Model {
    public id!: number;
    public name!: string;
    public user_name!: string;
    public password!: string;
    public profile_pic!: string;  
    public status!: string;
    public is_deleted!: boolean;
    public is_active!: boolean;
}

UserModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        user_name: {
            type: DataTypes.STRING,
        },
        profile_pic: {
            type: DataTypes.STRING,
            defaultValue: process.env.DEFAULT_PROFILE_PIC,
        },
        password: {
            type: DataTypes.STRING,
        },
       
        status: {
            type: DataTypes.STRING,
            defaultValue: 1,
        },
       
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize, // Pass the Sequelize instance
        modelName: 'User', // Define the model name
        tableName: 'users', // Define the table name (optional)
        timestamps: true,
    }
);

export default UserModel;