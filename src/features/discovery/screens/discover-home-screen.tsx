import { useDeferredValue, useMemo, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import {
  useDiscoverBrandsQuery,
  useDiscoverCategoriesQuery,
  useDiscoverProvidersQuery,
  useDiscoverServicesQuery,
} from '@/features/discovery/hooks/use-discovery-queries';
import type { DiscoverBrandsQueryParams } from '@/features/discovery/types/discovery-types';
import { routes } from '@/shared/constants/routes';
import { VisibilityLabel } from '@/shared/enums/domain';
import type {
  BrandSummaryDto,
  ProviderSummaryDto,
  ServiceCategoryDto,
  ServiceSummaryDto,
} from '@/shared/types/entities';
import { ShellNav } from '@/shared/ui/composite/shell-nav';
import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { Screen } from '@/shared/ui/primitives/screen';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';
import { TextField } from '@/shared/ui/primitives/text-field';

const customerNavItems = [
  {
    href: routes.customerDiscover,
    key: 'discover',
    label: 'Discover',
  },
  {
    href: routes.customerAccount,
    key: 'account',
    label: 'Account',
  },
] as const;

const highlightLabels = [
  {
    key: 'ALL',
    label: 'All',
    value: undefined,
  },
  {
    key: VisibilityLabel.COMMON,
    label: 'Common',
    value: VisibilityLabel.COMMON,
  },
  {
    key: VisibilityLabel.VIP,
    label: 'VIP',
    value: VisibilityLabel.VIP,
  },
  {
    key: VisibilityLabel.BEST_OF_MONTH,
    label: 'Best of month',
    value: VisibilityLabel.BEST_OF_MONTH,
  },
  {
    key: VisibilityLabel.FEATURED,
    label: 'Featured',
    value: VisibilityLabel.FEATURED,
  },
] as const;

function EmptyState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <SurfaceCard className="rounded-2xl bg-canvas px-4 py-4">
      <View className="gap-1">
        <AppText variant="label">{title}</AppText>
        <AppText className="text-ink-soft">{description}</AppText>
      </View>
    </SurfaceCard>
  );
}

function SectionFrame({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <SurfaceCard className="gap-4">
      <View className="gap-1">
        <AppText variant="title">{title}</AppText>
        <AppText className="text-ink-soft">{description}</AppText>
      </View>
      {children}
    </SurfaceCard>
  );
}

function CategoryChip({
  category,
  isActive,
  onPress,
}: {
  category: ServiceCategoryDto;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={`rounded-full px-4 py-3 ${isActive ? 'bg-accent' : 'bg-surface-muted'}`}
      onPress={onPress}
    >
      <AppText className={isActive ? 'text-surface' : 'text-ink'} variant="caption">
        {category.name}
      </AppText>
    </Pressable>
  );
}

function CollectionChip({
  isActive,
  label,
  onPress,
}: {
  isActive: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={`rounded-full px-4 py-3 ${isActive ? 'bg-accent' : 'bg-surface-muted'}`}
      onPress={onPress}
    >
      <AppText className={isActive ? 'text-surface' : 'text-ink'} variant="caption">
        {label}
      </AppText>
    </Pressable>
  );
}

function ServiceCard({ service }: { service: ServiceSummaryDto }) {
  const priceLabel =
    service.price !== null && service.price !== undefined && service.currency
      ? `${service.price} ${service.currency}`
      : 'Price on request';

  return (
    <SurfaceCard className="gap-2 rounded-2xl bg-canvas px-4 py-4">
      <AppText variant="label">{service.name}</AppText>
      <AppText className="text-ink-soft">{service.provider.fullName}</AppText>
      <AppText className="text-ink-soft">
        {service.category?.name ?? 'General service'} · {priceLabel}
      </AppText>
      <AppText className="text-ink-soft">
        Rating {service.ratingAverage?.toFixed(1) ?? 'New'} ·{' '}
        {service.availabilitySuggestions?.[0] ?? 'Availability shown as suggestions'}
      </AppText>
    </SurfaceCard>
  );
}

function ProviderCard({ provider }: { provider: ProviderSummaryDto }) {
  return (
    <SurfaceCard className="gap-2 rounded-2xl bg-canvas px-4 py-4">
      <AppText variant="label">{provider.fullName}</AppText>
      <AppText className="text-ink-soft">
        Rating {provider.ratingAverage?.toFixed(1) ?? 'New'} ·{' '}
        {provider.ratingCount ?? 0} reviews
      </AppText>
      <AppText className="text-ink-soft">
        Verified phone: {provider.isVerifiedPhone ? 'Yes' : 'No'} · Verified
        email: {provider.isVerifiedEmail ? 'Yes' : 'No'}
      </AppText>
    </SurfaceCard>
  );
}

function BrandCard({ brand }: { brand: BrandSummaryDto }) {
  return (
    <SurfaceCard className="gap-2 rounded-2xl bg-canvas px-4 py-4">
      <AppText variant="label">{brand.name}</AppText>
      <AppText className="text-ink-soft">
        Rating {brand.ratingAverage?.toFixed(1) ?? 'New'} · Members{' '}
        {brand.memberCount ?? 0}
      </AppText>
      <AppText className="text-ink-soft">
        {brand.address?.trim() || 'Location details will appear here once available.'}
      </AppText>
    </SurfaceCard>
  );
}

function QuerySection<TItem>({
  data,
  description,
  emptyDescription,
  emptyTitle,
  errorMessage,
  isLoading,
  onRetry,
  renderItem,
  title,
}: {
  data: TItem[] | undefined;
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  errorMessage?: string;
  isLoading: boolean;
  onRetry: () => void;
  renderItem: (item: TItem, index: number) => React.ReactNode;
  title: string;
}) {
  return (
    <SectionFrame description={description} title={title}>
      {isLoading ? (
        <EmptyState
          description="Loading the latest results for this section."
          title="Loading"
        />
      ) : errorMessage ? (
        <SurfaceCard className="gap-3 rounded-2xl border-danger bg-danger/5 px-4 py-4">
          <AppText className="text-danger" variant="caption">
            {errorMessage}
          </AppText>
          <AppButton label="Retry" onPress={onRetry} tone="secondary" />
        </SurfaceCard>
      ) : !data?.length ? (
        <EmptyState description={emptyDescription} title={emptyTitle} />
      ) : (
        <View className="gap-3">
          {data.map((item, index) => (
            <View key={index}>{renderItem(item, index)}</View>
          ))}
        </View>
      )}
    </SectionFrame>
  );
}

export function DiscoverHomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [selectedLabel, setSelectedLabel] = useState<
    VisibilityLabel | undefined
  >(undefined);
  const deferredSearchQuery = useDeferredValue(searchQuery.trim());

  const serviceParams = useMemo(
    () => ({
      categoryId: selectedCategoryId ?? undefined,
      label: selectedLabel,
      limit: 6,
      page: 1,
      q: deferredSearchQuery || undefined,
      sortBy: 'rating' as const,
      sortOrder: 'desc' as const,
    }),
    [deferredSearchQuery, selectedCategoryId, selectedLabel],
  );
  const providerParams = useMemo(
    () => ({
      limit: 4,
      page: 1,
      q: deferredSearchQuery || undefined,
      sortBy: 'rating' as const,
      sortOrder: 'desc' as const,
    }),
    [deferredSearchQuery],
  );
  const brandParams = useMemo<DiscoverBrandsQueryParams>(
    () => ({
      limit: 4,
      page: 1,
      q: deferredSearchQuery || undefined,
      sortBy: 'popularity',
      sortOrder: 'desc',
    }),
    [deferredSearchQuery],
  );

  const categoriesQuery = useDiscoverCategoriesQuery();
  const servicesQuery = useDiscoverServicesQuery(serviceParams);
  const providersQuery = useDiscoverProvidersQuery(providerParams);
  const brandsQuery = useDiscoverBrandsQuery(brandParams);

  return (
    <Screen contentClassName="gap-6" scroll>
      <SurfaceCard className="gap-4 bg-accent px-6 py-6">
        <View className="gap-2">
          <AppText className="text-surface/75" variant="eyebrow">
            Customer discover
          </AppText>
          <AppText className="text-surface" variant="display">
            Explore services without rigid slot promises.
          </AppText>
          <AppText className="text-surface/80">
            Search is powered by the discovery endpoints and presents
            availability as suggestions, not guaranteed slots.
          </AppText>
        </View>
      </SurfaceCard>

      <SurfaceCard className="gap-4">
        <TextField
          autoCapitalize="none"
          autoCorrect={false}
          helperText="Search services, providers, and brands with one query."
          label="Search"
          onChangeText={setSearchQuery}
          placeholder="Try barber, dental, studio, or a provider name"
          returnKeyType="search"
          value={searchQuery}
        />

        <View className="gap-2">
          <AppText variant="label">Collections</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {highlightLabels.map((item) => (
                <CollectionChip
                  isActive={selectedLabel === item.value}
                  key={item.key}
                  label={item.label}
                  onPress={() => setSelectedLabel(item.value)}
                />
              ))}
            </View>
          </ScrollView>
        </View>

        <View className="gap-2">
          <AppText variant="label">Quick categories</AppText>
          {categoriesQuery.isError ? (
            <SurfaceCard className="rounded-2xl border-danger bg-danger/5 px-4 py-4">
              <AppText className="text-danger" variant="caption">
                We could not load categories yet.
              </AppText>
            </SurfaceCard>
          ) : categoriesQuery.isLoading ? (
            <EmptyState
              description="Loading quick categories for discovery."
              title="Loading"
            />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                <CollectionChip
                  isActive={selectedCategoryId === null}
                  label="All categories"
                  onPress={() => setSelectedCategoryId(null)}
                />
                {categoriesQuery.data?.map((category) => (
                  <CategoryChip
                    category={category}
                    isActive={selectedCategoryId === category.id}
                    key={category.id}
                    onPress={() =>
                      setSelectedCategoryId((current) =>
                        current === category.id ? null : category.id,
                      )
                    }
                  />
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </SurfaceCard>

      <QuerySection
        data={servicesQuery.data?.data}
        description="Top-rated or filtered services from `GET /discover/services`."
        emptyDescription="Try clearing filters or using a broader search term."
        emptyTitle="No services found"
        errorMessage={
          servicesQuery.isError ? 'We could not load service suggestions.' : undefined
        }
        isLoading={servicesQuery.isLoading}
        onRetry={() => void servicesQuery.refetch()}
        renderItem={(service) => <ServiceCard service={service} />}
        title="Service suggestions"
      />

      <QuerySection
        data={providersQuery.data?.data}
        description="Provider discovery results from `GET /discover/providers`."
        emptyDescription="Try a different search term to broaden the result set."
        emptyTitle="No providers found"
        errorMessage={
          providersQuery.isError ? 'We could not load providers right now.' : undefined
        }
        isLoading={providersQuery.isLoading}
        onRetry={() => void providersQuery.refetch()}
        renderItem={(provider) => <ProviderCard provider={provider} />}
        title="Top providers"
      />

      <QuerySection
        data={brandsQuery.data?.data}
        description="Brand visibility results from `GET /discover/brands`."
        emptyDescription="No brands matched the current search yet."
        emptyTitle="No brands found"
        errorMessage={
          brandsQuery.isError ? 'We could not load brands right now.' : undefined
        }
        isLoading={brandsQuery.isLoading}
        onRetry={() => void brandsQuery.refetch()}
        renderItem={(brand) => <BrandCard brand={brand} />}
        title="Visible brands"
      />

      <SurfaceCard className="gap-2 bg-surface-muted">
        <AppText variant="label">Scheduling note</AppText>
        <AppText className="text-ink-soft">
          `openNow` and availability suggestions are approximate guidance only.
          Final acceptance still depends on the provider workflow.
        </AppText>
      </SurfaceCard>

      <ShellNav activeKey="discover" items={customerNavItems} />
    </Screen>
  );
}
