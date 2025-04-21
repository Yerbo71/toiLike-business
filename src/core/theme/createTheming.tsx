import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from 'react-native-paper';
import { Colors } from '@/src/constants/Colors';
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import merge from 'deepmerge';

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: Colors.dark,
  roundness: 2,
};

const customLightTheme = {
  ...MD3LightTheme,
  colors: Colors.light,
  roundness: 2,
};

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export const CombinedDefaultTheme = merge(LightTheme, customLightTheme);
export const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);
