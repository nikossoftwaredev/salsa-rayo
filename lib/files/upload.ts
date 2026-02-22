import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

// S3-compatible storage configuration
const s3Client = new S3Client({
  region: process.env.SUPABASE_S3_REGION!,
  endpoint: process.env.SUPABASE_S3_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export const IMAGES_BUCKET = "images";

export const uploadFile = async (
  file: Buffer,
  fileName: string,
  contentType: string,
): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: IMAGES_BUCKET,
    Key: fileName,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);

  const projectRef = process.env
    .SUPABASE_S3_ENDPOINT!.replace("https://", "")
    .replace(".storage.supabase.co/storage/v1/s3", "");

  return `https://${projectRef}.supabase.co/storage/v1/object/public/${IMAGES_BUCKET}/${fileName}`;
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  const urlParts = fileUrl.split(`/public/${IMAGES_BUCKET}/`);
  if (urlParts.length !== 2) throw new Error("Invalid file URL format");

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: IMAGES_BUCKET,
      Key: urlParts[1],
    })
  );
};
