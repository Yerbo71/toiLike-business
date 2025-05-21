import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useContext } from 'react';
import { AuthContext } from '@/src/context/AuthContext';
import { getCurrentUser, postUploadAvatarUser } from '@/src/core/rest/user';

interface ProfileAvatarImageProps {
  initialBackgroundUri?: string;
}

export const DetailAvatar: React.FC<ProfileAvatarImageProps> = ({
  initialBackgroundUri,
}) => {
  const { token, updateUser } = useContext(AuthContext);
  const theme = useTheme();
  const [avatarUri, setAvatarUri] = useState<string | null>(
    initialBackgroundUri || null,
  );

  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const fileUri = result.assets[0].uri;
      setAvatarUri(fileUri);
      if (token) {
        try {
          await postUploadAvatarUser(token, fileUri);
          const updatedUser = await getCurrentUser(token);
          updateUser(updatedUser);
        } catch (error) {
          console.error('Failed to upload avatar:', error);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: theme.colors.primary,
          borderRadius: 100,
          padding: 3,
        }}
      >
        <Avatar.Image
          source={{
            uri: avatarUri
              ? `${avatarUri}?${new Date().getTime()}`
              : 'https://picsum.photos/701',
          }}
          size={100}
        />
      </View>

      <TouchableOpacity
        onPress={handleChoosePhoto}
        style={styles.cameraButton}
        activeOpacity={0.7}
      >
        <Avatar.Icon
          icon="camera"
          size={28}
          style={[styles.cameraIcon, { backgroundColor: theme.colors.primary }]}
          color="white"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cameraIcon: {
    shadowColor: 'transparent',
    elevation: 0,
  },
});

export default DetailAvatar;
