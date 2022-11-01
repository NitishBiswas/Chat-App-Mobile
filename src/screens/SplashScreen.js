/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect } from 'react';
import { Image, ImageBackground, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SplashScreen = ({ navigation }) => {

    const getCurrentUser = () => {
        auth().onAuthStateChanged(userExist => {
            if (userExist) {
                firestore().collection('users').doc(userExist.uid).update({ status: 'online' })
                    .then(() => {
                        setTimeout(() => {
                            navigation.replace('Home', { userID: userExist.uid });
                        }, 2000);
                    });
            } else {
                setTimeout(() => {
                    navigation.replace('Login');
                }, 2000);
            }
        });
    };

    useEffect(() => {
        getCurrentUser();
    }, []);

    return (
        <ImageBackground source={require('../images/boy.jpg')} style={styles.container}>
            <Image source={require('../images/chat.png')} style={styles.logoImmage} resizeMode="contain" />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.9,
    },
    logoImmage: {
        height: 200,
        width: '100%',
    },
});

export default SplashScreen;
