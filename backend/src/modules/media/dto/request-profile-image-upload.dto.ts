import { IsIn } from 'class-validator';
import { RequestImageUploadDto } from './request-image-upload.dto';

export const PROFILE_IMAGE_KINDS = ['avatar', 'cover'] as const;
export type ProfileImageKind = (typeof PROFILE_IMAGE_KINDS)[number];

export class RequestProfileImageUploadDto extends RequestImageUploadDto {
  @IsIn(PROFILE_IMAGE_KINDS)
  kind!: ProfileImageKind;
}
