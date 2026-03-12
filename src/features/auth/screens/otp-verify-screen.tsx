import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

import { useRequestOtpMutation } from '@/features/auth/hooks/use-request-otp-mutation';
import { useVerifyOtpMutation } from '@/features/auth/hooks/use-verify-otp-mutation';
import { resolveAuthenticatedRoute } from '@/features/auth/lib/auth-routing';
import { formatPhoneNumberPreview } from '@/features/auth/lib/phone';
import { useAuthFlowStore } from '@/features/auth/store/auth-flow-store';
import { getApiFieldErrors, mapApiErrorToMessage } from '@/shared/api/errors';
import { useCountdown } from '@/shared/hooks/use-countdown';
import { routes } from '@/shared/constants/routes';
import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { Screen } from '@/shared/ui/primitives/screen';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';
import { TextField } from '@/shared/ui/primitives/text-field';

const otpSchema = z.object({
  code: z
    .string()
    .min(4, 'Enter the full code.')
    .max(8, 'Enter the full code.'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

export function OtpVerifyScreen() {
  const router = useRouter();
  const otpFlow = useAuthFlowStore((state) => state.otpFlow);
  const clearOtpFlow = useAuthFlowStore((state) => state.clearOtpFlow);
  const requestOtpMutation = useRequestOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const resendCountdown = useCountdown(otpFlow?.resendAvailableAt);
  const expiryCountdown = useCountdown(otpFlow?.expiresAt);
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<OtpFormValues>({
    defaultValues: {
      code: '',
    },
    resolver: zodResolver(otpSchema),
  });

  if (!otpFlow) {
    return <Redirect href={routes.authPhone} />;
  }

  const activeOtpFlow = otpFlow;

  const handleVerifyCode = handleSubmit(async (values) => {
    try {
      const result = await verifyOtpMutation.mutateAsync({
        code: values.code.trim(),
        otpFlow: activeOtpFlow,
      });

      router.replace(resolveAuthenticatedRoute(result.data.user.activeRole));
    } catch (error) {
      const fieldError =
        getApiFieldErrors(error).code?.[0] ||
        getApiFieldErrors(error).otpCode?.[0];

      if (fieldError) {
        setError('code', {
          message: fieldError,
          type: 'server',
        });
      }
    }
  });

  async function handleResendCode() {
    try {
      await requestOtpMutation.mutateAsync({
        phoneNumber: activeOtpFlow.phoneNumber,
        roleHint: activeOtpFlow.roleHint,
      });
    } catch {
      // Inline and toast handling is already driven by the mutation layer.
    }
  }

  return (
    <Screen contentClassName="gap-6" scroll>
      <SurfaceCard className="gap-4 bg-accent px-6 py-6">
        <View className="gap-2">
          <AppText className="text-surface/75" variant="eyebrow">
            Verify code
          </AppText>
          <AppText className="text-surface" variant="display">
            Enter the one-time code
          </AppText>
          <AppText className="text-surface/80">
            We sent a code to {formatPhoneNumberPreview(otpFlow.phoneNumber)}.
          </AppText>
        </View>
      </SurfaceCard>

      <SurfaceCard className="gap-5">
        <Controller
          control={control}
          name="code"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextField
              autoComplete="sms-otp"
              autoFocus
              errorMessage={errors.code?.message}
              helperText={`This code expires in ${expiryCountdown.label}.`}
              inputClassName="text-center text-[28px] tracking-[10px]"
              keyboardType="number-pad"
              label="One-time code"
              maxLength={8}
              onBlur={onBlur}
              onChangeText={(nextValue) =>
                onChange(nextValue.replace(/[^\d]/g, ''))
              }
              placeholder="123456"
              returnKeyType="done"
              textContentType="oneTimeCode"
              value={value}
            />
          )}
        />

        {verifyOtpMutation.isError ? (
          <SurfaceCard className="rounded-2xl border-danger bg-danger/5 px-4 py-4">
            <AppText className="text-danger" variant="caption">
              {mapApiErrorToMessage(verifyOtpMutation.error)}
            </AppText>
          </SurfaceCard>
        ) : null}

        <View className="gap-3 rounded-2xl bg-canvas px-4 py-4">
          <AppText variant="label">Need another code?</AppText>
          <AppText className="text-ink-soft">
            {resendCountdown.isComplete
              ? 'You can request a fresh code now.'
              : `You can request another code in ${resendCountdown.label}.`}
          </AppText>
          <AppButton
            disabled={!resendCountdown.isComplete}
            label="Resend code"
            loading={requestOtpMutation.isPending}
          onPress={handleResendCode}
            tone="secondary"
          />
        </View>

        <AppButton
          label="Verify and continue"
          loading={verifyOtpMutation.isPending}
          onPress={handleVerifyCode}
        />
        <AppButton
          label="Use a different phone number"
          onPress={() => {
            clearOtpFlow();
            router.replace(routes.authPhone);
          }}
          tone="ghost"
        />
      </SurfaceCard>
    </Screen>
  );
}
