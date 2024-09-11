import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelize } from './init';

class UserTokenModel extends Model{
    public id!: number;
    public user_id!: string;
    public token!: string;
    public firebase_token!: string;
}

UserTokenModel.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED, // you can omit the `DataTypes.` if you import them individually
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        token: {
            type: new DataTypes.STRING(500),
            allowNull: false,
        },
        firebase_token: {
            type: new DataTypes.STRING(128),
            defaultValue: 'Test'
        },
      
    },
    {
        sequelize, // Pass the Sequelize instance
        modelName: 'UserTokenModel', // Define the model name
        tableName: 'user_tokes', // Define the table name (optional)
        timestamps: true,
    }
);

export default UserTokenModel;