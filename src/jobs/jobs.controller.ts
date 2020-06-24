import {
  Controller, UseGuards, Get, Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { CurrentUser } from 'src/shared/decorators/user-info.decorator';
import { User } from 'src/users/users.entity';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() currentUser: User) {
    return this.jobsService.findInClient(currentUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':cron')
  async findOne(@Param('cron') cronExp: string, @CurrentUser() currentUser: User) {
    return this.jobsService.findOneInClient(currentUser, cronExp);
  }
}
