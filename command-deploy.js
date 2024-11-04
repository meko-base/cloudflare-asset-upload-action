import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { MimeType } from 'mime-type';
import mimeDb from 'mime-db';

export async function commandDeploy({ projectName, distDir = 'dist/' }) {
  const distGlob = `${distDir}/**/*`;
  const version = Math.floor(Date.now() / 1000);

  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
  });

  const files = await glob(distGlob, { nodir: true });
  const filesPromises = [];

  for (const file of files) {
    const fileName = file.slice(distDir.length);
    const fileContent = await fs.readFile(file);
    const mimeType = new MimeType(mimeDb).lookup(path.extname(file)) || 'text/plain; charset=utf-8';
    const objectKey = `${projectName}/${version}/${fileName}`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Body: fileContent,
      Key: objectKey,
      ContentType: mimeType
    });

    filesPromises.push(client.send(putObjectCommand));
  }

  await Promise.allSettled(filesPromises);

  return version;
}

commandDeploy({ projectName: 'sandbox', distDir: 'test_dist/' });