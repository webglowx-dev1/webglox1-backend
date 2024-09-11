import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelize } from './init';

class AdminTokenModel extends Model{
    public id!: number;
    public admin_id!: string;
    public token!: string;
    public firebase_token!: string;
}

AdminTokenModel.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED, // you can omit the `DataTypes.` if you import them individually
            autoIncrement: true,
            primaryKey: true,
        },
        admin_id: {
            type: new DataTypes.STRING(128),
            allowNull: false,
        },
        token: {
            type: new DataTypes.TEXT,
            allowNull: false,
        },
        firebase_token: {
            type: new DataTypes.STRING(128),
            defaultValue: 'Test'
        },
      
    },
    {
        sequelize, // Pass the Sequelize instance
        tableName: 'admin_tokes', // Define the table name (optional)
        timestamps: true,
    }
);

export default AdminTokenModel;