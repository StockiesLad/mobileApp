import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Image,
    ScrollView, Modal, TextInput
} from 'react-native';
import { SearchBar } from '@rneui/themed';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';

export default function StaffDirectoryScreen({ navigation }) {
    useFocusEffect(
        React.useCallback(() => {
            refreshStaffList();
        }, [])
    );

    useEffect(() => {
        api.get('/staff')
            .then(response => {
                setStaffData(response.data);
            })
            .catch(error => {
                console.error('Error fetching staff data:', error);
            });

        api.get('department')
            .then(res => setDepartments(res.data))
            .catch(err => console.error('Error fetching departments:', err));

    }, []);

    const [search, setSearch] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [department, setDepartment] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [departments, setDepartments] = useState([]);
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('');
    const [staffData, setStaffData] = useState([]);


    const filteredStaff = staffData.filter((staff) =>
        staff.name.toLowerCase().includes(search.toLowerCase()) ||
        staff.department.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddStaff = () => {
        if (!name || !phone || !department || !street || !city || !state || !zip || !country) {
            alert('Please fill all required fields');
            return;
        }

        const departmentId = departments.find(dep => dep.name === department)?.id;

        if (!departmentId) {
            alert('Invalid department selected');
            return;
        }

        const newStaff = {
            name,
            phone,
            departmentId,
            street,
            city,
            state,
            zip,
            country,
        };

        api.post('staff', newStaff)
            .then(res => {
                console.log('Staff saved:', res.data);
                setModalVisible(false);
                refreshStaffList();

                setName('');
                setPhone('');
                setDepartment('');
                setStreet('');
                setCity('');
                setState('');
                setZip('');
                setCountry('');
            })
            .catch(err => {
                console.error('Error saving staff:', err);
                alert('Failed to add staff');
            });
    };

    const refreshStaffList = () => {
        api.get('staff')
            .then(res => setStaffData(res.data))
            .catch(err => console.error('Error refreshing staff:', err));
    };

    return (
        <View style={styles.container}>
            {/* Top Section */}
            <View>
                <Text style={styles.header}>Staff Directory</Text>

                <SearchBar
                    platform="android"
                    containerStyle={styles.searchBarContainer}
                    inputStyle={{ fontFamily: "Trebuc MS", fontSize: 16, color: "#000" }}
                    placeholder="Search Anything..."
                    placeholderTextColor="#888"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Main Content */}
            <ScrollView>
                {filteredStaff.map((staff) => (
                    <TouchableOpacity key={staff.id} onPress={() => navigation.navigate('Profile', { staff })}>
                        <View style={styles.card}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../assets/icons/user.png')} style={styles.profileIcon} />
                                <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                    <Text style={styles.staffName}>{staff.name}</Text>
                                    <Text style={styles.staffDept}>{staff.department.name}</Text>
                                </View>
                            </View>
                            <Image source={require('../assets/icons/arrow.png')} style={{ width: 20, height: 20, marginLeft: 10 }} />
                        </View>
                    </TouchableOpacity>
                ))}

                {filteredStaff.length === 0 && (
                    <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
                        No matching staff found.
                    </Text>
                )}
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.addButtonText}>+ Add Staff</Text>
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Add New Staff</Text>

                            <TextInput placeholder="Full Name" placeholderTextColor={"#595959"} value={name} onChangeText={setName} style={styles.input} />
                            <TextInput placeholder="Phone Number" placeholderTextColor={"#595959"} value={phone} onChangeText={setPhone} style={styles.input} />
                            <TextInput placeholder="Department" placeholderTextColor={"#595959"} value={department} onChangeText={setDepartment} style={styles.input} />
                            <TextInput placeholder="Street Address" placeholderTextColor={"#595959"} value={street} onChangeText={setStreet} style={styles.input} />
                            <TextInput placeholder="City" placeholderTextColor={"#595959"} value={city} onChangeText={setCity} style={styles.input} />
                            <TextInput placeholder="State" placeholderTextColor={"#595959"} value={state} onChangeText={setState} style={styles.input} />
                            <TextInput placeholder="ZIP Code" placeholderTextColor={"#595959"} value={zip} onChangeText={setZip} style={styles.input} />
                            <TextInput placeholder="Country" placeholderTextColor={"#595959"} value={country} onChangeText={setCountry} style={styles.input} />

                            <TouchableOpacity style={styles.saveButton} onPress={handleAddStaff}>
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        fontSize: 28,
        color: '#941A1D',
        fontFamily: "Trebuc Bold"
    },

    searchBarContainer: {
        backgroundColor: '#d9d9d9',
        borderRadius: 25,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    card: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 10,
        paddingHorizontal: 20,
        height: 80,
        backgroundColor: '#d9d9d9',
        borderRadius: 25
    },

    profileIcon: {
        width: 50,
        height: 50,
    },

    staffName: {
        fontFamily: "Trebuc MS",
        fontSize: 20,
        marginLeft: 10,
    },
    staffDept: {
        fontFamily: "Trebuc MS",
        fontSize: 12,
        marginLeft: 10,
        color: "#595959"
    },
    addButton: {
        backgroundColor: '#941A1D',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        alignSelf: 'center',
    },

    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Trebuc MS',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Trebuc MS',
        color: '#941A1D'
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        fontFamily: 'Trebuc MS',
    },

    saveButton: {
        backgroundColor: '#941A1D',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
    },

    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Trebuc MS',
    },

    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 8,
        zIndex: 10,
    },

    closeButtonText: {
        fontSize: 20,
        color: '#941A1D',
        fontWeight: 'bold',
    },
    picker: {
        backgroundColor: '#eee',
        marginVertical: 10,
        borderRadius: 8,
    }

});