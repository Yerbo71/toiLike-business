import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: -35,
    height: 60,
    width: 60,
    overflow: 'hidden',
  },
  fab: {
    elevation: 0,
    boxShadow: 'none',
    backgroundColor: 'rgb(0, 95, 175)',
  },
});
