import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private s3Client: S3Client;
  private Buket = this.configService.get<string>('AWS_S3_BUCKET_NAME');
  private path = 'dream-catcher/imags/';

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY') as string,
        secretAccessKey: this.configService.get(
          'AWS_S3_SECRET_ACCESS_KEY',
        ) as string,
      },
    });
  }

  async imageUploadToS3(file: Express.Multer.File) {
    const imageName = `${this.path}${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'), // S3 버킷 이름
      Key: imageName, // 업로드될 파일의 이름
      Body: file.buffer, // 업로드할 파일
      ACL: 'public-read', // 파일 접근 권한
      ContentType: file.mimetype, // 파일 타입
    });

    await this.s3Client.send(command);

    const url = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${this.Buket}/${imageName}`;
    return url;
  }

  async deleteImageToS3(imgUrl: string) {
    const fileName = imgUrl.split(this.path)[1];

    if (fileName) {
      const key = `${this.path}${fileName}`;
      const command = new DeleteObjectCommand({
        Bucket: this.Buket,
        Key: key,
      });

      await this.s3Client.send(command);
    }
  }
}
