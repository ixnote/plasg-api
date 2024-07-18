import { ApiProperty } from "@nestjs/swagger";
import { AddAboutDto } from "./add-about.dto";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { AddDirectorDto } from "./add-director.dto";
import { AddContactDto } from "./add-contact.dto";
import { AddHeroDto } from "./add-hero.dto";

export class UpdateMdaDto {

    @ApiProperty()
    @IsBoolean()
    published: boolean

    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string
    
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
  
    // @ApiProperty()
    // @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() =>  AddTeamMembersDto)
    // team: AddTeamMembersDto[];
  
  }