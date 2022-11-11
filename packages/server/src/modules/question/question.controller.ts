import { Body, Controller, Put } from '@nestjs/common';
import { UpdateQuestionDto } from './dto/updateQuestion.dto';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Put('update')
  async updateQuestion(@Body() updateQuestionDto: UpdateQuestionDto) {
    return await this.questionService.updateQuestion(updateQuestionDto);
  }

  // @Delete('delete/:id')
  // async deleteQuestion(@Param('id') id: string) {
  //   return await this.questionService.deleteQuestionById(id);
  // }
}
