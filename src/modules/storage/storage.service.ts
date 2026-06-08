import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class FileStorageService {
  /**
   * Uploads a file to a storage provider.
   * @param fileBuffer - Buffer containing file data
   * @param originalName - Name of the file being uploaded
   * @param mimetype - MIME type of the file
   * @returns Public URL of the uploaded file
   */
  abstract uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimetype: string,
  ): Promise<string>;

  /**
   * Deletes a file from the storage provider by its url
   * @param fileUrl - The url of the file to delete
   */
  abstract deleteFile(fileUrl: string): Promise<void>;

  /**
   * Retrieves a signed URL to read a file
   * @param fileName - File name to retrieve url
   */
  abstract getSignedUrl(fileName: string): Promise<string>;

  /**
   * Retrieves a signed URL to upload a file (action: 'write')
   * @param fileName - Original name of the file
   * @param mimetype - MIME type of the file
   * @returns An object containing the upload signed URL and the final public URL
   */
  abstract getUploadPresignedUrl(
    fileName: string,
    mimetype: string,
  ): Promise<{ uploadUrl: string; fileUrl: string }>;
}
