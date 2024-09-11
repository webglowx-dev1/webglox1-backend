import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelize } from './init';

class CmsModel extends Model {
    public id!: number;
    public key!: string;
    public value!: string;
    public is_deleted!: boolean;
    public is_active!: boolean;
}

CmsModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING,
        },
        value: {
            type: DataTypes.STRING,
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
        modelName: 'Cms', // Define the model name
        tableName: 'cms', // Define the table name (optional)
        timestamps: true,
    }
);

export default CmsModel;