import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

type FileInCloud = {
  Key: string;
  Url: string;
  ContentType: string;
};

export class S3Provider {
  private s3: S3Client;
  constructor(
    private region: string,
    private bucket: string,
    private folder: string = ""
  ) {
    this.s3 = new S3Client({
      region,
    });
  }

  public async uploadFile(
    type: string,
    content: Buffer
  ): Promise<FileInCloud | null> {
    const fileKey = randomUUID();
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: `${this.folder}/${fileKey}`,
      Body: content,
      ContentType: type,
    });
    try {
      await this.s3.send(command);
      const file: FileInCloud = {
        Key: fileKey,
        Url: `https://${this.bucket}.s3.${this.region}.amazonaws.com/${fileKey}`,
        ContentType: type,
      };
      return file;
    } catch (err) {
      throw err;
    }
  }

  public async getFileURL(Key: string): Promise<string | undefined> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key,
    });
    try {
      const response = await this.s3.send(command);
      if (response.$metadata.httpStatusCode == 200) {
        return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${Key}`;
      }
    } catch (err) {
      throw err;
    }
  }

  public async deleteFile(
    Key: string
  ): Promise<{ success: boolean; err?: unknown }> {
    const command = new DeleteObjectCommand({
      Key,
      Bucket: this.bucket,
    });
    try {
      const response = await this.s3.send(command);
      if (response.$metadata.httpStatusCode?.toString().startsWith("2")) {
        return { success: true, err: undefined };
      }
      return { success: false, err: new Error("S3 Response Error!") };
    } catch (err) {
      return { success: false, err };
    }
  }
}
