import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpsertSettingDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class UpsertSettingsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpsertSettingDto)
  settings: UpsertSettingDto[];
}
