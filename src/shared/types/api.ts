export interface PaginationMeta {
  hasNextPage: boolean;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export type ApiMeta = PaginationMeta | Record<string, unknown> | undefined;

export interface ApiErrorDetails {
  fieldErrors?: Record<string, string[]>;
  [key: string]: unknown;
}

export interface ApiErrorPayload<
  TDetails extends ApiErrorDetails = ApiErrorDetails,
> {
  code: string;
  details?: TDetails;
  message: string;
}

export interface ApiSuccessResponse<TData, TMeta = ApiMeta> {
  data: TData;
  meta?: TMeta;
  success: true;
}

export interface ApiFailureResponse<
  TDetails extends ApiErrorDetails = ApiErrorDetails,
> {
  error: ApiErrorPayload<TDetails>;
  success: false;
}

export type ApiResponse<
  TData,
  TMeta = ApiMeta,
  TDetails extends ApiErrorDetails = ApiErrorDetails,
> = ApiSuccessResponse<TData, TMeta> | ApiFailureResponse<TDetails>;

export interface ApiResult<TData, TMeta = ApiMeta> {
  data: TData;
  meta?: TMeta;
}
