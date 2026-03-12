import { VisibilityLabel } from '@/shared/enums/domain';

export type SortOrder = 'asc' | 'desc';

export type DiscoverServiceSortBy =
  | 'availability'
  | 'popularity'
  | 'price'
  | 'proximity'
  | 'rating';

export type DiscoverProviderSortBy = 'popularity' | 'proximity' | 'rating';
export type DiscoverBrandSortBy = 'popularity' | 'proximity' | 'rating';

interface BaseDiscoveryQueryParams<TSortBy extends string> {
  lat?: number;
  limit?: number;
  lng?: number;
  minRating?: number;
  page?: number;
  q?: string;
  radiusKm?: number;
  sortBy?: TSortBy;
  sortOrder?: SortOrder;
}

export interface DiscoverServicesQueryParams
  extends BaseDiscoveryQueryParams<DiscoverServiceSortBy> {
  categoryId?: string;
  label?: VisibilityLabel;
  maxPrice?: number;
  minPrice?: number;
  openNow?: boolean;
}

export type DiscoverProvidersQueryParams =
  BaseDiscoveryQueryParams<DiscoverProviderSortBy>;

export type DiscoverBrandsQueryParams =
  BaseDiscoveryQueryParams<DiscoverBrandSortBy>;
