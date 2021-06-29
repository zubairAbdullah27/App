import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Image, SafeAreaView, ImageBackground, StatusBar } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth'
import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';

var helperTextColorEmail = '#F1FCF080';
var helperTextColorPassowrd = '#F1FCF080';
export default function Login({ navigation }) {

    /*change colors and show icons on button press*/
    const [emailWrong, setEmailWrong] = useState(false)
    const [passwordWrong, setPasswordWrong] = useState(false)

    const [email, setEmail] = useState();
    const [password, setPassword] = useState()
    const emailreg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    /*email Validator*/
    const emailValidator = () => {
        if (email != undefined && email.length > 0) {
            if (email.match(emailreg)) {
                return (
                    <Text style={[styles.notCorrectHelperText,{color:helperTextColorEmail}]}></Text>
                )
            } else {
                return (
                    <Text style={[styles.notCorrectHelperText,{color:helperTextColorEmail}]}>Hmmm, please double check that email?</Text>
                )
            }
        } else {

            return (
                <Text style={[styles.notCorrectHelperText,{color:helperTextColorEmail}]}></Text>
            )
        }
    }
    /****/
    /*Password Validator*/
    const passwordValidator = () => {
        if (password != undefined && password.length > 0) {
            if (password.length >= 6) {
                return (
                    <Text style={[styles.notCorrectHelperText,{color:helperTextColorPassowrd}]}></Text>
                )
            } else if (password.length == 5) {
                return (
                    <Text style={[styles.notCorrectHelperText,{color:helperTextColorPassowrd}]}>1 more character, you got this </Text>
                )
            }
            else {
                return (
                    <Text style={[styles.notCorrectHelperText,{color:helperTextColorPassowrd}]}>6 Characters at a minimum, please</Text>
                )
            }
        } else {
            return (
                <Text style={styles.notCorrectHelperText}></Text>
            )
        }
    }
    /*Signup*/
    const sigup = () => {
        if (email != undefined && email.match(emailreg)) {
            if (password != undefined && password.length >= 6) {
                auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        navigation.navigate('projectwelcome')
                    })
                    .catch(error => {
                        helperTextColorEmail = '#FF41B1'
                        setEmailWrong(true)
                    });
            }
            else {
                helperTextColorPassowrd = '#FF41B1';
                setPasswordWrong(true)
            }
        } else {
            helperTextColorEmail = '#FF41B1'
            setEmailWrong(true)
        }
    }
    /****/
    /*Login*/
    const login = () => {

        if (email != undefined && email.match(emailreg)) {
            if (password != undefined && password.length >= 6) {
                auth()
                    .signInWithEmailAndPassword(email, password)
                    .then(() => {
                        navigation.navigate('projectwelcome')
                    })
                    .catch(error => {
                        helperTextColorEmail = '#FF41B1'
                        setEmailWrong(true)
                    });
            }
            else {
                helperTextColorPassowrd = '#FF41B1'
                setPasswordWrong(true)
            }
        } else {
            helperTextColorEmail = '#FF41B1'
            setEmailWrong(true)
        }
    }
    /***/
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.header}>
                <ImageBackground
                    source={require('../../assets/icons/login/uxtimerlogo.png')}
                    style={styles.backgroundLogo}
                    imageStyle={{ width: wp('100') }}
                >
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.logoText}>Welcome</Text>
                        <Text style={styles.logoText}>to UX Timer</Text>
                    </View>
                </ImageBackground>
            </View>
            <View style={styles.body}>
                <View style={styles.inputContainer}>
                    <Text style={styles.inputTitle}>Email</Text>
                    <View style={styles.inputView}>
                        <TextInput
                            placeholder='enter email'
                            placeholderTextColor={'#F1FCF050'}
                            style={styles.input}
                            onChangeText={(e) => {
                                helperTextColorEmail = '#F1FCF080';
                                setEmailWrong(false)
                                setEmail(e)
                            }}
                        />
                        {
                            emailWrong ?
                                <Image
                                    source={require('../../assets/icons/other/x.png')}
                                    style={styles.xIcon}
                                /> :
                                null
                        }
                    </View>
                    {emailValidator()}
                </View>
                <View style={[styles.inputContainer, { marginTop: hp('2') }]}>
                    <Text style={styles.inputTitle}>Password</Text>
                    <View style={styles.inputView}>
                        <TextInput
                            placeholder='enter password'
                            placeholderTextColor={'#F1FCF050'}
                            style={styles.input}
                            secureTextEntry={true}
                            onChangeText={(e) => {
                                helperTextColorPassowrd = '#F1FCF080';
                                setPasswordWrong(false)
                                setPassword(e)
                            }}
                        />
                        {
                            passwordWrong ?
                                <Image
                                    source={require('../../assets/icons/other/x.png')}
                                    style={styles.xIcon}
                                /> :
                                null
                        }
                    </View>
                    {passwordValidator()}
                </View>

                <View style={styles.buttonView}>
                    <TouchableOpacity
                        onPress={() => { login() }}
                        style={[styles.button, { borderColor: '#D2EEC7' }]}
                    >
                        <Text style={[styles.buttonText, { color: '#D2EEC7' }]}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { sigup() }}
                        style={[styles.button, { backgroundColor: '#D2EEC7' }]}
                    >
                        <Text style={[styles.buttonText, { color: '#432160' }]}>Signup</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.termconditionButton}>
                    <Text style={styles.termConditionText}>Terms and conditions</Text>
                </TouchableOpacity>
            </View>
            <StatusBar barStyle='light-content' />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1, backgroundColor: '#340E56'
    },
    header: {
        flex: 1
    },
    backgroundLogo: {
        width: wp('100'), height: wp('100'), justifyContent: 'center', alignSelf: 'center'
    },
    headerTextContainer: {
        alignSelf: 'center',marginBottom:hp('10')
    },
    logoText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '800',
        fontSize: hp('4'), textAlign: 'center', color: '#F1FCF0', alignSelf:'center'
    },
    body: {
        flex: 1.4
    },
    inputContainer: {
        backgroundColor: '#432160', marginHorizontal: wp('4'), paddingHorizontal: wp('4'), paddingTop: hp('1.8'), paddingBottom: hp('1'),
        borderRadius: hp('3'),
    },
    inputTitle: {
        marginBottom: hp('1'), fontFamily: 'Montserrat-Regular', fontSize: hp('1.9'), fontWeight: '500', color: '#D2EEC7'
    },
    inputView: {
        borderBottomWidth: wp('0.2'), borderBottomColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center'
    },
    input: {
        flex: 8, fontSize: hp('2'), fontWeight: '800', fontFamily: 'Montserrat-Regular',
        letterSpacing: wp('0.2'), paddingBottom: hp('0.5'), color: '#FFFFFF'
    },
    xIcon: {
        marginVertical: hp('1'), height: hp('2'), flex: 1,
    },
    notCorrectHelperText: {
        marginTop: hp('0.6'), fontFamily: 'Montserrat-Regular', fontWeight: '400', fontSize: hp('1.6')
    },
    buttonView: {
        flexDirection: 'row', justifyContent: 'space-evenly', marginTop: hp('2.5')
    },
    button: {
        borderWidth: wp('0.35'), borderRadius: hp('15'), width: wp('38'), alignItems: 'center'
    },
    buttonText: {
        paddingVertical: hp('1.8'), fontSize: hp('2'), fontFamily: 'Montserrat-Regular', fontWeight: '800', letterSpacing: wp('0.4')
    },
    termconditionButton: {
        alignItems: 'center', marginTop: hp('1.8')
    },
    termConditionText: {
        color: '#F1FCF0', fontFamily: 'Montserrat-Regular', fontWeight: '500', letterSpacing: wp('0.2')
    }

})