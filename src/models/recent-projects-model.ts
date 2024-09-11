import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "./init";

class RecentProjectmodel extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public url!: string;
  public image_path!: string;
  public is_deleted!: boolean;
  public is_active!: boolean;
}

RecentProjectmodel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // Make sure this is as per your requirements
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false, // Make sure this is as per your requirements
    },
    image_path: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false, // Make sure this is as per your requirements
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
    sequelize,
    modelName: 'Recentproject',
    tableName: 'recent-projects',
    timestamps: true,
  }
);

export default RecentProjectmodel;
