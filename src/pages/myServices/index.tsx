import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useI18n } from '@/src/context/LocaleContext';
import { MyVendorsList } from '@/src/pages/myServices/blocks/myVendorsList/myVendorsList';
import { MyPlaceList } from '@/src/pages/myServices/blocks/myPlaceList/myPlaceList';

const MyServicesPage = () => {
  const theme = useTheme();
  const { t } = useI18n();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'vendors', title: t('system.myVendors') },
    { key: 'places', title: t('system.myPlaces') },
  ]);

  const renderScene = SceneMap({
    vendors: MyVendorsList,
    places: MyPlaceList,
  });

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{ backgroundColor: theme.colors.background }}
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.onSurfaceVariant}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyServicesPage;