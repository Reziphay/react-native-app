import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';

import { useRequestOtpMutation } from '@/features/auth/hooks/use-request-otp-mutation';
import {
  formatPhoneNumberPreview,
  isValidPhoneNumber,
} from '@/features/auth/lib/phone';
import { useAuthFlowStore } from '@/features/auth/store/auth-flow-store';
import { getApiFieldErrors, mapApiErrorToMessage } from '@/shared/api/errors';
import { routes } from '@/shared/constants/routes';
import { UserRole } from '@/shared/enums/domain';
import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { Screen } from '@/shared/ui/primitives/screen';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';
import { TextField } from '@/shared/ui/primitives/text-field';

const phoneAuthSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required.')
    .refine(isValidPhoneNumber, 'Enter a valid phone number.'),
});

type PhoneAuthFormValues = z.infer<typeof phoneAuthSchema>;

const roleCopy: Record<
  UserRole,
  {
    description: string;
    label: string;
    title: string;
  }
> = {
  [UserRole.CUSTOMER]: {
    description:
      'Use your phone number to request a one-time code for the customer experience.',
    label: 'Customer',
    title: 'Continue as a customer',
  },
  [UserRole.SERVICE_OWNER]: {
    description:
      'Use your phone number to request a one-time code for the service owner workspace.',
    label: 'Service owner',
    title: 'Continue as a service owner',
  },
};

interface PhoneAuthScreenProps {
  roleHint?: UserRole;
}

export function PhoneAuthScreen({ roleHint }: PhoneAuthScreenProps) {
  const router = useRouter();
  const requestOtpMutation = useRequestOtpMutation();
  const clearOtpFlow = useAuthFlowStore((state) => state.clearOtpFlow);
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
    watch,
  } = useForm<PhoneAuthFormValues>({
    defaultValues: {
      phoneNumber: '',
    },
    resolver: zodResolver(phoneAuthSchema),
  });
  const phonePreview = formatPhoneNumberPreview(watch('phoneNumber'));
  const selectedRole = roleHint ?? UserRole.CUSTOMER;

  const handleRequestCode = handleSubmit(async (values) => {
    clearOtpFlow();

    try {
      await requestOtpMutation.mutateAsync({
        phoneNumber: values.phoneNumber,
        roleHint: selectedRole,
      });

      router.push(routes.authOtp);
    } catch (error) {
      const fieldError = getApiFieldErrors(error).phoneNumber?.[0];

      if (fieldError) {
        setError('phoneNumber', {
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
            Sign in
          </AppText>
          <AppText className="text-surface" variant="display">
            {roleCopy[selectedRole].title}
          </AppText>
          <AppText className="text-surface/80">
            {roleCopy[selectedRole].description}
          </AppText>
        </View>
      </SurfaceCard>

      <SurfaceCard className="gap-5">
        <View className="gap-3">
          <AppText variant="title">Choose the account context</AppText>
          <View className="flex-row gap-3">
            <AppButton
              className="flex-1"
              label={roleCopy[UserRole.CUSTOMER].label}
              onPress={() =>
                router.replace({
                  params: {
                    roleHint: UserRole.CUSTOMER,
                  },
                  pathname: routes.authPhone,
                })
              }
              tone={
                selectedRole === UserRole.CUSTOMER ? 'primary' : 'secondary'
              }
            />
            <AppButton
              className="flex-1"
              label={roleCopy[UserRole.SERVICE_OWNER].label}
              onPress={() =>
                router.replace({
                  params: {
                    roleHint: UserRole.SERVICE_OWNER,
                  },
                  pathname: routes.authPhone,
                })
              }
              tone={
                selectedRole === UserRole.SERVICE_OWNER
                  ? 'primary'
                  : 'secondary'
              }
            />
          </View>
        </View>

        <Controller
          control={control}
          name="phoneNumber"
          render={({ field: { onBlur, onChange, value } }) => (
            <TextField
              autoComplete="tel"
              errorMessage={errors.phoneNumber?.message}
              helperText={
                phonePreview
                  ? `The code will be sent to ${phonePreview}.`
                  : 'Include country code, for example +994501234567.'
              }
              keyboardType="phone-pad"
              label="Phone number"
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="+994501234567"
              returnKeyType="done"
              textContentType="telephoneNumber"
              value={value}
            />
          )}
        />

        {requestOtpMutation.isError ? (
          <SurfaceCard className="rounded-2xl border-danger bg-danger/5 px-4 py-4">
            <AppText className="text-danger" variant="caption">
              {mapApiErrorToMessage(requestOtpMutation.error)}
            </AppText>
          </SurfaceCard>
        ) : null}

        <AppButton
          label="Request code"
          loading={requestOtpMutation.isPending}
          onPress={handleRequestCode}
        />
        <AppButton
          label="Back to onboarding"
          onPress={() => router.replace(routes.publicWelcome)}
          tone="ghost"
        />
      </SurfaceCard>
    </Screen>
  );
}
