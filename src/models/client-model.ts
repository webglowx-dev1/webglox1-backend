import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "./init";
import { integer } from "aws-sdk/clients/cloudfront";

class ClientModel extends Model {
  public id!: number;
  public client_name!: string;
  public client_company!: string;
  public description!: string;
  public image_path!: string;
  public is_deleted!: boolean;
  public is_active!: boolean;
  public ratings!: integer;
}

ClientModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_name: {
      type: DataTypes.STRING,
    },
    client_company: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    ratings: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
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
    modelName: "Client", // Define the model name
    tableName: "clients", // Define the table name (optional)
    timestamps: true,
  }
);

export default ClientModel;
