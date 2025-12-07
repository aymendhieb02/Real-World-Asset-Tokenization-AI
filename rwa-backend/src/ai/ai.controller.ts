import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Get('portfolio-analysis')
  async analyzePortfolio(@Request() req) {
    return this.aiService.analyzePortfolio(req.user.id);
  }

  @Get('recommendations')
  async getRecommendations(@Request() req) {
    return this.aiService.getPropertyRecommendations(req.user.id);
  }
}
