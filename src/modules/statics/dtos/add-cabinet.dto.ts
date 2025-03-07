import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator'; 

export class AddCabinetDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    image: string;
  
    @ApiProperty()
    @IsString()
    @IsOptional()
    title: string;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    role?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    constituency?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    cover_image?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    party?: string;
  
    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    type: string;

    @IsString()
    @IsMongoId()
    @IsOptional()
    parent?: string;
}
