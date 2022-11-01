/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Image, ImageBackground, Keyboard, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [next, setNext] = useState(false);
    const [imageLoader, setImageLoader] = useState(false);
    const [loading, setLoading] = useState(false);
    const [position, setPosition] = useState('');
    const [token, setToken] = useState('');

    const nextBtn = () => {
        if (email !== '' && password !== '') {
            setNext(true);
        } else {
            Alert.alert('Info \n', 'Please enter your email and password!');
        }
    };

    const signupBtn = () => {
        if (image !== '' && name !== '' && position !== '') {
            Keyboard.dismiss();
            if (password.length >= 6) {
                setLoading(true);
                auth().createUserWithEmailAndPassword(email, password)
                    .then(res => {
                        firestore().collection('users').doc(res.user.uid).set({
                            name: name,
                            email: res.user.email,
                            uid: res.user.uid,
                            pic: image,
                            position: position,
                            status: 'online',
                            token: token,
                        })
                            .then(() => {
                                setLoading(false);
                                navigation.navigate('Home', { userID: res.user.uid });
                            })
                            .catch(err => {
                                setLoading(false);
                                Alert.alert(err.toString());
                                console.log('Firestore error: ', err);
                            });
                    })
                    .catch(err => {
                        setLoading(false);
                        Alert.alert(err.toString());
                        console.log('Auth error: ', err);
                    });
            } else {
                setLoading(false);
                Alert.alert('Info \n', 'Password should be 6 character!');
            }
        } else {
            Alert.alert('Info \n', 'Please fill all required fields');
        }
    };

    const selectImageBtn = () => {
        try {
            launchImageLibrary({ quality: 0.5 }, imageObj => {
                setImageLoader(true);
                const uploaddTask = storage().ref().child(`/userprofile/${Date.now()}`).putFile(imageObj.assets[0].uri);
                uploaddTask.on('state_changed', () => { },
                    () => {
                        Alert.alert('Error', 'Image upload failed');
                    },
                    () => {
                        uploaddTask.snapshot.ref.getDownloadURL()
                            .then(downloadedURL => {
                                setImage(downloadedURL);
                                setImageLoader(false);
                            });
                    }
                );
            });
        } catch (e) {
            console.log(e);
            setImageLoader(false);
            Alert.alert('Info \n', 'Please select an image!');
        }
    };

    useEffect(() => {
        messaging().getToken().then(tkn => {
            setToken(tkn);
        }).catch(() => Alert.alert('Error getting from token: '));
    }, []);

    return (
        <ImageBackground source={require('../images/boy.jpg')} style={styles.container}>
            {next ? <View style={styles.logoPart}>
                <TouchableOpacity style={styles.imageView} onPress={selectImageBtn}>
                    {imageLoader ? <ActivityIndicator color={'orange'} size="large" /> : image ? <Image source={{
                        uri: image,
                    }} style={styles.logoImaage} resizeMode="contain" /> : <>
                        <AntDesign name="plus" size={80} color={'orange'} />
                        <Text style={styles.selectImageText}>Select Image</Text>
                    </>}
                </TouchableOpacity>
            </View> : <View style={styles.logoPart}>
                <Image source={require('../images/chat.png')} style={styles.logoImage} resizeMode="contain" />
                <Text style={styles.logoText}>SignUp</Text>
            </View>}
            <View style={styles.bodyPart}>
                <View style={styles.bodyCard}>
                    {next ? <>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your name"
                            placeholderTextColor={'gray'}
                            value={name}
                            onChangeText={text => setName(text)}
                            ke
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your job position"
                            placeholderTextColor={'gray'}
                            value={position}
                            onChangeText={text => setPosition(text)}
                            ke
                        />
                    </> : <>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your gmail"
                            placeholderTextColor={'gray'}
                            value={email}
                            onChangeText={text => setEmail(text)}
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor={'gray'}
                            value={password}
                            onChangeText={text => setPassword(text)}
                            secureTextEntry={true}
                        />
                    </>}
                    {next ? <TouchableOpacity disabled={image ? false : true} style={styles.btnView} onPress={next ? signupBtn : nextBtn}>
                        <Text style={styles.btnText}>Signup</Text>
                    </TouchableOpacity> : <TouchableOpacity style={styles.btnView} onPress={next ? signupBtn : nextBtn}>
                        <Text style={styles.btnText}>Next</Text>
                    </TouchableOpacity>}

                    <TouchableOpacity style={styles.signup} onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.signupText}>Already have an account ?</Text>
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
        backgroundColor: '#070724',
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
    imageView: {
        height: 150,
        width: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectImageText: {
        color: 'orange',
    },
    logoImaage: {
        height: 140,
        width: 140,
        borderRadius: 70,
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

export default SignupScreen;
