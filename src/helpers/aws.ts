import AWS from "aws-sdk";
AWS.config = new AWS.Config({
    accessKeyId: process.env.AWS_S3_API_KEY,
    secretAccessKey: process.env.AWS_S3_API_SECRET,
    region: process.env.AWS_S3_BUCKET_REGION,
    signatureVersion: "v4",
});

const s3 = new AWS.S3();

const uploadImageToS3 = async (filename: string, blob: any) => {
    let uploadedImage = null
    if (process.env.AWS_S3_COMMON_BUCKET_NAME) {
        uploadedImage = await s3.upload({
            Bucket: process.env.AWS_S3_COMMON_BUCKET_NAME,
            Key: filename,
            Body: blob,
        }).promise();
    }
    return uploadedImage;
};
const uploadFileToS3 = async (filename: string, blob: any) => {
    let uploadedImage = null
    if (process.env.AWS_S3_COMMON_BUCKET_NAME) {
        uploadedImage = await s3.upload({
            Bucket: process.env.AWS_S3_COMMON_BUCKET_NAME,
            Key: filename,
            Body: blob,
        }).promise();
    }
    return uploadedImage;
};

export default {
    uploadImageToS3,
    uploadFileToS3
} as const;