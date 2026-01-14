import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiAnalysisService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');

    this.genAI = new GoogleGenerativeAI(apiKey as string);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async analyzeDiaryEntry(content: string) {
    // We strip HTML tags from Tiptap before sending
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
  }
}
