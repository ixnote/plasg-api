import { IsNumber, IsOptional, IsString } from "class-validator";

export class UserPaginationDto {
    @IsNumber()
    @IsOptional()
    page?: number;

    @IsNumber()
    @IsOptional()
    pageSize?: number;

    @IsString()
    @IsOptional()
    full_name?: string;

    @IsString()
    @IsOptional()
    createdAt?: string


    @IsString()
    @IsOptional()
    address?: string;


    @IsString()
    @IsOptional()
    owner?: string;


    @IsString()
    @IsOptional()
    email?: string;


    @IsString()
    @IsOptional()
    phone?: string;
  }
  