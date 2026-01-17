import { GoogleGenerativeAI } from '@google/generative-ai';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiAnalysisService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    this.genAI = new GoogleGenerativeAI(apiKey as string);
    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
    });
  }

  async analyzeDiaryEntry(content: string) {
    try {
      const cleanText = content.replace(/<[^>]*>/g, '');

      const prompt = `
      Analyze the following diary entry. 
      Detect the language (English, Bangla, or Arabic).
      Identify the overall mood (Score -1 to 1).
      Extract 3 unique keywords.
      Return ONLY a JSON object: 
      { "language": "...", "score": 0.5, "mood": "..." }
      
      Entry: "${cleanText}"
    `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;

      // return JSON.parse(response.text());
      return response.text();
    } catch (error) {
      // console.error('Gemini Error:', error);

      // Extract status from Google error or default to 500
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;

      // Throw a clean exception that NestJS understands
      throw new HttpException(
        {
          status: status,
          error: 'AI_ANALYSIS_FAILED',
          message: error.statusText,
          details: error.message, // Optional: useful for debugging Banglish issues
        },
        status,
      );
    }
  }
}
