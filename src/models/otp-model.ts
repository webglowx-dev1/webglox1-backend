import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelize } from './init';

class OtpModel extends Model {
    public id!: number;
    public user_id!: any; // Use the appropriate type for user_id, e.g., number
    public admin_id!: any; // Use the appropriate type for admin_id, e.g., number
    public otp!: string | null;
    public token!: string | null;
    public expiry!: Date | null;
    public is_active!: boolean;
    public is_verified!: boolean;

}

OtpModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.STRING, // Use the appropriate Sequelize data type
        },
        admin_id: {
            type: DataTypes.STRING, // Use the appropriate Sequelize data type
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        expiry: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize, // Pass the Sequelize instance
        modelName: 'OtpModel', // Define the model name
        tableName: 'otps', // Define the table name (optional)
        timestamps: true,
    }
);

export default OtpModel;