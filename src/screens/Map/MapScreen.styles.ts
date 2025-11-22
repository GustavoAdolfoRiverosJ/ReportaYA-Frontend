import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    filterContainer: {
        position: 'absolute',
        top: 50,
        left: 10,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    filterButton: {
        flex: 1,
        marginHorizontal: 5,
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: '#a27eff',
    },
    filterButtonText: {
        fontSize: 12,
        color: '#333',
    },
    filterButtonTextActive: {
        color: 'white',
        fontWeight: 'bold',
    },
    legendContainer: {
        position: 'absolute',
        bottom: 20,
        left: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    legendTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
        fontSize: 14,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 5,
    },
    legendText: {
        fontSize: 12,
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -25,
        marginLeft: -25,
    },
    noReportsContainer: {
        position: 'absolute',
        top: 120,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    noReportsText: {
        color: '#666',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterModal: {
        backgroundColor: 'white',
        width: '80%',
        borderRadius: 10,
        padding: 20,
        maxHeight: '80%',
    },
    filterModalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    filterSection: {
        marginBottom: 15,
    },
    filterSectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#666',
    },
    filterOption: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 20,
        marginBottom: 5,
        marginRight: 5,
    },
    filterOptionSelected: {
        backgroundColor: '#a27eff',
        borderColor: '#a27eff',
    },
    filterOptionText: {
        color: '#333',
    },
    filterOptionTextSelected: {
        color: 'white',
    },
    filterActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    applyButton: {
        backgroundColor: '#a27eff',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    applyButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    clearButton: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    clearButtonText: {
        color: '#333',
    },
    filterChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
