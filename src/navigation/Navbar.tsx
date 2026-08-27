import React, { useState } from 'react'
import { NavbarProps } from '../types/navbar'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, InputAccessoryView, Button, Pressable, Alert } from 'react-native'
import { Feather, Ionicons } from '@expo/vector-icons';

export function Navbar() {
    const [text, setText] = useState('');
    return (
        <SafeAreaView style={{display: 'flex', flexDirection: 'column', gap: 30}}>
        <View style={styles.navbar}>
            <View>
                 <Text style={styles.text}>Room Finder</Text>
            </View>
            <Text style={styles.text}>Room Finder</Text>
            <View style={styles.searchProperty}>
                <Text style={styles.searchText}>Fint a property anywhere.</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={setText}
                    value={text}
                    placeholder={'Search address or near you…'}
                />
                <Pressable 
                onPress={() => Alert.alert('Button Pressed!')}
                // You can pass an array to conditionally apply styles when pressed
                style={styles.button}
                >
                <Text style={styles.buttonText}>Search Now</Text>
                </Pressable>
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    text: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FDFDFD',
        paddingVertical: 50,
        zIndex: 1,
    },
    textInput: {
    padding: 10,
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
    },
    searchProperty: {
        backgroundColor: '#FFFFFF',
        width: 313,
        height: 196,
        padding: 20,
        borderRadius: 10,
        gap: 20,
        boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)',
    },
searchText: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 179,
},
button: {
    backgroundColor: '#2C56C0',
    borderRadius: 5,
    padding: 15,
    marginTop: 7,
},
buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
}
})