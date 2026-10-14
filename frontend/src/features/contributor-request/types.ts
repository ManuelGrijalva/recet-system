export type ContributorRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ContributorRequest {
  id: string;
  motivation: string | null;
  status: ContributorRequestStatus;
  reviewNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface ContributorRequestPayload {
  motivation?: string;
  acceptedGuidelines: true;
}
