import {
  AccountStatus,
  CompletionMethod,
  NotificationType,
  ReservationStatus,
  ReviewTargetType,
  ServiceMode,
  UserRole,
  VisibilityLabel,
} from '@/shared/enums/domain';

export interface AuthTokensDto {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface VerificationStatusDto {
  email?: string | null;
  emailVerified: boolean;
  phoneNumber?: string;
  phoneVerified: boolean;
}

export interface UserProfileDto {
  accountStatus: AccountStatus;
  activeRole: UserRole;
  avatarUrl?: string | null;
  bio?: string | null;
  closedReason?: string | null;
  createdAt: string;
  email?: string | null;
  fullName: string;
  id: string;
  phoneNumber: string;
  roles: UserRole[];
  suspensionEndsAt?: string | null;
  updatedAt: string;
  verification: VerificationStatusDto;
}

export interface BrandSummaryDto {
  address?: string | null;
  description?: string | null;
  id: string;
  logoUrl?: string | null;
  memberCount?: number;
  name: string;
  ownerId: string;
  ratingAverage?: number | null;
  ratingCount?: number;
  visibilityLabels: VisibilityLabel[];
}

export interface ProviderSummaryDto {
  avatarUrl?: string | null;
  brandIds?: string[];
  fullName: string;
  id: string;
  isVerifiedEmail: boolean;
  isVerifiedPhone: boolean;
  ratingAverage?: number | null;
  ratingCount?: number;
}

export interface ServiceCategoryDto {
  id: string;
  name: string;
  slug: string;
}

export interface ServiceSummaryDto {
  address?: string | null;
  availabilitySuggestions?: string[];
  brand?: BrandSummaryDto | null;
  category?: ServiceCategoryDto | null;
  coverPhotoUrl?: string | null;
  currency?: string | null;
  distanceKm?: number | null;
  id: string;
  isOpenApproximate?: boolean;
  mode: ServiceMode;
  name: string;
  price?: number | null;
  provider: ProviderSummaryDto;
  ratingAverage?: number | null;
  ratingCount?: number;
  visibilityLabels: VisibilityLabel[];
}

export interface AvailabilityRuleBreakDto {
  endTime: string;
  startTime: string;
}

export interface AvailabilityRuleDto {
  breaks?: AvailabilityRuleBreakDto[];
  endTime: string;
  id: string;
  startTime: string;
  weekday: number;
}

export interface ServiceClosureDto {
  endAt: string;
  id: string;
  reason?: string | null;
  startAt: string;
}

export interface ServicePhotoDto {
  id: string;
  order: number;
  url: string;
}

export interface ServiceDetailDto extends ServiceSummaryDto {
  availabilityRules: AvailabilityRuleDto[];
  closures: ServiceClosureDto[];
  description?: string | null;
  freeCancellationDeadlineMinutes?: number | null;
  maxLeadTimeDays?: number | null;
  minLeadTimeMinutes?: number | null;
  photos: ServicePhotoDto[];
  waitingTimeMinutes: number;
}

export type ReservationHistoryActor =
  | 'SYSTEM'
  | 'CUSTOMER'
  | 'PROVIDER'
  | 'ADMIN';

export interface ReservationHistoryDto {
  actorId?: string | null;
  actorType: ReservationHistoryActor;
  createdAt: string;
  fromStatus?: ReservationStatus | null;
  id: string;
  reason?: string | null;
  toStatus: ReservationStatus;
}

export interface ReservationDto {
  canCancel: boolean;
  canComplete: boolean;
  canRequestChange: boolean;
  canReview: boolean;
  cancellationReason?: string | null;
  completedAt?: string | null;
  completionMethod?: CompletionMethod | null;
  customer: {
    avatarUrl?: string | null;
    fullName: string;
    id: string;
  };
  customerChangeRequestReason?: string | null;
  history: ReservationHistoryDto[];
  id: string;
  manualApprovalDeadlineAt?: string | null;
  note?: string | null;
  provider: ProviderSummaryDto;
  providerChangeRequestReason?: string | null;
  rejectionReason?: string | null;
  requestedAt: string;
  requestedStartAt: string;
  service: ServiceSummaryDto;
  status: ReservationStatus;
}

export interface ReviewTargetDto {
  rating: number;
  targetId: string;
  targetType: ReviewTargetType;
}

export interface ReviewReplyDto {
  authorId: string;
  createdAt: string;
  id: string;
  message: string;
}

export interface ReviewDto {
  author: {
    avatarUrl?: string | null;
    fullName: string;
    id: string;
  };
  comment: string;
  createdAt: string;
  deletedAt?: string | null;
  id: string;
  reply?: ReviewReplyDto | null;
  reservationId: string;
  targets: ReviewTargetDto[];
}

export type NotificationRouteScreen =
  | 'reservation_detail'
  | 'notifications'
  | 'service_detail'
  | 'provider_reservation_detail'
  | 'penalty_detail'
  | 'brand_detail'
  | 'provider_detail'
  | 'review_detail'
  | 'home';

export interface NotificationDto {
  body: string;
  createdAt: string;
  id: string;
  isRead: boolean;
  route: {
    params?: Record<string, string>;
    screen: NotificationRouteScreen;
  };
  title: string;
  type: NotificationType;
}

export type PenaltyReason = 'NO_SHOW';
export type DisputeStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface PenaltyPointDto {
  disputeStatus?: DisputeStatus;
  expiresAt: string;
  id: string;
  isActive: boolean;
  issuedAt: string;
  reason: PenaltyReason;
  reservationId: string;
}

export interface UserSettingsDto {
  marketingNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  upcomingReminderEnabled: boolean;
  upcomingReminderMinutes: number;
}
