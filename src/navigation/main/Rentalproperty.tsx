import React from "react";
import { SafeAreaView, StyleSheet, Text, View, Image } from "react-native"
import { LinearGradient } from 'expo-linear-gradient';
import Octicons from "@expo/vector-icons/build/Octicons";
import Svg, { Ellipse } from 'react-native-svg';
export function Rentalproperty() {
    return(
        <SafeAreaView style={styles.container}>
            <LinearGradient
        // Colors array (required)
                 colors={['#9BD0FF','#0046C9']}
                style={styles.rental}
              >
                <Svg height="200" width="300" style={styles.svg}>
                    <Ellipse
                    cx="260"
                    cy="50"
                    rx="80"
                    ry="80"
                    fill="#FFFFFF26"
                    strokeWidth="1"
                    />
                    <Ellipse
                    cx="260"
                    cy="50"
                    rx="50"
                    ry="60"
                    fill="#FFFFFF4D"
                    strokeWidth="1"
                    />
                    <Ellipse
                    cx="260"
                    cy="50"
                    rx="20"
                    ry="30"
                    fill="#FFFFFF73"
                    strokeWidth="1"
                    />
                </Svg>
                <View style={styles.content}>
                    <View>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>Rental Property</Text>
                    </View>
                    <View style={styles.context}>
                    <View style={styles.combine}>
                    <View>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20,}}>10</Text>
                        <Text style={{color: 'white'}}>Properties</Text>
                    </View>
                    <View>
                        <Text style={{color: 'white',fontWeight: 'bold', fontSize: 20,}}>7</Text>
                        <Text style={{color: 'white'}}>Leased</Text>
                    </View>
                    </View>
                    <View style={styles.arrow}>
                        <Octicons name="arrow-right" size={24} color="black" />
                    </View>
                    </View>
                </View>
                <View style={styles.image}>
                    <Image source={require('../../../assets/Property.png')} />
                </View>
            </LinearGradient>
        </SafeAreaView>
        
    )
}

const styles = StyleSheet.create({
    container: {


    },

    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: 40,
        width: '100%',
    },
    context: {
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    combine: {
        display: 'flex',
        flexDirection: 'row', 
        gap: 20,
    },
    change:{
        color:'white',
    },
    rental: {
        borderRadius: 15,
        padding: 20,
        height: 140,
        width: '100%',
        position: 'absolute',
    },
    arrow:{
        position: 'absolute',
        right: 0,
        zIndex: 100,
        backgroundColor: '#faf6f6',
        borderRadius: 50,
        padding: 5,
        bottom: -6,
    },
    svg: {
        position: 'absolute',
        
    },
    image: {
        position: 'absolute',
        right: 0,
        top: -18,
    }
})