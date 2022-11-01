/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import Header from '../components/Header';
import { GiftedChat } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';

const ChatScreen = ({ navigation, route }) => {

    const { item, userID, profile } = route.params;

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const docID = item.uid > userID ? userID + '-' + item.uid : item.uid + '-' + userID;
        const messageRef = firestore().collection('chatrooms').doc(docID).collection('messages').orderBy('createdAt', 'desc');

        const unSubscribe = messageRef.onSnapshot(querySnapshot => {
            const allMsg = querySnapshot.docs.map(docSnap => {
                if (docSnap.data().createdAt) {
                    return {
                        ...docSnap.data(),
                        createdAt: docSnap.data().createdAt.toDate(),
                    };
                } else {
                    return {
                        ...docSnap.data(),
                        createdAt: new Date(),
                    };
                }
            });
            setMessages(allMsg);
        });

        return () => {
            unSubscribe();
        };
    }, [messages]);

    const onSend = messageArray => {
        const msg = messageArray[0];
        const myMsg = {
            ...msg,
            sentBy: userID,
            sentTo: item.uid,
            createdAt: new Date(),
            user: {
                _id: userID,
                avatar: profile,
            },
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg));

        const docID = item.uid > userID ? userID + '-' + item.uid : item.uid + '-' + userID;
        firestore().collection('chatrooms').doc(docID).collection('messages').add({ ...myMsg, createdAt: firestore.FieldValue.serverTimestamp() });
    };

    return (
        <ImageBackground source={require('../images/boy.jpg')} style={styles.container}>
            <Header title={item.name} image={item.pic} back={() => navigation.goBack()} status={item.status} />
            <GiftedChat
                textInputProps={{ color: 'orange', fontWeight: 'bold', fontSize: 18 }}
                messages={messages}
                onSend={msg => onSend(msg)}
                user={{
                    _id: userID,
                }}
            />
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
});

export default ChatScreen;
