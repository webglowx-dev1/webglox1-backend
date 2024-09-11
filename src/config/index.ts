import { config } from 'dotenv';
config();

export const {
    NODE_ENV,
    PORT,
    JWT_SECRET,
    JWT_EXPIRATION,
    LOG_FORMAT,
    LOG_DIR,
    ORIGIN,
    API_URL,
    AWS_S3_API_KEY,
    AWS_S3_API_SECRET,
    AWS_S3_BUCKET_NAME,
    AWS_S3_FILE_BUCKET_NAME,
    AWS_S3_BUCKET_REGION,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_EMAIL,
    SMTP_PASSWORD,
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE

} = process.env;
