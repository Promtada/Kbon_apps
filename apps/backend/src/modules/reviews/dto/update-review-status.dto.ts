import { IsIn } from 'class-validator';

export class UpdateReviewStatusDto {
  @IsIn(['PENDING', 'APPROVED', 'REJECTED'])
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

