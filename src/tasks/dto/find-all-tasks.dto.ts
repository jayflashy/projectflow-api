import { ApiPropertyOptional } from '@nestjs/swagger';
import { Status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationValidator } from 'src/helper/pagination.helper';

export class FindAllTasksDto extends PaginationValidator {
  @ApiPropertyOptional({
    description: 'Filter tasks by status',
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiPropertyOptional({
    description: 'Filter tasks by Project ID (UUID)',
  })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiPropertyOptional({
    description: 'Filter tasks by Category ID (UUID)',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Sort by field and order (e.g., createdAt:desc)',
  })
  @IsOptional()
  @IsString()
  sort?: string;
}
