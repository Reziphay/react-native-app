import { useQuery } from '@tanstack/react-query';

import { discoveryApi } from '@/features/discovery/api/discovery-api';
import type {
  DiscoverBrandsQueryParams,
  DiscoverProvidersQueryParams,
  DiscoverServicesQueryParams,
} from '@/features/discovery/types/discovery-types';
import { qk } from '@/shared/api/query-keys';

export function useDiscoverCategoriesQuery() {
  return useQuery({
    queryFn: () => discoveryApi.getCategories().then((result) => result.data),
    queryKey: qk.discover.categories,
  });
}

export function useDiscoverServicesQuery(params?: DiscoverServicesQueryParams) {
  return useQuery({
    queryFn: () => discoveryApi.getServices(params),
    queryKey: qk.discover.services(params),
  });
}

export function useDiscoverProvidersQuery(
  params?: DiscoverProvidersQueryParams,
) {
  return useQuery({
    queryFn: () => discoveryApi.getProviders(params),
    queryKey: qk.discover.providers(params),
  });
}

export function useDiscoverBrandsQuery(params?: DiscoverBrandsQueryParams) {
  return useQuery({
    queryFn: () => discoveryApi.getBrands(params),
    queryKey: qk.discover.brands(params),
  });
}
