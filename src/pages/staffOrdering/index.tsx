import React, { useState } from 'react';
import { View, Image, StyleSheet, Animated, ScrollView } from 'react-native';
import { Button, Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';
import { LinearGradient } from 'expo-linear-gradient';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';

const StaffOrderingPage = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  const handleOrder = () => {
    setIsLoading(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.05,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => {
      setIsLoading(false);
      setOrderSuccess(true);
      Toast.show({
        type: 'success',
        text1: t('staffOrderingPage.successTitle'),
        text2: t('staffOrderingPage.successMessage'),
      });
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }, 2000);
  };

  const serviceItems = [
    {
      icon: 'account-group',
      text: t('staffOrderingPage.orderItems1'),
    },
    {
      icon: 'magnify',
      text: t('staffOrderingPage.orderItems2'),
    },
    {
      icon: 'microphone-variant',
      text: t('staffOrderingPage.orderItems3'),
    },
    {
      icon: 'lightbulb-on-outline',
      text: t('staffOrderingPage.orderItems4'),
    },
  ];

  return (
    <ScrollView>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={styles.container}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {orderSuccess && (
            <View style={styles.successOverlay}>
              <Icon
                name="check-circle"
                size={80}
                color={theme.colors.primary}
              />
              <Text variant="headlineMedium" style={styles.successText}>
                {t('staffOrderingPage.successTitle')}
              </Text>
            </View>
          )}
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Image
            source={require('@/assets/eventImages/Event_1.jpg')}
            style={styles.headerImage}
            resizeMode="cover"
          />
        </Animated.View>

        <View style={styles.content}>
          <Text variant="displaySmall" style={styles.title}>
            {t('staffOrderingPage.title')}
          </Text>
          <Text variant="bodyLarge" style={styles.description}>
            {t('staffOrderingPage.description')}
          </Text>

          <View style={styles.servicesContainer}>
            {serviceItems.map((item, index) => (
              <View key={index} style={styles.serviceItem}>
                <Icon
                  name={item.icon}
                  size={24}
                  color={theme.colors.primary}
                  style={styles.icon}
                />
                <Text variant="titleMedium" style={styles.serviceText}>
                  {item.text}
                </Text>
              </View>
            ))}
          </View>

          <Button
            mode="contained"
            onPress={handleOrder}
            style={styles.orderButton}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator
                animating={true}
                color={theme.colors.onPrimary}
              />
            ) : (
              t('staffOrderingPage.orderNow')
            )}
          </Button>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginTop: 15,
  },
  content: {
    marginTop: 25,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
  },
  servicesContainer: {
    marginTop: 20,
    gap: 15,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 15,
    borderRadius: 10,
  },
  icon: {
    marginRight: 15,
  },
  serviceText: {
    flex: 1,
  },
  orderButton: {
    marginTop: 40,
    borderRadius: 10,
    elevation: 3,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  successText: {
    marginTop: 20,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default StaffOrderingPage;
