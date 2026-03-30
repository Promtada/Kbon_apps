import { Controller, Post, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    // Generate a unique identifier for the file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

@Controller('uploads')
export class UploadsController {
  @Post('media')
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
      fileFilter: (req, file, cb) => {
        // Accept only images and videos
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|mp4|webm|avi|mov)$/)) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Invalid file type. Only images and videos are allowed.'), false);
        }
      },
    }),
  )
  uploadMedia(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is empty or invalid.');
    }

    // Return the accessible URL
    // In production, this should ideally be an absolute URL or uploaded to S3
    return {
      url: `http://localhost:4000/uploads/${file.filename}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }
}
