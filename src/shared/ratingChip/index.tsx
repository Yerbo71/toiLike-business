import React, { FC } from 'react';
import { useTheme, Text } from 'react-native-paper';
import AntDesign from '@expo/vector-icons/AntDesign';
import { View, StyleSheet } from 'react-native';

interface Props {
  rating: number;
  size?: 'small' | 'medium' | 'large';
}

export const RatingChip: FC<Props> = ({ rating, size = 'medium' }) => {
  const theme = useTheme();
  const roundedRating = Math.round(rating * 10) / 10; // Округляем до 1 знака после запятой

  const getColor = () => {
    if (rating >= 4.5) return '#4CAF50'; // Зеленый для высоких оценок
    if (rating >= 3.5) return '#FFC107'; // Желтый для средних оценок
    if (rating >= 2.5) return '#FF9800'; // Оранжевый
    return '#F44336'; // Красный для низких оценок
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          iconSize: 12,
          textSize: 12,
          paddingH: 6,
          paddingV: 2,
          borderRadius: 4,
        };
      case 'large':
        return {
          iconSize: 18,
          textSize: 16,
          paddingH: 10,
          paddingV: 4,
          borderRadius: 8,
        };
      default: // medium
        return {
          iconSize: 15,
          textSize: 14,
          paddingH: 8,
          paddingV: 3,
          borderRadius: 6,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getColor(),
          paddingHorizontal: sizeStyles.paddingH,
          paddingVertical: sizeStyles.paddingV,
          borderRadius: sizeStyles.borderRadius,
        },
      ]}
    >
      <AntDesign
        name="star"
        size={sizeStyles.iconSize}
        color="#FFFFFF"
        style={styles.icon}
      />
      <Text
        variant="bodyMedium"
        style={[
          styles.text,
          {
            fontSize: sizeStyles.textSize,
            color: '#FFFFFF',
          },
        ]}
      >
        {roundedRating}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 3,
  },
  text: {
    fontWeight: '600',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
