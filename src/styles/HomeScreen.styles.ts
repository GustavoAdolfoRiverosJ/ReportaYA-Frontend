// src/styles/HomeScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: '90%',
  },
  headerLeft: {
    flex: 1,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a27eff',
  },
  userName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#a27eff', // Color sólido para contraste
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    fontSize: 14,
    color: '#a27eff',
    textDecorationLine: 'underline',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a27eff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  paginationButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
  paginationButtonText: {
    color: 'white',
    fontSize: 14,
    marginHorizontal: 5,
  },
  paginationButtonTextDisabled: {
    color: '#ccc',
  },
  paginationText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
});
