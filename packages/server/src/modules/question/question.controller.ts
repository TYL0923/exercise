import { Body, Controller, Put } from '@nestjs/common';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { Question } from './entity/question.entity';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Put('update')
  async updateQuestion(@Body() updateQuestionDto: UpdateQuestionDto) {
    return await this.questionService.updateQuestion(updateQuestionDto);
  }
  @Put('update-list')
  async updateQuestions(@Body() questions: Question[]) {
    return await this.questionService.updateQuestions(questions);
  }
  // @Delete('delete/:id')
  // async deleteQuestion(@Param('id') id: string) {
  //   return await this.questionService.deleteQuestionById(id);
  // }
}
