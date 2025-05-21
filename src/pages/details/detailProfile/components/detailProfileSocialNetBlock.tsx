import React from 'react';
import { ScrollView, View, Linking } from 'react-native';
import { Button } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface SocialMediaItem {
  url: string;
  socialMediaType: 'WHATS_UP' | 'TELEGRAM' | 'INSTAGRAM' | string;
}

interface DetailProfileSocialNetBlockProps {
  socialMedia?: SocialMediaItem[];
}

const DetailProfileSocialNetBlock: React.FC<
  DetailProfileSocialNetBlockProps
> = ({ socialMedia = [] }) => {
  const handlePress = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error('Failed to open URL:', err),
    );
  };

  const getButtonProps = (type: string) => {
    switch (type) {
      case 'WHATS_UP':
        return {
          icon: 'whatsapp',
          color: '#25D366',
          label: 'WhatsApp',
        };
      case 'TELEGRAM':
        return {
          icon: () => <FontAwesome5 name="telegram" size={18} color="white" />,
          color: '#0088CC',
          label: 'Telegram',
        };
      case 'INSTAGRAM':
        return {
          icon: 'instagram',
          color: '#E1306C',
          label: 'Instagram',
        };
      default:
        return {
          icon: 'share',
          color: '#666',
          label: 'Share',
        };
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    >
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {socialMedia.map((item, index) => {
          const { icon, color, label } = getButtonProps(item.socialMediaType);
          return (
            <Button
              key={`social-${index}`}
              mode="contained"
              icon={icon}
              style={{ backgroundColor: color }}
              onPress={() => handlePress(item.url.trim())}
            >
              {label}
            </Button>
          );
        })}

        <Button
          mode="outlined"
          icon="share"
          onPress={() => console.log('Share pressed')}
        >
          Share
        </Button>
      </View>
    </ScrollView>
  );
};

export default DetailProfileSocialNetBlock;
