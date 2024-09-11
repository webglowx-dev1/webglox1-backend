import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { sequelize } from './init';

class GalleryModel extends Model {
    public id!: number;
    public title!: string;
    public type!: string;
    public image_path!: string;
    public is_deleted!: boolean;
    public is_active!: boolean;
}

GalleryModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
        },
        type: {
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
        modelName: 'Gallery', // Define the model name
        tableName: 'gallery', // Define the table name (optional)
        timestamps: true,
    }
);

export default GalleryModel;