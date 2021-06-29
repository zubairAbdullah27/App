import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, Image } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

export default function PostTestSurvery({ navigation, route }) {


    //test options
    const [postTest, setPostTest] = useState([
        { title: 'Net promotor score (NPS)', text: 'see preview', screenPreview: 'nps' },
        { title: 'Post-study system usability questionnaire (PSSUQ)', text: 'see preview', screenPreview: 'pssuq' }
    ])

    const saveHandler = () => {
        navigation.navigate('taskcreation',{projectName:route.params.projectName,testName:route.params.testName,testDescription:route.params.testDescription,question:route.params.question,postTest:postTest})
    }
    useEffect(() => {

    }, [])

    /*render item*/
    const renderQuestion = (item, index) => {
        return (
            <View style={styles.questionItemView}>
                <View style={styles.titleView}>
                    <Text style={styles.questionItemTitleText}>{item.title}</Text>
                    <View style={styles.titleIconsView}>
                        <TouchableOpacity
                            onPress={() => {
                            }}
                        >
                            <FontAwesome
                                name='pencil'
                                size={hp('2')}
                                style={styles.editIcon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { }}
                        >
                            <Feather
                                name='x'
                                size={hp('2.5')}
                                style={styles.editIcon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                onPress={() => { navigation.navigate(item.screenPreview,{projectName:route.params.projectName}) }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.questionItemText}>{item.text}</Text>
                        <Image
                            source={require('../../assets/icons/other/navigate-next.png')}
                            style={styles.nextIcon}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    /*****/
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => { navigation.goBack() }}
                    style={{ marginLeft: wp('4'), marginTop: hp('4') }}
                >
                    <MaterialIcons
                        name='arrow-back-ios'
                        size={hp('3')}
                        color={'#B8A4C7'}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>Post-test Survey</Text>
                <Text></Text>

            </View>
            <View style={styles.body}>
                <View style={styles.bodyTopView}>
                    <Text style={styles.projectNameText}>{route.params.projectName}</Text>
                    <Text style={styles.testTitle}>{route.params.testName}</Text>
                </View>
                <View style={styles.bodyMainView}>
                    <Text style={styles.bodyMainViewHeading}>Post Test Survery</Text>
                    <TouchableOpacity>
                        <Text></Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={postTest}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item, index }) => (
                        renderQuestion(item, index)
                    )}
                />
            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => {saveHandler()}}
                >
                    <Text style={{ marginLeft: wp('10') }}></Text>
                    <Text style={styles.buttonText}>Save</Text>
                    <Image
                        source={require('../../assets/icons/other/navigate-next.png')}
                        style={[styles.nextIcon, { marginHorizontal: hp('2') }]}
                    />
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#000000',
    },
    header: {
        flex: 1, backgroundColor: '#2D0A4B', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignContent: 'center'
    },
    headerText: {
        fontSize: hp('2.3'), fontFamily: 'Montserrat-Regular', fontWeight: '800', marginTop: hp('4'), color: '#B8A4C7', marginRight: wp('10')
    },
    projectNameText: {
        color: '#FFFFFF', fontSize: hp('3.4'), fontFamily: 'Montserrat-Regular', fontWeight: '800', marginTop: hp('1'),
    },
    testTitle: {
        color: '#B8A4C7', paddingVertical: hp('1.2'), fontFamily: 'Montserrat-Regular', fontSize: hp('2'), fontWeight: '500',letterSpacing:wp('0.3')
    },
    body: {
        flex: 6, backgroundColor: '#340E56', justifyContent: 'space-between',
    },
    bodyTopView: {
        marginHorizontal: wp('4'), borderBottomWidth: wp('0.4'), borderBottomColor: '#754B85'
    },
    bodyMainViewHeading: {
        fontFamily: 'Montserrat-Regular', fontSize: hp('2.5'), fontWeight: '800', marginHorizontal: wp('4'), color: '#FFFFFF', marginTop: hp('2')
    },
    questionItemView: {
        marginHorizontal: wp('5'), borderBottomWidth: wp('0.3'), paddingBottom: hp('1.5'), marginVertical: hp('2'), borderBottomColor: '#754B85'
    },
    titleView: {
        flexDirection: 'row', alignItems: 'center'
    },
    questionItemTitleText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '800', fontSize: hp('2.5'), color: '#FFFFFF', letterSpacing: wp('0.2'), lineHeight: hp('3.2'), width: wp('75')
    },
    titleIconsView: {
        flexDirection: 'row', alignSelf: 'center'
    },
    editIcon: {
        color: '#754B85', width: wp('8')
    },
    nextIcon: {
        width: wp('2.5'), height: hp('2'), marginHorizontal: wp('3')
    },
    questionItemText: {
        fontFamily: 'Montserrat-Regular', color: '#D2EEC7', fontSize: hp('2'), fontWeight: '500', paddingVertical: hp('1'), letterSpacing: wp('0.25')
    },
    footer: {
        backgroundColor: '#340E56', flex: 1.3,
    },
    nextButton: {
        borderWidth: wp('0.5'), alignContent: 'center', borderColor: '#D2EEC7', marginTop: hp('5'), paddingVertical: hp('1.5'), borderRadius: hp('5'), flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: wp('15')
    },
    buttonText: {
        color: '#D2EEC7', alignSelf: 'center', fontFamily: 'Montserrat-Regular', fontSize: hp('2'), fontWeight: '700',
    }

})