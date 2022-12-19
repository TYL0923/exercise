import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddQuestionSetDto } from './dto/addQuestionSet.dto';
import { JoinQuestionSetDto } from './dto/joinQuestionSet.dto';
import { QueryQuestionSetOptionsDto } from './dto/queryQuestionSet.dto';
import { QuestionSetService } from './question-set.service';

@Controller('questionSet')
export class QuestionSetController {
  constructor(private readonly questionSetService: QuestionSetService) {}

  @Post('identify')
  @UseInterceptors(FileInterceptor('file'))
  async identify(@UploadedFile() file: any) {
    return await this.questionSetService.identifyQuestionSet(file);
  }
  @Post('add')
  async add(@Body() addQuestionSetDto: AddQuestionSetDto) {
    return await this.questionSetService.addQuestionSet(addQuestionSetDto);
  }
  @Post('join')
  async join(@Body() joinQuestionSetDto: JoinQuestionSetDto) {
    return await this.questionSetService.joinQuestionSet(joinQuestionSetDto);
  }

  @Get('joined')
  async joined(@Query('account') account: string) {
    return await this.questionSetService.queryJoinedQuestionSetByAccount(
      account,
    );
  }

  @Get('created')
  async created(@Query('account') account: string) {
    return await this.questionSetService.queryCreatedQuestionSetByAccount(
      account,
    );
  }

  @Get('joinable')
  async joinable(@Query() options: QueryQuestionSetOptionsDto) {
    return await this.questionSetService.queryJoinableQuestion(options);
  }

  @Get('simple')
  async simple(@Query('id') id: string) {
    return await this.questionSetService.querryQuestionSetSimpleById(id);
  }

  @Get('detail')
  async detail(@Query('id') id: string, @Query('account') account: string) {
    return await this.questionSetService.queryQuestionSetDetailById(
      id,
      account,
    );
  }
  // @Put('update')
  // async update(@Body() updateQuestionSetDto: UpdateQuestionSetDto) {
  //   return await this.questionSetService.updateQuestionSet(
  //     updateQuestionSetDto,
  //   );
  // }
  @Put('reset')
  async reset(
    @Body('id') id: string,
    @Body('account') account: string,
    @Body('mode') mode: 'test' | 'exercise',
  ) {
    return await this.questionSetService.resetQuestion(id, account, mode);
  }
  // @Put('remove')
  // async remove(@Body('id') id: string, @Body('account') account: string) {
  //   return await this.questionSetService.deleteQuestionSetById(id, account);
  // }
  // @Put('exit')
  // async exit(@Body('id') id: string, @Body('account') account: string) {
  //   return await this.questionSetService.exitQuestionSetById(id, account);
  // }
}
