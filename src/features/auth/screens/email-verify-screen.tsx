import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

import { AccountSummaryCard } from '@/features/auth/components/account-summary-card';
import { useRequestEmailVerificationMutation } from '@/features/auth/hooks/use-request-email-verification-mutation';
import { useVerifyEmailTokenMutation } from '@/features/auth/hooks/use-verify-email-token-mutation';
import { resolveAuthenticatedRoute } from '@/features/auth/lib/auth-routing';
import { useAuthFlowStore } from '@/features/auth/store/auth-flow-store';
import { useAuthStore } from '@/features/auth/store/auth-store';
import { getApiFieldErrors, mapApiErrorToMessage } from '@/shared/api/errors';
import { routes } from '@/shared/constants/routes';
import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { Screen } from '@/shared/ui/primitives/screen';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';
import { TextField } from '@/shared/ui/primitives/text-field';

const emailRequestSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
});

type EmailRequestFormValues = z.infer<typeof emailRequestSchema>;

interface EmailVerifyScreenProps {
  token?: string;
}

export function EmailVerifyScreen({ token }: EmailVerifyScreenProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const activeRole = useAuthStore((state) => state.activeRole);
  const pendingEmail = useAuthFlowStore((state) => state.pendingEmail);
  const requestEmailVerificationMutation =
    useRequestEmailVerificationMutation();
  const verifyEmailTokenMutation = useVerifyEmailTokenMutation();
  const verifyEmailToken = verifyEmailTokenMutation.mutateAsync;
  const isVerifyingToken = verifyEmailTokenMutation.isPending;
  const [handledToken, setHandledToken] = useState<string | null>(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<EmailRequestFormValues>({
    defaultValues: {
      email:
        pendingEmail?.trim() ||
        user?.verification.email?.trim() ||
        user?.email?.trim() ||
        '',
    },
    resolver: zodResolver(emailRequestSchema),
  });

  useEffect(() => {
    if (!token || handledToken === token || isVerifyingToken) {
      return;
    }

    setHandledToken(token);
    void verifyEmailToken(token);
  }, [handledToken, isVerifyingToken, token, verifyEmailToken]);

  const handleRequestLink = handleSubmit(async (values) => {
    try {
      await requestEmailVerificationMutation.mutateAsync({
        email: values.email,
      });
    } catch (error) {
      const fieldError = getApiFieldErrors(error).email?.[0];

      if (fieldError) {
        setError('email', {
          message: fieldError,
          type: 'server',
        });
      }
    }
  });

  return (
    <Screen contentClassName="gap-6" scroll>
      <SurfaceCard className="gap-4 bg-accent px-6 py-6">
        <View className="gap-2">
          <AppText className="text-surface/75" variant="eyebrow">
            Email verification
          </AppText>
          <AppText className="text-surface" variant="display">
            Verify your email address
          </AppText>
          <AppText className="text-surface/80">
            Magic-link verification updates the same account you use for OTP
            sign-in.
          </AppText>
        </View>
      </SurfaceCard>

      {user ? (
        <AccountSummaryCard
          description="Use a verified email for account recovery, notifications, and future account workflows."
          user={user}
        />
      ) : null}

      {token ? (
        <SurfaceCard className="gap-4">
          <AppText variant="title">Magic link status</AppText>
          {verifyEmailTokenMutation.isPending ? (
            <AppText className="text-ink-soft">
              We are validating your email verification link now.
            </AppText>
          ) : verifyEmailTokenMutation.isSuccess ? (
            <>
              <AppText className="text-success">
                Email verification completed for{' '}
                {verifyEmailTokenMutation.data.email}.
              </AppText>
              <AppButton
                label={
                  isAuthenticated
                    ? 'Return to your workspace'
                    : 'Go to phone sign in'
                }
                onPress={() =>
                  router.replace(
                    isAuthenticated
                      ? resolveAuthenticatedRoute(activeRole)
                      : routes.authPhone,
                  )
                }
              />
            </>
          ) : verifyEmailTokenMutation.isError ? (
            <>
              <AppText className="text-danger">
                {mapApiErrorToMessage(verifyEmailTokenMutation.error)}
              </AppText>
              <AppButton
                label={
                  isAuthenticated ? 'Request a new link' : 'Open phone sign in'
                }
                onPress={() =>
                  router.replace(
                    isAuthenticated
                      ? routes.authEmailVerify
                      : routes.authPhone,
                  )
                }
                tone="secondary"
              />
            </>
          ) : null}
        </SurfaceCard>
      ) : null}

      {isAuthenticated ? (
        <SurfaceCard className="gap-5">
          <View className="gap-2">
            <AppText variant="title">Send a verification link</AppText>
            <AppText className="text-ink-soft">
              The link will open this app and complete email verification for
              the current account.
            </AppText>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onBlur, onChange, value } }) => (
              <TextField
                autoCapitalize="none"
                autoComplete="email"
                errorMessage={errors.email?.message}
                keyboardType="email-address"
                label="Email address"
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="name@example.com"
                returnKeyType="done"
                textContentType="emailAddress"
                value={value}
              />
            )}
          />

          {requestEmailVerificationMutation.isError ? (
            <SurfaceCard className="rounded-2xl border-danger bg-danger/5 px-4 py-4">
              <AppText className="text-danger" variant="caption">
                {mapApiErrorToMessage(requestEmailVerificationMutation.error)}
              </AppText>
            </SurfaceCard>
          ) : null}

          {requestEmailVerificationMutation.isSuccess ? (
            <SurfaceCard className="rounded-2xl border-success bg-success/5 px-4 py-4">
              <AppText className="text-success" variant="caption">
                Verification link sent to{' '}
                {requestEmailVerificationMutation.data.data.email}.
              </AppText>
            </SurfaceCard>
          ) : null}

          <AppButton
            label="Send verification link"
            loading={requestEmailVerificationMutation.isPending}
            onPress={handleRequestLink}
          />
        </SurfaceCard>
      ) : !token ? (
        <SurfaceCard className="gap-4">
          <AppText variant="title">Sign in required</AppText>
          <AppText className="text-ink-soft">
            Requesting a new verification link requires an authenticated
            account. Sign in with your phone number first.
          </AppText>
          <AppButton
            label="Go to phone sign in"
            onPress={() => router.replace(routes.authPhone)}
          />
        </SurfaceCard>
      ) : null}
    </Screen>
  );
}
