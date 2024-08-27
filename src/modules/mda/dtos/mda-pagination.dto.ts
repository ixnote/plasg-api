import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumberString, IsOptional, IsString, Validate } from "class-validator";
import { FromToConstraint } from "src/common/decorators/from-to-constraint.decorator";

export class MdaPaginationDto{
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
    contact?: string;
}