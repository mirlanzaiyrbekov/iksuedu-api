import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuizDTO } from './dto/quiz.dto';

@Injectable()
export class QuizService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: QuizDTO) {
    try {
    } catch (error) {
      throw error;
    }
  }
  async update() {}
  async delete() {}
}
