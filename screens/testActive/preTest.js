import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity, Image, StatusBar, FlatList, Modal, ScrollView } from 'react-native';
import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { back } from 'react-native/Libraries/Animated/Easing';


export default function PreTest({ navigation, route }) {

    const preTest = route.params.testData.preTest
    const [userId, setUserId] = useState()
    const [name, setName] = useState()
    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            setUserId(user.uid)
        } else {
            navigation.navigate('login')
        }
    }, [])
    const [reRender, setreRender] = useState(false)
    const [answer, setAnswers] = useState([])
    //render mcq option
    const renderMcqOption = (item, index, questionIndex) => {
        if (index === answer[questionIndex]) {
            return (
                <View style={styles.mcqView}>
                    <TouchableOpacity style={styles.mcqActiveButton}>
                    </TouchableOpacity>
                    <Text style={styles.mcqText}>{item}</Text>
                </View>
            )
        } else {
            return (

                <TouchableOpacity
                    style={styles.mcqView}
                    onPress={() => {
                        let newArr = answer
                        newArr[questionIndex] = index
                        setAnswers(newArr)
                        setreRender(!reRender)
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            let newArr = answer
                            newArr[questionIndex] = index
                            setAnswers(newArr)
                            setreRender(!reRender)
                        }}
                        style={styles.mcqButton}></TouchableOpacity>
                    <Text style={styles.mcqText}>{item}</Text>
                </TouchableOpacity>
            )
        }
    }
    /*Pre Test Question*/
    const renderTest = (item, quesitonIndex) => {
        if (item.type == 'mcq') {
            return (
                <View style={styles.questionView}>
                    <Text style={styles.questionTitleText}>{item.title}</Text>
                    <FlatList
                        data={item.options}
                        extraData={reRender != reRender}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({ item, index }) => (
                            renderMcqOption(item, index, quesitonIndex)
                        )}
                    />
                </View>
            )
        } else if (item.type == 'input') {
            return (
                <View style={styles.questionView}>
                    <Text style={styles.questionTitleText}>{item.title}</Text>
                    <TextInput
                        placeholder={item.placeholder}
                        style={styles.input}
                        placeholderTextColor={'#D2EEC7'}
                        onChangeText={(e) => {
                            if (e != undefined && e.length == 0) {
                                answer[quesitonIndex] = undefined
                            } else {
                                answer[quesitonIndex] = e
                            }
                        }}
                    />
                </View>
            )
        } else if (item.type == 'permission') {
            return (
                <View style={styles.questionView}>
                    <Text style={styles.questionTitleText}>{item.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TextInput
                            placeholder={item.permissionExplainText}
                            editable={false}
                            placeholderTextColor={'#D2EEC7'}
                            style={styles.permissionExplainText}
                        />
                        <TouchableOpacity
                            style={{ marginLeft: wp('2') }}
                            onPress={() => {
                                setModalQuestionIndex(quesitonIndex)
                                setIsModal(true)

                            }}
                        >
                            <Image source={require('../../assets/icons/other/navigate-next.png')} style={[styles.backIcon, { marginLeft: wp('5') }]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    /*******************/
    /*permission modal*/
    const [isModal, setIsModal] = useState(false)
    const [modalQuestionIndex, setModalQuestionIndex] = useState()
    const permisionModal = () => {
        if (modalQuestionIndex != undefined) {
            return (
                <View style={{ flex: 1, }}>
                    <View style={[styles.header, { flex: 1.7 }]}>
                        <SafeAreaView style={{ justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', marginHorizontal: wp('5'), }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalQuestionIndex()
                                    setIsModal(false)
                                }}
                            >
                                <Image
                                    source={require('../../assets/icons/other/back.png')}
                                    style={styles.backIcon}
                                />
                            </TouchableOpacity>
                            <Text style={{ fontFamily: 'Montserrat-Regular', fontWeight: '800', color: '#B8A4C7' }}>View form</Text>
                            <Text></Text>
                        </SafeAreaView>
                    </View>
                    <View style={styles.body}>
                        <Text style={{ fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontWeight: '800', fontSize: hp('3'), marginHorizontal: wp('5'), marginTop: hp('2'), marginBottom: hp('1'), lineHeight: hp('4'), letterSpacing: wp('0.2') }}>{preTest[modalQuestionIndex].title}</Text>
                        <View style={{ marginBottom: hp('2'), marginHorizontal: wp('5'), borderBottomWidth: wp('0.2'), paddingBottom: hp('2'), borderBottomColor: '#754B85' }}>
                            <Text style={{ fontFamily: 'Montserrat-Regular', color: '#B8A4C7', fontWeight: '500', fontSize: hp('2.2'), letterSpacing: wp('0.2') }}>{preTest[modalQuestionIndex].permissionExplainText}</Text>
                        </View>
                        <ScrollView style={{ marginHorizontal: wp('8'), backgroundColor: '#754B85', borderRadius: hp('2') }}>
                            <Text style={{ fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontSize: hp('2'), paddingHorizontal: wp('1.8'), paddingVertical: hp('1.5'), letterSpacing: wp('0.2'), lineHeight: hp('3'), textAlign: 'left' }}></Text>
                        </ScrollView>
                        <View style={{ marginVertical: hp('2'), marginHorizontal: wp('15') }}>
                            <Text style={{ fontFamily: 'Montserrat-Regular', color: '#D2EEC7', fontSize: hp('2.5'), fontWeight: '800', letterSpacing: wp('0.2') }}>Participant eletronic signature</Text>
                            <TextInput
                                placeholder={'Your Full Name'}
                                style={[styles.input, { marginVertical: hp('1'), fontSize: hp('2'), }]}
                                placeholderTextColor={'#D2EEC770'}
                                onChangeText={(e) => {
                                    if (e != undefined && e.length > 0) {
                                        answer[modalQuestionIndex] = e

                                    } else {
                                        answer[modalQuestionIndex] = undefined
                                    }
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity
                            onPress={() => {
                                setModalQuestionIndex()
                                setIsModal(false)
                            }}
                            style={styles.button}
                        >
                            <Text></Text>
                            <Text style={styles.buttonText}>Submit</Text>
                            <Image source={require('../../assets/icons/other/navigate-next.png')} style={[styles.backIcon, { marginLeft: wp('5') }]}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    /*save handler*/
    const saveHandler = () => {
        let answerSaved = [];
        for (let i = 0; i < preTest.length; i++) {
            if (preTest[i].type == 'mcq') {
                if (answer[i] == undefined) {
                    answerSaved[i] = undefined
                } else {
                    let option = preTest[i].options[answer[i]]
                    answerSaved[i] = option
                }
            } else {
                answerSaved[i] = answer[i]
            }
        }
        navigation.navigate('passDeviceAfterPreTest',{projectName:route.params.projectName,testData:route.params.testData,userName:name,answer:answerSaved})
    }
    /*******************/

    /*******************/
    return (
        <View style={styles.container}>
            <Modal
                transparent={true}
                visible={isModal}

            >
                {
                    permisionModal()
                }
            </Modal>
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
                <Text style={styles.bodyHeadingText}>Please select the options that apply.</Text>
                <TextInput
                    placeholder={'your name please'}
                    placeholderTextColor={'#FFFFFF70'}
                    style={[styles.input, { alignSelf: 'center', width: wp('60'), paddingVertical: hp('1.5'), paddingBottom: hp('1'), textAlign: 'center' }]}
                    onChangeText={(e) => { setName(e) }}
                />
                <FlatList
                    data={preTest}
                    style={styles.flatList}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => (
                        renderTest(item, index)
                    )}
                />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    onPress={() => { saveHandler() }}
                    style={styles.button}>
                    <Text></Text>
                    <Text style={styles.buttonText}>Save</Text>
                    <Image source={require('../../assets/icons/other/navigate-next.png')} style={styles.backIcon}
                    />
                </TouchableOpacity>
            </View>
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
        flex: 13, backgroundColor: '#340E56',
    },
    bodyHeadingText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '800', fontSize: hp('2.5'), color: '#D2EEC7', marginHorizontal: wp('5'), marginTop: hp('3'), letterSpacing: wp('0.3')
    },
    footer: {
        flex: 2, backgroundColor: '#340E56'
    },
    button: {
        alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', width: wp('50'), borderWidth: wp('0.3'), paddingVertical: hp('1.3'), paddingHorizontal: wp('4'), marginVertical: hp('2'), borderRadius: hp('15'), alignItems: 'center', borderColor: '#D2EEC7'
    },
    buttonText: {
        fontFamily: 'Montserrat-Regular', color: '#D2EEC7', fontSize: hp('2'), fontWeight: '700'
    },
    //Questions
    flatList: {
        marginHorizontal: wp('10'), marginTop: hp('2')
    },
    questionView: {
        marginVertical: hp('1')
    },
    questionTitleText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '600', fontSize: hp('2.5'), color: '#FFFFFF', marginVertical: hp('1'),
    },
    mcqView: {
        flexDirection: 'row', alignItems: 'center'
    },
    mcqText: {
        fontFamily: 'MontSerrat-Regular', color: '#FFFFFF', fontSize: hp('2'), fontSize: hp('2'), letterSpacing: wp('0.2'), marginBottom: hp('1')
    },
    mcqActiveButton: {
        borderWidth: wp('0.3'), width: wp('2.5'), height: hp('1.2'), marginRight: wp('2'), backgroundColor: '#D2EEC7', borderColor: '#754B85', borderRadius: hp('15')
    },
    mcqButton: {
        width: wp('2.5'), height: hp('1.2'), marginRight: wp('2'), backgroundColor: '#D2EEC7', borderRadius: hp('15')
    },
    input: {
        fontFamily: 'Montserrat-Regular', fontWeight: '500', borderBottomWidth: wp('0.2'), borderBottomColor: '#D2EEC7', fontSize: hp('2'), paddingBottom: hp('1'), letterSpacing: wp('0.2'), width: wp('70'), color: '#D2EEC7'
    },
    permissionExplainText: {
        fontFamily: 'Montserrat-Regular', color: '#D2EEC770', borderBottomWidth: wp('0.2'), borderBottomColor: '#D2EEC7', fontSize: hp('1.8'), paddingBottom: hp('0.5'), letterSpacing: wp('0.2'), width: wp('70')
    }

})