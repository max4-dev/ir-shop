import { Injectable } from '@nestjs/common';
import sharp from 'sharp';

@Injectable()
export class GenerateService {
  public async convertToWebP(image: Buffer, quality: number) {
    let container = this.init(image);
    container = container.webp({ quality });
    const webPImage = await this.toBuffer(container);
    return webPImage;
  }

  private init(image: Buffer) {
    return sharp(image);
  }

  private async toBuffer(container: sharp.Sharp): Promise<Buffer> {
    return container.toBuffer();
  }
}
