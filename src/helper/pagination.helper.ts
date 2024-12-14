import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export type PaginationOptions =
  | {
      page?: string;
      limit?: string;
    }
  | undefined;

export const computePaginationMeta = (
  total: number,
  limit: number,
  page: number,
): PaginationMeta => {
  const total_pages = Math.ceil(total / limit);
  const has_next = page < total_pages;
  const has_previous = page > 1;

  return {
    total,
    limit,
    page,
    total_pages,
    has_next,
    has_previous,
  };
};

export class PaginationValidator {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Page number (must be a number in string format)',
    example: '1',
  })
  @IsNumberString({}, { message: 'Page must be a number string' })
  page?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Number of items per page (must be a number in string format)',
    example: '10',
  })
  @IsNumberString({}, { message: 'Limit must be a number string' })
  limit?: string;
}

export function getPagination(query: PaginationValidator): {
  skip: number;
  take: number;
  page?: number;
  limit?: number;
} {
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const take = limit;
  const skip = (page - 1) * limit;

  return { skip, take, page, limit };
}
