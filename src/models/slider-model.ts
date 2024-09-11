import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelize } from './init';

class SliderModel extends Model {
    public id!: number;
    public title!: string;
    public image_path!: string;
    public is_deleted!: boolean;
    public is_active!: boolean;
}

SliderModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
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
        modelName: 'Slider', // Define the model name
        tableName: 'slider', // Define the table name (optional)
        timestamps: true,
    }
);

export default SliderModel;