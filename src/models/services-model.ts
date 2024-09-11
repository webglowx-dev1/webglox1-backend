import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "./init";


class ServicesModel extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public image_path!: string;
  public is_deleted!: boolean;
  public is_active!: boolean;
}

ServicesModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "Services", // Define the model name
    tableName: "services", // Define the table name (optional)
    timestamps: true,
  }
);

export default ServicesModel;
