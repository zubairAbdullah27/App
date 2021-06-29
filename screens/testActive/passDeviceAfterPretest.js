import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function PassDeviceAfterPreTest({ navigation, route }) {

    useEffect(() => {
        
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text></Text>
                <Text></Text>
                <TouchableOpacity
                    onPress={() => { navigation.goBack() }}
                    style={styles.headerButton}>
                    <Image
                        source={require('../../assets/icons/other/back.png')}
                        style={styles.backIcon}
                    />
                    <Text style={styles.headerButtonText}>Back</Text>
                </TouchableOpacity>
                <Text></Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.bodyText}>Give the phone back to your tester, please.</Text>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => { navigation.navigate('taskRecord', { projectName: route.params.projectName, testData: route.params.testData, userName: route.params.userName, answer: route.params.answer }) }}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
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
        flex: 13, backgroundColor: '#340E56', alignItems: 'center'
    },
    bodyText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '800', color: '#F1FCF0', fontSize: hp('3.5'), letterSpacing: wp('0.4'), lineHeight: hp('5'), marginTop: hp('5'), width: wp('70'), alignSelf: 'flex-start', marginHorizontal: wp('5')
    },
    footer: {
        flex: 2.5, backgroundColor: '#340E56'
    },
    button: {
        alignSelf: 'center', paddingHorizontal: wp('10'), paddingVertical: hp('1.5'), borderWidth: wp('0.3'), borderRadius: hp('5'), borderColor: '#D2EEC7', marginBottom: hp('1')
    },
    buttonText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '600', color: '#D2EEC7', fontSize: hp('2'), letterSpacing: wp('0.2')
    }
})