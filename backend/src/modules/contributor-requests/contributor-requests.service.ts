import { ConflictException, Injectable } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { contributorRequests } from '../../database/schema';
import { AuthenticatedUser } from '../../common/decorators/current-user.decorator';
import { CreateContributorRequestDto } from './dto/create-contributor-request.dto';

export type ContributorRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ContributorRequestItem {
  id: string;
  motivation: string | null;
  status: ContributorRequestStatus;
  reviewNotes: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
}

const requestColumns = {
  id: contributorRequests.id,
  motivation: contributorRequests.motivation,
  status: contributorRequests.status,
  reviewNotes: contributorRequests.reviewNotes,
  reviewedAt: contributorRequests.reviewedAt,
  createdAt: contributorRequests.createdAt,
};

@Injectable()
export class ContributorRequestsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // La mas reciente basta para saber si esta pendiente, aprobada o rechazada
  async findLatest(userId: string): Promise<ContributorRequestItem | null> {
    const [latest] = await this.databaseService.db
      .select(requestColumns)
      .from(contributorRequests)
      .where(eq(contributorRequests.userId, userId))
      .orderBy(desc(contributorRequests.createdAt))
      .limit(1);

    return latest ?? null;
  }

  async create(
    user: AuthenticatedUser,
    dto: CreateContributorRequestDto,
  ): Promise<ContributorRequestItem> {
    if (user.role !== 'USER') {
      throw new ConflictException('Tu cuenta ya puede publicar recetas');
    }

    const db = this.databaseService.db;
    const [pending] = await db
      .select({ id: contributorRequests.id })
      .from(contributorRequests)
      .where(and(eq(contributorRequests.userId, user.id), eq(contributorRequests.status, 'PENDING')))
      .limit(1);

    if (pending) {
      throw new ConflictException('Ya tienes una solicitud en revision');
    }

    const [created] = await db
      .insert(contributorRequests)
      .values({ userId: user.id, motivation: dto.motivation?.trim() || null })
      .returning(requestColumns);

    return created;
  }
}
