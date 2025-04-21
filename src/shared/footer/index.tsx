import React from 'react';
import { Tabs } from 'expo-router';
import {
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { View } from 'react-native';
import { FAB, useTheme } from 'react-native-paper';
import { useModal } from '@/src/hooks/useModal';
import FooterMenuModal from '@/src/shared/footer/components/footerMenuModal';
import { useI18n } from '@/src/context/LocaleContext';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const Footer = () => {
  const { open, close, modalOpen } = useModal();
  const { t } = useI18n();
  const theme = useTheme();

  const fabGradientColors: [string, string] = [
    theme.dark ? 'rgb(186, 0, 86)' : 'rgb(240, 64, 129)',
    theme.dark ? 'rgb(129, 16, 113)' : 'rgb(186, 57, 147)',
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            borderTopWidth: 0,
            height: 65,
            paddingBottom: 8,
            paddingTop: 8,
            backgroundColor: theme.dark
              ? theme.colors.elevation.level2
              : theme.colors.surface,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 10,
          },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.dark
            ? theme.colors.onSurfaceVariant
            : theme.colors.outline,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
          tabBarHideOnKeyboard: true,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('system.home'),
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? styles.activeIconContainer : null}>
                <Feather name="home" size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="myApplications/index"
          options={{
            title: t('system.applications'),
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? styles.activeIconContainer : null}>
                <Entypo name="text-document" size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="empty/index"
          options={{
            title: t('system.order'),
            tabBarIcon: () => (
              <View style={styles.fabContainer}>
                <LinearGradient
                  colors={fabGradientColors}
                  style={styles.fabGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FAB
                    icon="plus"
                    color="white"
                    style={styles.fab}
                    onPress={open}
                    size="medium"
                  />
                </LinearGradient>
              </View>
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              open();
            },
          }}
        />
        <Tabs.Screen
          name="chats/index"
          options={{
            title: t('system.chats'),
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? styles.activeIconContainer : null}>
                <Ionicons name="chatbubbles-outline" size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile/index"
          options={{
            title: t('system.profile'),
            tabBarIcon: ({ color, focused }) => (
              <View style={focused ? styles.activeIconContainer : null}>
                <MaterialCommunityIcons
                  name="account"
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="details/[id]"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
      {modalOpen && <FooterMenuModal close={close} />}
    </>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  fabGradient: {
    marginBottom: 35,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fab: {
    margin: 0,
    elevation: 0,
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
  },
  activeIconContainer: {
    backgroundColor: 'rgba(240, 64, 129, 0.12)',
    borderRadius: 10,
    padding: 6,
    width: 35,
    height: 35,
  },
});
