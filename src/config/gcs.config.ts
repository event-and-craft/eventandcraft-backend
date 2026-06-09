import { registerAs } from '@nestjs/config';

export default registerAs('gcs', () => ({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: process.env.GCP_SERVICE_ACCOUNT_KEY_PATH,
  bucketName: process.env.GCS_PRODUCTION_BUCKET,
  signedUrlExpirySeconds: process.env.GCS_SIGNED_URL_EXPIRY_SECONDS
    ? parseInt(process.env.GCS_SIGNED_URL_EXPIRY_SECONDS, 10)
    : 900,
}));
