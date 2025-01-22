import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator'; 

export class AddCabinetDto {
  @ApiProperty()
    @IsMongoId()
    id: string;

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
    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    type: string;

    @IsString()
    @IsMongoId()
    @IsOptional()
    parent: string;
}
