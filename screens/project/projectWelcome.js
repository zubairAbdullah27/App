import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, FlatList, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import firebase from '@react-native-firebase/app'
import database from '@react-native-firebase/database';

export default function projectsWelcome({ navigation }) {

    //user projectss go here
    const [projects, setprojects] = useState();
    const [projectsData, setProjectsData] = useState()
    const [userId, setUserId] = useState()
    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            setUserId(user.uid)
        } else {
            navigation.navigate('login')
        }
        firebase.database().ref(user.uid + '/').on('value', (snapshot) => {
            if (snapshot.val() != undefined && snapshot.val() != null) {
                setprojects(Object.keys(snapshot.val()))
                setProjectsData(snapshot.val())
            }
        })
    }, [])
    /*render one project*/
    const renderTest = (item,projectName) => {
        if (item != undefined) {
            let min = 0;
            let sec = 0;
            let user = 0;
            let days = 0
            if (item.total_users != undefined) {
                user = item.total_users
                const avg_time = item.total_time / item.total_users
                min = Math.floor((avg_time / 1000 / 60) << 0);
                sec = Math.floor((avg_time / 1000) % 60);
            }
            if (item.lastTestDay != undefined) {
                days = item.lastTestDay
            }
            return (
                <View style={styles.testCardView}>
                    <View style={styles.testTileView}>
                        <Text style={styles.testTitleText}>{item['name']}</Text>
                        <Image
                            source={require('../../assets/icons/other/navigate-next.png')}
                            style={styles.testIcon}
                        />
                    </View>
                    <View style={styles.itemView}>
                        <Text style={styles.itemViewValueText}>{user}</Text>
                        <Text style={styles.itemViewText}>Users Tested</Text>
                    </View>
                    <View style={styles.itemView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.itemValueTimeContainer}>
                                <Text style={styles.itemViewValueText}>{min}</Text>
                                <Text style={styles.minsSText}>mins</Text>
                            </View>
                            <View style={styles.itemValueTimeContainer}>
                                <Text style={styles.itemViewValueText}>{sec}</Text>
                                <Text style={styles.minsSText}>s</Text>
                            </View>
                        </View>
                        <Text style={styles.itemViewText}>Avg. Time</Text>
                    </View>
                    <View style={[styles.itemView, { borderBottomWidth: wp(0), paddingBottom: wp('2') }]}>
                        <Text style={styles.itemViewValueText}>{days}</Text>
                        <Text style={[styles.itemViewText, { width: wp('25') }]}>Days Since Last Test</Text>
                    </View>
                    <View style={styles.itemButtonContainer}>
                        <TouchableOpacity style={[styles.itemButton]}>
                            <Text style={[styles.itemButtonText]}>Overview</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>{navigation.navigate('testActiveWelcome',{projectName:projectName,testData:item})}}
                            style={[styles.itemButton, { backgroundColor: '#A1D1AF', borderColor: '#A1D1AF' }]}>
                            <Text style={[styles.itemButtonText, { color: '#FFFFFF' }]}>Start Test</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }

    }
    /**********/
    /*render all projects*/
    const renderProjects = (item, index) => {
        const projectName =item
        return (
            <View style={{ marginVertical: hp('2') }}>
                <View style={styles.projectTitleView}>
                    <Text style={styles.projectTitleText}>{item}</Text>
                    <Text></Text>
                    <TouchableOpacity
                        onPress={() => { navigation.navigate('uxTestName', { projectName: item }) }}
                    >
                        <Text style={styles.projectEditText}>Edit</Text>
                    </TouchableOpacity>
                </View>
                {
                    projectsData != undefined ?
                        <FlatList
                            data={Object.values(projectsData[item])}
                            horizontal={true}
                            keyExtractor={(item, index) => String(index)}
                            renderItem={({ item, index }) => (
                                renderTest(item,projectName)
                            )}

                        />
                        : null
                }
            </View>
        )
    }
    /*****/
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => { navigation.navigate('profile') }}
                >
                    <EvilIcons
                        name='user'
                        color={'#F1FCF0'}
                        size={hp('4.5')}
                        style={[styles.topIcons, { alignSelf: 'flex-start' }]}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.topIcons, { alignSelf: 'flex-end' }]}
                >
                    <AntDesign
                        name='filter'
                        color={'#F1FCF0'}
                        size={hp('3')}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                {
                    projects == undefined ?
                        <View style={styles.zeroProjView}>
                            <Text style={styles.bodyTextHeading}>CREATE</Text>
                            <Text style={styles.body2ndHeading}>YOUR 1ST projects</Text>
                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={() => { navigation.navigate('createProject') }}
                            >
                                <Text style={styles.buttonText}>ADD projects</Text>
                                <MaterialIcons
                                    name='navigate-next'
                                    size={hp('3')}
                                    color={'#D2EEC7'}
                                    style={{ marginLeft: wp('4') }}
                                />
                            </TouchableOpacity>
                        </View>
                        : <View style={styles.projectsListView}>
                            <FlatList
                                data={projects}
                                keyExtractor={(item, index) => String(index)}
                                renderItem={({ item, index }) => (
                                    renderProjects(item, index)
                                )}
                            />
                        </View>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    /*test view*/
    testCardView: {
        backgroundColor: '#F1FCF0', width: wp('80'), marginHorizontal: wp('5'), marginVertical: hp('1.2'), paddingHorizontal: wp('4'), paddingVertical: hp('1'), borderRadius: hp('2.2'),shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
        
        elevation: 19,
    },
    testTileView: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
    },
    testTitleText: {
        fontFamily: 'Montserrat-Regular', fontSize: hp('2.3'), color: '#2D0A4B', fontWeight: '800', letterSpacing: wp('0.2')
    },
    testIcon: {
        width: wp('4'), height: hp('2')
    },
    itemView: {
        flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', borderBottomWidth: wp('0.1'), paddingVertical: hp('1.5')
    },
    itemViewValueText: {
        color: '#2D0A4B', fontSize: hp('3'), fontWeight: '800', fontFamily: 'Montserrat-Regular'
    },
    itemValueTimeContainer: {
        flexDirection: 'row', marginHorizontal: wp('1')
    },
    minsSText: {
        marginTop: hp('2'), color: '#000000', marginLeft: wp('0.5'), fontFamily: 'Montserrat-Regular'
    },
    itemViewText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '500', color: '#2D0A4B', fontSize: hp('1.8'), letterSpacing: wp('0.2'), marginLeft: wp('5')
    },
    itemButtonContainer: {
        flexDirection: 'row', justifyContent: 'space-evenly', paddingVertical: hp('1'), alignItems: 'center'
    },
    itemButton: {
        borderWidth: wp('0.2'), paddingVertical: hp('1'), paddingHorizontal: wp('2.5'), borderRadius: hp('10')
    },
    itemButtonText: {
        fontFamily: 'Montserrat-Regular', fontSize: hp('1.5'), fontWeight: '600', letterSpacing: wp('0.3')
    }
    ,
    container: {
        flex: 1, backgroundColor: '#000000'
    },
    header: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#2D0A4B', borderTopLeftRadius: hp('5'), borderTopRightRadius: hp('5')
    },
    topIcons: {
        marginHorizontal: wp('7'), marginTop: hp('4')
    },
    body: {
        flex: 9, backgroundColor: '#340E56'
    },
    zeroProjView: {
        flex: 1, alignSelf: 'center', justifyContent: 'center'
    },
    bodyTextHeading: {
        fontSize: hp('5'), letterSpacing: wp('0.3'), color: '#B8A4C7', fontFamily: 'Montserrat-Regular', fontWeight: '900', alignSelf: 'center'
    },
    body2ndHeading: {
        fontSize: hp('2.5'), letterSpacing: wp('0.8'), color: '#B8A4C7', fontFamily: 'Montserrat-Regular', fontWeight: '900', alignSelf: 'center',
    },
    nextButton: {
        borderWidth: wp('0.5'), alignContent: 'center', borderColor: '#D2EEC7', marginTop: hp('5'), paddingVertical: hp('1.5'), borderRadius: hp('5'), flexDirection: 'row', justifyContent: 'center'
    },
    buttonText: {
        color: '#D2EEC7', alignSelf: 'center', fontFamily: 'Montserrat-Regular', fontSize: hp('2'), fontWeight: '700',
    },
    /*Project view styles*/
    projectsListView: {
        marginVertical: hp('2')
    },
    projectTitleView: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: wp('8'), marginBottom: hp('1')
    },
    projectTitleText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '800', fontSize: hp('2.5'), color: '#F1FCF0', letterSpacing: wp('0.2'), width: wp('50')
    },
    projectEditText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '800', fontSize: hp('1.5'), color: '#F1FCF0', letterSpacing: wp('0.2')
    },


})