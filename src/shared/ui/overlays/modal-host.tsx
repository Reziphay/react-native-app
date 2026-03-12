import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useUiStore } from '@/shared/store/ui-store';
import { AppButton } from '@/shared/ui/primitives/app-button';
import { AppText } from '@/shared/ui/primitives/app-text';
import { SurfaceCard } from '@/shared/ui/primitives/surface-card';

export function ModalHost() {
  const modal = useUiStore((state) => state.modal);
  const confirmModal = useUiStore((state) => state.confirmModal);
  const dismissModal = useUiStore((state) => state.dismissModal);

  return (
    <Modal
      animationType="fade"
      onRequestClose={dismissModal}
      transparent
      visible={modal.visible}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Pressable
          onPress={dismissModal}
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(31, 26, 23, 0.42)',
          }}
        />
        <SurfaceCard className="gap-4">
          <View className="gap-2">
            <AppText variant="title">{modal.title}</AppText>
            {modal.description ? (
              <AppText className="text-ink-soft">{modal.description}</AppText>
            ) : null}
          </View>
          <View className="gap-3">
            <AppButton
              label={modal.confirmLabel ?? 'Confirm'}
              onPress={confirmModal}
            />
            <AppButton
              label={modal.cancelLabel ?? 'Cancel'}
              onPress={dismissModal}
              tone="secondary"
            />
          </View>
        </SurfaceCard>
      </View>
    </Modal>
  );
}
