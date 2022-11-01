/* eslint-disable prettier/prettier */
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function Header({ title, image, back, profileView, status }) {
    return (
        <View style={styles.headderView}>
            <View style={styles.leftHeader}>
                {back && <AntDesign name="arrowleft" color={'white'} size={25} style={styles.backBtn} onPress={back} />}
                {image ? profileView ? <TouchableOpacity onPress={profileView}>
                    <Image source={{ uri: image }} style={styles.profileImage} />
                </TouchableOpacity> : <Image source={{ uri: image }} style={styles.profileImage} /> : null}
                <View>
                    <Text style={styles.headerText}>{title}</Text>
                    {status && <Text style={styles.activeStatus}>{typeof (status) === 'string' ? status : status.toDate().toString()}</Text>}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headderView: {
        height: 50,
        width: '100%',
        backgroundColor: 'orange',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    headerText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    },
    logoutIcon: {
        height: 25,
        width: 25,
        borderRadius: 13,
    },
    leftHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    backBtn: {
        marginRight: 10,
    },
    activeStatus: {
        color: 'black',
    },
});
