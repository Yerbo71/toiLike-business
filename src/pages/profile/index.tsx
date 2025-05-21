import React, { useContext } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button, useTheme, Text } from 'react-native-paper';
import { DetailAvatar, DetailRateBlock } from '@/src/shared';
import ProfileSettings from '@/src/pages/profile/components/profileSettings';
import ProfileTechSupport from '@/src/pages/profile/components/profileTechSupport';
import { AuthContext } from '@/src/context/AuthContext';
import ProfileBackgroundImage from '@/src/pages/profile/components/profileBackground/profileBackgroundImage';
import { useI18n } from '@/src/context/LocaleContext';

const ProfilePage = () => {
  const theme = useTheme();
  const { t } = useI18n();
  const { signOut, user } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topSection}>
        <ProfileBackgroundImage initialBackgroundUri={user?.secondaryImage} />

        <View
          style={[
            styles.contentContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <DetailAvatar initialBackgroundUri={user?.avatarImage} />
          <Text variant="titleLarge" style={styles.nameText}>
            {user?.username || t('system.notFound')}
          </Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <DetailRateBlock rating={5} />
        <ProfileSettings />
        <ProfileTechSupport />
        <Button
          mode="outlined"
          textColor={theme.colors.error}
          style={[styles.signOutButton, { borderColor: theme.colors.error }]}
          onPress={signOut}
        >
          {t('system.signOut')}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    position: 'relative',
  },
  contentContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    top: 190,
    width: '100%',
    flexDirection: 'column',
    gap: 10,
    padding: 15,
  },
  nameText: {
    alignSelf: 'center',
    marginTop: 40,
  },
  bottomSection: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 80,
    marginBottom: 50,
  },
  signOutButton: {
    marginHorizontal: 15,
    marginTop: 15,
  },
});

export default ProfilePage;
