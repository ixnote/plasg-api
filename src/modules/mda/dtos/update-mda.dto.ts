import { ApiProperty } from "@nestjs/swagger";
import { AddAboutDto } from "./add-about.dto";
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from "class-validator";
import { AddDirectorDto } from "./add-director.dto";
import { AddContactDto } from "./add-contact.dto";
import { AddHeroDto } from "./add-hero.dto";
import { AddTeamMembersDto } from "./add-team.dto";
import { Type } from "class-transformer";

export class UpdateMdaDto {

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    published: boolean

    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    abbreviation: string
    
    @ApiProperty()
    @IsOptional()
    about: AddAboutDto
  
    @ApiProperty()
    @IsOptional()
    contact: AddContactDto
  
    @ApiProperty()
    @IsOptional()
    director: AddDirectorDto
  
    @ApiProperty()
    @IsOptional()
    hero: AddHeroDto
  
    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() =>  AddTeamMembersDto)
    @IsOptional()
    team: AddTeamMembersDto[];
  
  }