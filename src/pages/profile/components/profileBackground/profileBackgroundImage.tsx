import React, { useState, useContext } from 'react';
import { Image } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { postUploadBackgroundUser } from '@/src/core/rest/user/postUploadBackgroundUser';
import { AuthContext } from '@/src/context/AuthContext';
import { getCurrentUser } from '@/src/core/rest/user/getCurrentUser';

interface ProfileBackgroundImageProps {
  initialBackgroundUri?: string;
}

const ProfileBackgroundImage: React.FC<ProfileBackgroundImageProps> = ({
  initialBackgroundUri,
}) => {
  const { token } = useContext(AuthContext);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(
    initialBackgroundUri || null,
  );

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access gallery denied');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const fileUri = result.assets[0].uri;
      setBackgroundImage(fileUri);
      if (token) {
        try {
          await postUploadBackgroundUser(token, fileUri);
          console.log('Image uploaded successfully!');
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      }
    } else {
      console.log('User cancelled image picker');
    }
  };

  return (
    <>
      <Image
        source={{
          uri: backgroundImage
            ? `${backgroundImage}?${new Date().getTime()}`
            : 'https://picsum.photos/701',
        }}
        style={{ width: '100%', height: 200 }}
        resizeMode="cover"
      />
      <IconButton
        icon="pencil"
        onPress={handleChoosePhoto}
        style={{
          position: 'absolute',
          right: 10,
          top: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          zIndex: 100,
        }}
      />
    </>
  );
};

export default ProfileBackgroundImage;
