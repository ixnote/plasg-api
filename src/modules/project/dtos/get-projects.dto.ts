import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsEnum, IsNumberString, IsOptional, IsString, Validate } from "class-validator";
import { ProjectStatus } from "src/common/constants/enum";
import { FromToConstraint } from "src/common/decorators/from-to-constraint.decorator";
import { IsSortValue } from "src/common/decorators/sorted.decorator";

export class GetProjectsDto{
    @IsNumberString()
    @IsOptional()
    page?: number;
  
    @IsNumberString()
    @IsOptional()
    pageSize?: number;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    start?: number;
  
    @ApiProperty()
    @IsDateString()
    @Validate(FromToConstraint)
    @IsOptional()
    end?: number;
    
    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    location?: string;

    @ApiProperty()
    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: string;

    @IsSortValue()
    @IsOptional()
    sort?: number;
}