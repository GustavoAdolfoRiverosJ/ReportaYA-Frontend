// src/styles/ReportScreen.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1, // Changed to flexGrow to allow scrolling
    padding: 20,
  },
  header: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a27eff',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  optionContainer: {
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#e0d0ff',
    borderColor: '#a27eff',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  locationContainer: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  locationButton: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  locationButtonText: {
    color: 'white',
  },
  locationText: {
    fontSize: 12,
    color: '#555',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 16,
  },
  photoButton: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  photoButtonText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#a27eff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  // Modal Styles
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});