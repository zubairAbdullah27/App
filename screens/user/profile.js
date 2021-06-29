import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TextInput, Modal, FlatList, Image, StatusBar, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';

import auth from '@react-native-firebase/auth'
import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default function Profile({ navigation, route }) {
    const emailreg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    const [userEmail, setUserEmail] = useState()
    const [userPassword, setUserPassword] = useState()
    const [userId, setUserId] = useState()
    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            setUserId(user.uid)
            setUserEmail(user.email)
        } else {
            navigation.navigate('login')
        }
    }, [])
    const updateNewEmail = () => {
        const user = firebase.auth().currentUser;
        if (user) {
            setUserEmail(user.email)
        }
    }
    /*Toggle button and new value with updated views*/
    const [buttonValue, SetButtonValue] = useState(true)
    const togglerView = () => {
        if (buttonValue == true) {
            return (
                <View style={styles.toggleButtonBackGround}>
                    <GestureRecognizer onSwipeRight={() => { SetButtonValue(!buttonValue) }}>
                        <View
                            style={styles.toggleButtonActiveView}>
                            <Text style={[styles.toggleButtonActiveText, {}]}>Overview</Text>
                        </View>
                    </GestureRecognizer>
                    <TouchableOpacity onPress={() => { SetButtonValue(!buttonValue) }}>
                        <Text style={[styles.toggleButtonActiveText, { marginRight: wp('10') }]}>Edit</Text>
                    </TouchableOpacity>
                </View>
            )

        } else if (buttonValue == false) {
            return (
                <View style={styles.toggleButtonBackGround}>
                    <TouchableOpacity
                        onPress={() => {
                            SetButtonValue(!buttonValue)
                        }}>
                        <Text style={[styles.toggleButtonActiveText, { marginLeft: wp('6') }]}>OverView</Text>
                    </TouchableOpacity>
                    <GestureRecognizer onSwipeLeft={() => { SetButtonValue(!buttonValue) }}>
                        <View style={styles.toggleButtonActiveView}>
                            <Text style={styles.toggleButtonActiveText}>Edit</Text>
                        </View>
                    </GestureRecognizer>
                </View>
            )
        }
    }
    /**************************/
    /*Email Password View*/
    const updatedView = () => {
        if (buttonValue == true) {
            return (
                <View style={{ marginTop: hp(4) }}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>Email</Text>
                        <View style={styles.inputView}>
                            <Text style={styles.input}>{userEmail}</Text>
                        </View>
                    </View>
                    <View style={[styles.inputContainer, { marginTop: hp('4') }]}>
                        <Text style={styles.inputTitle}>Password</Text>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.input}
                                placeholder={'................'}
                                placeholderTextColor={'white'}
                                editable={false}
                            />
                        </View>
                    </View>
                </View>
            )
        } else if (buttonValue == false) {
            return (
                <View style={{ marginTop: hp(4) }}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>Email</Text>
                        <View style={styles.inputView}>
                            <Text style={styles.input}>{userEmail}</Text>
                            <TouchableOpacity
                                onPress={() => { setIsEmailModal(true) }}
                            >
                                <FontAwesome
                                    name='pencil'
                                    size={hp('2.8')}
                                    style={styles.editIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.inputContainer, { marginTop: hp('4') }]}>
                        <Text style={styles.inputTitle}>Password</Text>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.input}
                                placeholder={'................'}
                                placeholderTextColor={'white'}
                                editable={false}
                            />
                            <TouchableOpacity
                                onPress={() => { setIsPasswordModal(true) }}
                            >
                                <FontAwesome
                                    name='pencil'
                                    size={hp('2.8')}
                                    style={styles.editIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('login') }}
                        style={styles.logoutButton}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton}>
                        <Text style={styles.deleteText}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
    /**************************/
    /*update the email with reauthentication*/
    //error during email update error variable
    const [emailUpdatedError, setEmailUpdatedError] = useState(false)
    // reauthenticate user
    const reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }
    const changeEmail = () => {
        reauthenticate(userPassword).then(() => {
            var user = firebase.auth().currentUser;
            user.updateEmail(userNewEmail).then(() => {
                updateNewEmail()
                setIsEmailModal(false)
            }).catch((error) => { });
        }).catch((error) => { setEmailUpdatedError(true) });
    }
    /*email change modal*/
    const [isEmailModal, setIsEmailModal] = useState(false);
    const [userNewEmail, setUserNewEmail] = useState()
    const emailModal = () => {
        return (
            <View style={styles.emailModalView}>
                <Text style={styles.emailModalHeadingText}>Change Email address</Text>
                <View style={[styles.modalInputView, { paddingBottom: hp('1') }]}>
                    <TextInput
                        placeholder={'your password'}
                        onChangeText={(e) => {
                            setEmailUpdatedError(false)
                            setUserPassword(e)
                        }}
                        placeholderTextColor={'#2D0A4B30'}
                        style={styles.modalInput}
                        secureTextEntry={true}
                    />
                    {
                        emailUpdatedError ?
                            <Image
                                source={require('../../assets/icons/other/x.png')}
                                style={styles.errorCrossIcon}
                            /> :
                            null
                    }
                </View>
                {
                    emailUpdatedError ?
                        <Text style={styles.emailErrorText}>Wrong password, try again?</Text>
                        : <Text style={styles.emailErrorText}> </Text>
                }
                <View style={[styles.modalInputView, { paddingTop: hp('2'), paddingBottom: hp('1') }]}>
                    <TextInput
                        placeholder={'your email'}
                        onChangeText={(e) => { setUserNewEmail(e) }}
                        placeholderTextColor={'#2D0A4B30'}
                        style={styles.modalInput}
                    />
                    {
                        (userNewEmail != undefined && userNewEmail.length > 0 && (!userNewEmail.match(emailreg))) ?
                            <Image
                                source={require('../../assets/icons/other/x.png')}
                                style={styles.errorCrossIcon}
                            /> :
                            null
                    }
                </View>
                {
                    (userNewEmail != undefined && userNewEmail.length > 0 && (!userNewEmail.match(emailreg))) ?
                        <Text style={styles.emailErrorText}>Hmm that doesn’t look like an email</Text>
                        : <Text style={styles.emailErrorText}> </Text>
                }
                <View style={[styles.modalButtonView, { paddingVertical: hp('1') }]}>
                    <TouchableOpacity
                        onPress={() => {
                            setEmailUpdatedError(false)
                            setUserNewEmail()
                            setUserPassword()
                            setIsEmailModal(false)
                        }}
                        style={[styles.modalButton, { borderColor: '#2D0A4B', borderWidth: wp('0.3') }]}
                    >
                        <Text style={[styles.modalButtonText, { color: '#2D0A4B' }]}>Cacncel</Text>
                    </TouchableOpacity>
                    {
                        userNewEmail != undefined && userNewEmail.length > 0 && userNewEmail.match(emailreg) && userPassword != undefined && userPassword.length >= 6 ?
                            <TouchableOpacity
                                onPress={() => { changeEmail() }}
                                style={[styles.modalButton, { backgroundColor: '#2D0A4B', borderColor: '#2D0A4B' }]}
                            >
                                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Change Email</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                disabled={true}
                                style={[styles.modalButton, { backgroundColor: '#B6B3BF', borderColor: '#B6B3BF' }]}
                            >
                                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Change Email</Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
    /**************************/
    /*Password modal*/
    //update user passowrd 
    const changePassword = () => {
        reauthenticate(userPassword).then(() => {
            var user = firebase.auth().currentUser;
            user.updatePassword(userNewPassword).then(() => {
                setUserPassword()
                setUserNewPassword()
                setUserConfirmPassword()
                setUserPasswordCorrect(false)
                setIsPasswordModal(false)
            }).catch((error) => { setUserPasswordCorrect(true) });
        }).catch((error) => { setUserPasswordCorrect(true) });
    }



    const [isPasswordModal, setIsPasswordModal] = useState(false)
    const [userNewPassword, setUserNewPassword] = useState()
    const [userConfirmPassword, setUserConfirmPassword] = useState();
    const [userPasswordCorrect, setUserPasswordCorrect] = useState(false)
    const passwordModal = () => {
        return (
            <View style={styles.emailModalView}>
                <Text style={styles.emailModalHeadingText}>Change Password</Text>
                <View style={styles.modalInputView}>
                    <TextInput
                        placeholder={'your current password'}
                        onChangeText={(e) => {
                            setUserPasswordCorrect(false)
                            setUserPassword(e)
                        }}
                        style={styles.modalInput}
                        placeholderTextColor='#2D0A4B30'
                        secureTextEntry={true}
                    />
                    {
                        userPasswordCorrect ?
                            <Image source={require('../../assets/icons/other/x.png')} style={styles.errorCrossIcon} />
                            : null
                    }
                </View>
                {
                    <Text style={styles.emailErrorText}></Text>
                }
                <View style={[styles.modalInputView, { marginTop: hp('3') }]}>
                    <TextInput
                        placeholder={'New password'}
                        onChangeText={(e) => { setUserNewPassword(e) }}
                        style={styles.modalInput}
                        placeholderTextColor='#2D0A4B30'
                        secureTextEntry={true}
                    />
                    {
                        userNewPassword != undefined && userNewPassword.length > 0 && userNewPassword.length < 6 ?
                            <Image source={require('../../assets/icons/other/x.png')} style={styles.errorCrossIcon} />
                            : null

                    }
                </View>
                {
                    userNewPassword != undefined && userNewPassword.length > 0 && userNewPassword.length < 6 ?
                        <Text style={styles.emailErrorText}>6 character minimum, almost there.</Text> :
                        <Text></Text>
                }
                <View style={[styles.modalInputView, { marginTop: hp('3') }]}>
                    <TextInput
                        placeholder={'Confirm new password'}
                        onChangeText={(e) => { setUserConfirmPassword(e) }}
                        style={styles.modalInput}
                        placeholderTextColor='#2D0A4B30'
                        secureTextEntry={true}
                    />
                    {
                        userConfirmPassword != undefined && userConfirmPassword != userNewPassword && userConfirmPassword.length > 0 ?
                            <Image source={require('../../assets/icons/other/x.png')} style={styles.errorCrossIcon} />
                            : null
                    }
                </View>
                {
                    userConfirmPassword != undefined && userConfirmPassword != userNewPassword && userConfirmPassword.length > 0 ?
                        <Text style={styles.emailErrorText}>The new passwords don’t match. Try again.</Text> :
                        <Text style={styles.emailErrorText}></Text>
                }
                <View style={styles.modalButtonView}>
                    <TouchableOpacity
                        onPress={() => {
                            setUserPassword()
                            setUserNewPassword()
                            setUserConfirmPassword()
                            setUserPasswordCorrect(false)
                            setIsPasswordModal(false)
                        }}
                        style={[styles.modalButton, { borderWidth: wp('0.4'), marginRight: wp('2') }]}
                    >
                        <Text style={styles.modalButtonText}>Cacncel</Text>
                    </TouchableOpacity>
                    {
                        (userPassword != undefined && userPassword.length >= 6 && userNewPassword != undefined && userNewPassword.length >= 6 && userNewPassword == userConfirmPassword) ?
                            <TouchableOpacity
                                onPress={() => { changePassword() }}
                                style={[styles.modalButton, { backgroundColor: '#2D0A4B' }]}
                            >
                                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Change password </Text>
                            </TouchableOpacity> :
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#8F839E' }]}
                            >
                                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>Change password </Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
    /**************************/
    return (
        <View style={styles.container}>
            <Modal
                visible={isEmailModal}
                transparent={true}
            >
                <View style={styles.emailModal}>
                    {
                        emailModal()
                    }
                </View>
            </Modal>
            <Modal
                transparent={true}
                visible={isPasswordModal}
            >
                <View style={styles.emailModal}>
                    {
                        passwordModal()
                    }
                </View>
            </Modal>
            <View style={styles.header}>
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
                <Text style={styles.nameText}>Profile</Text>
                <View>
                    {
                        togglerView()
                    }
                </View>
                <View style={{ marginVertical: hp('2') }}>
                    {
                        updatedView()
                    }
                </View>
            </View>
            <StatusBar barStyle='light-content' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#000000'
    },
    header: {
        flex: 1, backgroundColor: '#2D0A4B', justifyContent: 'space-between',
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
        flex: 9, backgroundColor: '#340E56',
    },
    nameText: {
        alignSelf: 'center', marginTop: hp('5'), fontFamily: 'Montserrat-Regular', color: '#FFFFFF70', fontSize: hp('2.8'), fontWeight: '800'
    },
    toggleButtonBackGround: {
        backgroundColor: '#B8A4C7', width: wp('80'), borderRadius: hp('5'), paddingVertical: hp('0.4'), paddingHorizontal: wp('1'), flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', alignSelf: 'center', marginTop: hp('4')
    },
    toggleButtonActiveView: {
        backgroundColor: '#2D0A4B', borderRadius: hp('12'),paddingVertical: hp('1'),width: wp('40'), alignItems: 'center',shadowColor: "#000",shadowOffset:{width: 0,height:hp('1.5'),},shadowOpacity: 0.32,shadowRadius:5.46,elevation:9,
    },
    toggleButtonActiveText: {
        fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontWeight: '600', fontSize: hp('2'),
    },
    inputContainer: {
        backgroundColor: '#432160', marginHorizontal: wp('4'), paddingHorizontal: wp('4'), paddingTop: hp('1.8'), paddingBottom: hp('1.8'),
        borderRadius: hp('3'),
    },
    inputTitle: {
        marginBottom: hp('1'), fontFamily: 'Montserrat-Regular', fontSize: hp('1.9'), fontWeight: '500', color: '#D2EEC7'
    },
    inputView: {
        flexDirection: 'row', alignItems: 'center'
    },
    input: {
        flex: 8, fontSize: hp('2.5'), fontWeight: '800', fontFamily: 'Montserrat-Regular',
        letterSpacing: wp('0.2'), paddingBottom: hp('0.5'), color: '#FFFFFF'
    },
    editIcon: {
        color: '#FFFFFF40', width: wp('8')
    },
    logoutButton: {
        alignSelf: 'center', borderWidth: wp('0.4'), borderColor: '#D2EEC7', paddingVertical: hp('1.9'), paddingHorizontal: wp('14'), borderRadius: hp('15'), marginTop: hp('5')
    },
    logoutButtonText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '600', fontSize: hp('1.8'), color: '#D2EEC7', letterSpacing: wp('0.2'),
    },
    deleteButton: {
        alignSelf: 'center', marginTop: hp('2')
    },
    deleteText: {
        fontFamily: 'Montserrat-Regular', fontSize: hp('1.5'), fontWeight: '600', letterSpacing: wp('0.1'), color: '#FF41B1', textAlign: 'center'
    },
    emailModal: {
        flex: 1, justifyContent: 'center', marginBottom: hp('20'), backgroundColor: '#340E5690',
    },
    emailModalView: {
        alignSelf: 'center', backgroundColor: 'white', paddingHorizontal: wp('10'), paddingVertical: hp('1'), backgroundColor: '#F1FCF0', borderRadius: hp('3'),shadowColor: "#000",shadowOffset:{width: 0,height:hp('1.5'),},shadowOpacity: 0.32,shadowRadius:5.46,elevation:9,
    },
    emailModalHeadingText: {
        fontFamily: 'Montserrat-Regular', fontSize: hp('2'), fontWeight: '700', color: '#2D0A4B', letterSpacing: wp('0.4'), alignSelf: 'center', marginBottom: hp('4'), marginTop: hp('1'),
    },
    modalInputView: {
        borderBottomWidth: wp('0.3'), borderBottomColor: '#2D0A4B', flexDirection: 'row', alignItems: 'center', marginTop: hp('1'), width: wp('70'), alignSelf: 'center', justifyContent: 'space-between'
    },
    modalInput: {
        fontFamily: 'Montserrat-Regular', fontWeight: '600', color: '#2D0A4B', fontSize: hp('2'), paddingBottom: hp('0.5'), letterSpacing: wp('0.2')
    },
    emailErrorText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '400', fontSize: hp('1.4'), color: '#FF41B1', paddingTop: hp('0.2'), textAlign: 'center'
    },
    modalButtonView: {
        marginTop: hp('4'), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', paddingBottom: hp('1.5')
    },
    modalButton: {
        borderWidth: wp('0.1'), paddingVertical: hp('1.5'), paddingHorizontal: wp('2'), alignItems: 'center', borderRadius: hp('15'), marginHorizontal: wp('1')
    },
    modalButtonText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '600', letterSpacing: wp('0.2')
    },
    errorCrossIcon: {
        width: wp('3.5'), height: hp('2.5'), marginHorizontal: wp('4')
    }

})