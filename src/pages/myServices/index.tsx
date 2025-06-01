import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useI18n } from '@/src/context/LocaleContext';
import { MyVendorsList } from '@/src/pages/myServices/blocks/myVendorsList/myVendorsList';
import { MyPlaceList } from '@/src/pages/myServices/blocks/myPlaceList/myPlaceList';
import { VendorsApplications } from '@/src/pages/myServices/blocks/vendorApplications/vendorsApplications';
import { ConfirmedApplications } from '@/src/pages/myServices/blocks/confirmedApplications/confirmApplications';
import { RejectedApplications } from '@/src/pages/myServices/blocks/rejectedApplications/rejectedApplications';

const MyServicesPage = () => {
  const theme = useTheme();
  const { t } = useI18n();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'vendors', title: t('system.myVendors') },
    { key: 'places', title: t('system.myPlaces') },
    { key: 'vendorApplications', title: t('system.applicationsFromClients') },
    {
      key: 'vendorConfirmedApplications',
      title: t('system.applicationsConfirmed'),
    },
    {
      key: 'vendorRejectedApplications',
      title: t('system.applicationsRejected'),
    },
  ]);

  const renderScene = SceneMap({
    vendors: MyVendorsList,
    places: MyPlaceList,
    vendorApplications: VendorsApplications,
    vendorConfirmedApplications: ConfirmedApplications,
    vendorRejectedApplications: RejectedApplications,
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
            scrollEnabled={true}
            tabStyle={styles.tabStyle}
            indicatorStyle={{ backgroundColor: theme.colors.primary }}
            style={{ backgroundColor: theme.colors.background }}
            activeColor={theme.colors.primary}
            inactiveColor={theme.colors.onSurfaceVariant}
            contentContainerStyle={styles.tabBarContent}
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
  tabStyle: {
    width: 'auto',
    paddingHorizontal: 10,
  },
  tabBarContent: {
    alignItems: 'flex-start',
  },
});

export default MyServicesPage;
