const { 
    GetObjectCommand, 
    ListObjectsV2Command, 
    PutObjectCommand, 
    S3Client 
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuid } = require("uuid");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = process.env.BUCKET;

const uploadToS3 = async ({ file, userId }) => {
  const key = `${userId}/${uuid()}`;
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await s3.send(command);
    const url = await getSignedUrl(s3, new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }));
    if (!url) {
      throw new Error("Error getting the signed URL");
    }
    console.log(url);
    return { url };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

module.exports = { uploadToS3 };