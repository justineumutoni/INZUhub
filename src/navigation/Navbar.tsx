import React from 'react'
import { NavbarProps } from '../types/navbar'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, InputAccessoryView, Button } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons';


export function Navbar() {
    const [LoggedIn, setLoggedIn] = React.useState(false);
    const [notificationCount, setNotificationCount] = React.useState(0);
    const NavbarContent: NavbarProps = {
        notificationText: "3",
        imageUrl: "",
        name: "John Doe"
    }
    return (
        <SafeAreaView style={{display: 'flex', flexDirection: 'column', gap: 30}}>
        <View style={styles.navbar}>
            <Text style={styles.text}>Room Finder</Text>
            <View style={styles.searchProperty}>
                <Text style={styles.searchText}>Fint a property anywhere.</Text>
                <ScrollView keyboardDismissMode="interactive">
                <TextInput
                    style={styles.textInput}
                    inputAccessoryViewID={inputAccessoryViewID}
                    onChangeText={setText}
                    value={text}
                    placeholder={'Please type here…'}
                />
                </ScrollView>
                 <InputAccessoryView nativeID={inputAccessoryViewID}>
                    <Button onPress={() => setText(initialText)} title="Clear text" />
                </InputAccessoryView>
               </View>
        </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    navbar: {
        backgroundColor: '#2C56C0',
        height: 212,
        borderRadius: 20,
    },
    text: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FDFDFD',
        paddingVertical: 61,
    },
    navbarNotification: {
        position: 'relative',
    },
    notificationText: {
        position: 'absolute',
        top: -3,
        left: 20,
        fontSize: 17,
        fontWeight: 'bold',
        backgroundColor: '#f8c12a',
        width: 25,
        height: 25,
        borderRadius: 15,
        padding: 1,
        textAlign: 'center',
        color: 'white',
    },
    navbarIcon:{
        fontWeight: 'bold',
    }
})