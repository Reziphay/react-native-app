import { apiClient } from '@/shared/api/http-client';
import { apiRoutes } from '@/shared/api/routes';
import type { PaginationMeta } from '@/shared/types/api';
import type {
  BrandSummaryDto,
  ProviderSummaryDto,
  ServiceCategoryDto,
  ServiceSummaryDto,
} from '@/shared/types/entities';

import type {
  DiscoverBrandsQueryParams,
  DiscoverProvidersQueryParams,
  DiscoverServicesQueryParams,
} from '@/features/discovery/types/discovery-types';

function compactParams<T extends object>(params?: T) {
  if (!params) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(params as Record<string, unknown>).filter(
      ([, value]) => value !== undefined && value !== '',
    ),
  );
}

export const discoveryApi = {
  getBrands: (params?: DiscoverBrandsQueryParams) =>
    apiClient.get<BrandSummaryDto[], PaginationMeta>(apiRoutes.discover.brands, {
      params: compactParams(params),
    }),
  getCategories: () =>
    apiClient.get<ServiceCategoryDto[]>(apiRoutes.discover.categories),
  getProviders: (params?: DiscoverProvidersQueryParams) =>
    apiClient.get<ProviderSummaryDto[], PaginationMeta>(
      apiRoutes.discover.providers,
      {
        params: compactParams(params),
      },
    ),
  getServices: (params?: DiscoverServicesQueryParams) =>
    apiClient.get<ServiceSummaryDto[], PaginationMeta>(
      apiRoutes.discover.services,
      {
        params: compactParams(params),
      },
    ),
};
