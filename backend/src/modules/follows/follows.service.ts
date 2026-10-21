import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service';
import { userFollows, users } from '../../database/schema';

export interface FollowState {
  isFollowing: boolean;
  followersCount: number;
}

export interface FollowCounts {
  followersCount: number;
  followingCount: number;
}

@Injectable()
export class FollowsService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Seguir o dejar de seguir con el mismo boton
  async toggle(followerId: string, followedId: string): Promise<FollowState> {
    if (followerId === followedId) {
      throw new BadRequestException('No puedes seguirte a ti mismo');
    }
    const db = this.databaseService.db;

    const [target] = await db.select({ id: users.id }).from(users).where(eq(users.id, followedId)).limit(1);
    if (!target) throw new NotFoundException('Usuario no encontrado');

    const pair = and(eq(userFollows.followerId, followerId), eq(userFollows.followedId, followedId));
    const removed = await db.delete(userFollows).where(pair).returning({ followedId: userFollows.followedId });
    if (removed.length === 0) {
      await db.insert(userFollows).values({ followerId, followedId }).onConflictDoNothing();
    }

    const { followersCount } = await this.counts(followedId);
    return { isFollowing: removed.length === 0, followersCount };
  }

  async counts(userId: string): Promise<FollowCounts> {
    const [row] = await this.databaseService.db
      .select({
        followersCount: sql<number>`count(*) filter (where ${userFollows.followedId} = ${userId})::int`,
        followingCount: sql<number>`count(*) filter (where ${userFollows.followerId} = ${userId})::int`,
      })
      .from(userFollows);
    return { followersCount: row?.followersCount ?? 0, followingCount: row?.followingCount ?? 0 };
  }

  async isFollowing(followerId: string, followedId: string): Promise<boolean> {
    const [row] = await this.databaseService.db
      .select({ id: userFollows.followedId })
      .from(userFollows)
      .where(and(eq(userFollows.followerId, followerId), eq(userFollows.followedId, followedId)))
      .limit(1);
    return row !== undefined;
  }

  async followedIds(followerId: string): Promise<string[]> {
    const rows = await this.databaseService.db
      .select({ id: userFollows.followedId })
      .from(userFollows)
      .where(eq(userFollows.followerId, followerId));
    return rows.map((r) => r.id);
  }
}
