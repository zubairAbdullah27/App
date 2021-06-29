import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function TestActiveWelcome({ navigation, route }) {

    useEffect(() => {
        
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text></Text>
                <Text></Text>
                <TouchableOpacity
                    onPress={() => { navigation.navigate('projectwelcome') }}
                    style={styles.headerButton}>
                    <Image
                        source={require('../../assets/icons/other/back.png')}
                        style={styles.backIcon}
                    />
                    <Text style={styles.headerButtonText}>Back to projects</Text>
                </TouchableOpacity>
                <Text></Text>
            </View>
            <View style={styles.body}>
                <View style={{ alignSelf: 'center' }}>
                    <Text style={styles.testNameText}>{route.params.testData.name}</Text>
                    <Text style={styles.onboardingText}>Testing onboarding</Text>
                </View>
                <TouchableOpacity
                onPress={()=>{navigation.navigate('passDevice',{projectName:route.params.projectName,testData:route.params.testData})}}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Start Test</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>

            </View>
            <StatusBar barStyle='light-content' />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flex: 2, backgroundColor: '#2D0A4B'
    },
    headerButton: {
        flexDirection: 'row', marginVertical: hp('2'), alignItems: 'center', marginHorizontal: wp('5'), paddingVertical: hp('2')
    },
    backIcon: {
        width: wp('3'), height: hp('2')
    },
    headerButtonText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '600', color: '#F1FCF0', letterSpacing: wp('0.25'), marginLeft: wp('3'), fontSize: hp('1.7')
    },
    body: {
        flex: 10, backgroundColor: '#340E56', justifyContent: 'space-evenly', alignItems: 'center'
    },
    testNameText: {
        fontFamily: 'Montserrat-Regular', color: '#F1FCF0', fontWeight: '800', fontSize: hp('2.5'), textAlign: 'center', paddingBottom: hp('0.5'),letterSpacing:wp('0.2')
    },
    onboardingText: {
        fontFamily: 'Montserrat-Regular', color: '#F1FCF0', fontWeight: '500', fontSize: hp('2'), textAlign: 'center', paddingTop: hp('1'),letterSpacing:wp('0.4')
    },
    button: {
        backgroundColor: '#A1D1AF', paddingHorizontal: wp('4'), paddingVertical: hp('1'), borderRadius: hp('15'), alignSelf: 'center'
    },
    buttonText: {
        fontFamily: 'Montserrat-Regular', color: '#FFFFFF',fontWeight:'600' ,paddingVertical:hp('0.8'),paddingHorizontal:wp('2'),fontSize:hp('2')
    },
    footer: {
        flex: 5, backgroundColor: '#340E56'
    }
})