/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { Alert, Image, ImageBackground, StyleSheet, Modal, ActivityIndicator, View, Text, FlatList, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from '../components/Header';
import auth from '@react-native-firebase/auth';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

const HomeScreen = ({ navigation, route }) => {
    const { userID } = route.params;
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState(null);
    const [profile, setProfile] = useState('');
    const [name, setName] = useState('');
    const [profileModal, setProfileModal] = useState(false);
    const [email, setEmail] = useState('');
    const [position, setPosition] = useState('');

    const getAllUsers = () => {
        setLoading(true);
        firestore().collection('users').where('uid', '!=', userID).get()
            .then(userSnapshot => {
                const usersData = userSnapshot.docs.map(docSnap => docSnap.data());
                setUsers(usersData);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                Alert.alert('Error', err.toString());
                console.log(err);
            });
    };

    const getUserProfile = () => {
        setLoading(true);
        firestore().collection('users').where('uid', '==', userID).get()
            .then(userSnapshot => {
                const usersData = userSnapshot.docs.map(docSnap => docSnap.data());
                setProfile(usersData[0].pic);
                setName(usersData[0].name);
                setPosition(usersData[0].position);
                setEmail(usersData[0].email);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                Alert.alert('Error', err.toString());
                console.log(err);
            });
    };

    useEffect(() => {
        getAllUsers();
        getUserProfile();
    }, []);

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.listView} onPress={() => navigation.navigate('Chat', { item, userID, profile })}>
                <Image source={{ uri: item.pic }} style={styles.listImage} resizeMode="contain" />
                <View>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <Text style={styles.emailText}>{item.position}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <ImageBackground source={require('../images/boy.jpg')} style={styles.container}>
            <Header title={name} image={profile} profileView={() => setProfileModal(true)} />
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item.uid}
                style={styles.flatList}
            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={loading}
                onRequestClose={() => {
                    setLoading(!loading);
                }}
            >
                <View style={styles.modalView}>
                    <ActivityIndicator color={'orange'} size="large" />
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={profileModal}
                onRequestClose={() => {
                    setProfileModal(!profileModal);
                }}
            >
                <View style={styles.profileModalContainer}>
                    <View style={styles.imageBorder}>
                        <Image source={{ uri: profile }} style={styles.image} resizeMode="contain" />
                    </View>
                    <Text style={styles.modalName}>{name}</Text>
                    <Text style={styles.modalPosition}>{position}</Text>
                    <Text style={styles.modalEmail}>{email}</Text>

                    <View style={styles.btnView}>
                        <TouchableOpacity style={styles.modalLogout} onPress={() => {
                            setLoading(true);
                            firestore().collection('users').doc(userID).update({ status: firestore.FieldValue.serverTimestamp() })
                                .then(() => {
                                    auth().signOut();
                                    setLoading(false);
                                });
                        }}>
                            <SimpleLineIcons name="logout" size={20} color={'black'} />
                            <Text style={styles.logoutText}>Sign Out</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalCancel} onPress={() => setProfileModal(false)}>
                            <AntDesign name="closecircleo" size={20} color={'black'} />
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        opacity: 0.9,
    },
    logoImmage: {
        height: 200,
        width: '100%',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listView: {
        height: 65,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: '#fcd0b1',
    },
    listImage: {
        height: 60,
        width: 60,
        borderRadius: 30,
        marginHorizontal: 7,
    },
    nameText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black',
    },
    emailText: {
        fontSize: 20,
        color: 'black',
        fontStyle: 'italic',
    },
    flatList: {
        marginTop: 10,
        flex: 1,
    },
    profileModalContainer: {
        flex: 1,
        height: '50%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        opacity: 0.9,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center',
    },
    imageBorder: {
        height: 150,
        width: 150,
        borderRadius: 75,
        borderWidth: 5,
        borderColor: 'orange',
        marginTop: 20,
    },
    image: {
        height: 140,
        width: 140,
        borderRadius: 70,
    },
    modalName: {
        fontSize: 30,
        color: 'black',
        fontWeight: 'bold',
        marginTop: 10,
    },
    modalPosition: {
        fontSize: 25,
        color: 'black',
        fontStyle: 'italic',
    },
    modalEmail: {
        fontSize: 23,
        color: 'black',
    },
    btnView: {
        marginTop: 10,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalLogout: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'tomato',
        margin: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    modalCancel: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'orange',
        margin: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 25,
        paddingVertical: 10,
        color: 'black',
    },
    closeText: {
        fontSize: 25,
        paddingVertical: 10,
        color: 'black',
    },
});

export default HomeScreen;
