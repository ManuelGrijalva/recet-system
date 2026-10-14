import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { RecipeImageType, RequestImageUploadDto } from './dto/request-image-upload.dto';

export interface ImageUploadTicket {
  uploadUrl: string;
  publicUrl: string;
  expiresInSeconds: number;
}

const UPLOAD_URL_TTL_SECONDS = 300;

const EXTENSIONS: Record<RecipeImageType, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
};

@Injectable()
export class MediaService {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicUrl: string;

  constructor(configService: ConfigService) {
    this.bucket = configService.getOrThrow<string>('R2_BUCKET');
    this.publicUrl = configService.getOrThrow<string>('R2_PUBLIC_URL');
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${configService.getOrThrow<string>('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: configService.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: configService.getOrThrow<string>('R2_SECRET_ACCESS_KEY'),
      },
      // Sin checksums automaticos: el navegador no los envia en la subida prefirmada
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }

  // URL prefirmada para que el navegador suba la foto directo a R2
  async createRecipeImageUpload(
    userId: string,
    dto: RequestImageUploadDto,
  ): Promise<ImageUploadTicket> {
    const key = `recipes/${userId}/${randomUUID()}.${EXTENSIONS[dto.contentType]}`;
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: dto.contentType,
      ContentLength: dto.size,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: UPLOAD_URL_TTL_SECONDS,
      // Firmar tipo y tamano impide subir otro archivo con el mismo permiso
      signableHeaders: new Set(['content-type', 'content-length']),
    });

    return {
      uploadUrl,
      publicUrl: `${this.publicUrl}/${key}`,
      expiresInSeconds: UPLOAD_URL_TTL_SECONDS,
    };
  }

  // Solo se aceptan portadas alojadas en nuestro bucket
  isOwnRecipeImage(url: string): boolean {
    return url.startsWith(`${this.publicUrl}/recipes/`);
  }
}
