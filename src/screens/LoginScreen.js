/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Image, ImageBackground, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');

    const loginBtn = () => {
        if (email !== '' && password !== '') {
            Keyboard.dismiss();
            setLoading(true);
            auth().signInWithEmailAndPassword(email, password)
                .then(res => {
                    firestore().collection('users').doc(res.user.uid).update({ status: 'online', token: token })
                        .then(() => {
                            setLoading(false);
                            navigation.navigate('Home', { userID: res.user.uid });
                        });
                })
                .catch(err => {
                    Alert.alert('Error \n', err.toString());
                    setLoading(false);
                    console.log('Auth error: ', err);
                });
        } else {
            setLoading(false);
            Alert.alert('Info \n', 'Please enter your email and password!');
        }
    };

    useEffect(() => {
        messaging().getToken().then(tkn => {
            setToken(tkn);
        }).catch(() => Alert.alert('Error getting from token: '));
    }, []);

    return (
        <ImageBackground source={require('../images/boy.jpg')} style={styles.container}>
            <View style={styles.logoPart}>
                <Image source={require('../images/chat.png')} style={styles.logoImage} resizeMode="contain" />
                <Text style={styles.logoText}>Login</Text>
            </View>
            <View style={styles.bodyPart}>
                <View style={styles.bodyCard}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your gmail"
                        placeholderTextColor={'gray'}
                        keyboardType="email-address"
                        onChangeText={text => setEmail(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor={'gray'}
                        secureTextEntry={true}
                        onChangeText={text => setPassword(text)}
                    />
                    <TouchableOpacity style={styles.btnView} onPress={loginBtn}>
                        <Text style={styles.btnText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.signup} onPress={() => navigation.navigate('Signup')}>
                        <Text style={styles.signupText}>Don't have an account ?</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logoPart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bodyPart: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        height: 150,
        width: '100%',
    },
    bodyCard: {
        flex: 1,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        opacity: 0.8,
        overflow: 'hidden',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        backgroundColor: '#000',
        borderColor: 'orange',
        borderWidth: 2,
        color: 'white',
        fontSize: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginVertical: 10,
    },
    btnView: {
        width: '80%',
        backgroundColor: '#000',
        borderColor: 'orange',
        borderWidth: 2,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        fontSize: 23,
        color: 'orange',
        paddingVertical: 8,
    },
    signupText: {
        fontSize: 20,
        color: 'orange',
        fontWeight: 'bold',
    },
    logoText: {
        fontSize: 25,
        marginTop: 10,
        color: 'orange',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoginScreen;
