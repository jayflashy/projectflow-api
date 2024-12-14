import { ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationValidator } from 'src/helper/pagination.helper';

export class FindAllUsersDto extends PaginationValidator {
  @ApiPropertyOptional({
    description: 'Filter users by role',
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({
    description: 'Sort by field and order (e.g., createdAt:desc)',
  })
  @IsOptional()
  @IsString()
  sort?: string;
}
