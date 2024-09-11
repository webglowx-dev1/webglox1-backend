import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelize } from './init';

class TeamModel extends Model {
    public id!: number;
    public name!: string;
    public designation!: string;
    public image_path!: string;
    public is_deleted!: boolean;
    public is_active!: boolean;
}

TeamModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        designation: {
            type: DataTypes.STRING,
        },
        image_path: {
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
        modelName: 'Team', // Define the model name
        tableName: 'teams', // Define the table name (optional)
        timestamps: true,
    }
);

export default TeamModel;