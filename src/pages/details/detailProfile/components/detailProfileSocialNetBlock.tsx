import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const DetailProfileSocialNetBlock = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    >
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
        }}
      >
        <Button
          mode="contained"
          icon="instagram"
          style={{ backgroundColor: '#E1306C' }}
        >
          Instagram
        </Button>
        <Button
          mode="contained"
          icon="whatsapp"
          style={{ backgroundColor: '#25D366' }}
        >
          WhatsApp
        </Button>
        <Button
          mode="contained"
          icon={() => <FontAwesome5 name="telegram" size={18} color="white" />}
          style={{ backgroundColor: '#0088CC' }}
        >
          Telegram
        </Button>
        <Button mode="outlined" icon="share">
          Shared
        </Button>
      </View>
    </ScrollView>
  );
};

export default DetailProfileSocialNetBlock;
