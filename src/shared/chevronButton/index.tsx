import React, { FC, useState } from 'react';
import { Icon, Switch, Text, useTheme } from 'react-native-paper';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';

interface Props {
  leftIcon: string;
  leftTitle: string;
  rightIcon?: string;
  rightTitle?: string;
  onPress?: () => void;
  isToggled?: boolean;
}

const styles = StyleSheet.create({
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});

export const ChevronButton: FC<Props> = ({
  leftIcon,
  leftTitle,
  rightIcon,
  rightTitle,
  onPress,
  isToggled,
}) => {
  const colorScheme = useColorScheme();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const theme = useTheme();

  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: colorScheme === 'dark' ? '#838383' : '#777777',
        borderRadius: 12,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.side}>
        <Icon size={20} source={leftIcon} />
        <Text variant="bodyMedium">{leftTitle}</Text>
      </View>
      {isToggled ? (
        <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
      ) : (
        <View style={styles.side}>
          <Text variant="bodyMedium">{rightTitle}</Text>
          <Icon size={20} source={rightIcon} color={theme.colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};
