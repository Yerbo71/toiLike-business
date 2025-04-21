import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, useTheme, Text } from 'react-native-paper';
import { DetailAvatar, DetailRateBlock } from '@/src/shared';
import ProfileSettings from '@/src/pages/profile/components/profileSettings';
import ProfileTechSupport from '@/src/pages/profile/components/profileTechSupport';
import { AuthContext } from '@/src/context/AuthContext';
import ProfileBackgroundImage from '@/src/pages/profile/components/profileBackground/profileBackgroundImage';

const ProfilePage = () => {
  const theme = useTheme();
  const { signOut, user } = useContext(AuthContext);
  return (
    <ScrollView>
      <View style={{ position: 'relative' }}>
        <ProfileBackgroundImage initialBackgroundUri={user?.secondaryImage} />
        <View
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: theme.colors.surface,
            position: 'absolute',
            top: 190,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            padding: 15,
          }}
        >
          <DetailAvatar initialBackgroundUri={user?.avatarImage} />
          <Text
            variant="titleLarge"
            style={{ alignSelf: 'center', marginTop: 40 }}
          >
            {user?.username || 'Name is not defined'}
          </Text>
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          marginTop: 80,
          marginBottom: 50,
        }}
      >
        <DetailRateBlock rating={5} />
        <ProfileSettings />
        <ProfileTechSupport />
        <Button
          mode="outlined"
          textColor={theme.colors.error}
          style={{
            borderColor: theme.colors.error,
            marginLeft: 10,
            marginRight: 10,
            marginTop: 10,
          }}
          onPress={() => signOut()}
        >
          Sign out
        </Button>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;
