import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class GptService {
  private gpt: OpenAI;

  constructor() {
    this.gpt = new OpenAI();
  }

  async decodeDream(content: string) {
    const stream = await this.gpt.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        { role: 'system', content: 'You are a dream interpreter.' },
        {
          role: 'user',
          content: `${content} 의 꿈 내용 해몽해줘`,
        },
      ],
      stream: true,
    });

    return stream;
  }

  async generatedImg() {
    const response = await this.gpt.images.generate({
      model: 'dall-e-2',
      response_format: 'b64_json',
      prompt: '하얀색 고양이가 있어 의 내용으로 몽환적인 꿈 이미지',
      n: 1,
      size: '512x512',
    });
    const base64Image = response.data[0].b64_json as string;
    const imageBuffer = Buffer.from(base64Image, 'base64');
  }
}
