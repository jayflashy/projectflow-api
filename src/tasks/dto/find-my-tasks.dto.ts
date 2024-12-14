import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationValidator } from 'src/helper/pagination.helper';

export class FindMyTasksDto extends PaginationValidator {
  @ApiPropertyOptional({
    description: 'Filter tasks by status',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
