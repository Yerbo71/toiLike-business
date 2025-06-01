import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Button,
  Text,
  TextInput,
  Card,
  useTheme,
  Title,
} from 'react-native-paper';
import { useI18n } from '@/src/context/LocaleContext';
import { AuthContext } from '@/src/context/AuthContext';
import { postAddCache } from '@/src/core/rest/user';
import { getCurrentUser } from '@/src/core/rest/user';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

const AddCachePage = () => {
  const { t } = useI18n();
  const theme = useTheme();
  const { token, user, updateUser } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const quickAmounts = [10000, 15000, 20000, 50000];

  const handleAddCache = async () => {
    if (!amount || isNaN(Number(amount))) {
      Toast.show({
        type: 'error',
        text1: t('addCache.invalidAmount'),
      });
      return;
    }
    try {
      setLoading(true);
      await postAddCache(amount);
      if (token) {
        const updatedUser = await getCurrentUser(token);
        updateUser(updatedUser);
      }
      Toast.show({
        type: 'success',
        text1: t('addCache.successTitle'),
        text2: t('addCache.successMessage'),
      });
      setAmount('');
      setSelectedAmount(null);
      router.push('/(protected)/(application)/profile');
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || t('addCache.errorMessage');

      Toast.show({
        type: 'error',
        text1: t('addCache.errorTitle'),
        text2: errorMessage,
      });

      console.log('add Cache error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (value: number) => {
    setAmount(value.toString());
    setSelectedAmount(value);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.title, { color: theme.colors.onSurface }]}>
            {t('addCache.title')}
          </Title>

          <Text style={[styles.balance, { color: theme.colors.primary }]}>
            {t('addCache.currentBalance')}: {user?.cache || 0} KZT
          </Text>

          <View style={styles.quickAmountContainer}>
            {quickAmounts.map((value) => (
              <Button
                key={value}
                mode={selectedAmount === value ? 'contained' : 'outlined'}
                style={styles.quickButton}
                onPress={() => handleQuickSelect(value)}
                theme={{
                  colors: {
                    primary: theme.colors.primary,
                    surface: theme.colors.surface,
                  },
                }}
              >
                {value} KZT
              </Button>
            ))}
          </View>

          <TextInput
            label={t('addCache.amountLabel')}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            theme={{ colors: { primary: theme.colors.primary }, roundness: 10 }}
            right={<TextInput.Affix text="KZT" />}
          />

          <Button
            mode="contained"
            onPress={handleAddCache}
            loading={loading}
            disabled={loading || !amount}
            style={styles.button}
            theme={{ colors: { primary: theme.colors.primary } }}
          >
            {t('addCache.addButton')}
          </Button>

          <Text style={[styles.note, { color: theme.colors.onSurfaceVariant }]}>
            {t('addCache.note')}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 22,
  },
  balance: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickButton: {
    marginBottom: 12,
    width: '48%',
  },
  input: {
    marginBottom: 24,
  },
  button: {
    marginTop: 8,
    paddingVertical: 6,
  },
  note: {
    marginTop: 24,
    textAlign: 'center',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default AddCachePage;
