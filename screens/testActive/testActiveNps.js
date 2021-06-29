import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default function TestActiveNPS({ navigation, route }) {
    const values = [1, 2, 3, 4, 5]
    const renderValues1 = (item) => {
        return (
            <View style={styles.optionView}>
                <Text style={styles.optionText}>{item}</Text>
                <TouchableOpacity
                    style={styles.optionButton}
                >
                    <Text></Text>
                </TouchableOpacity>
            </View>

        )
    }
    const renderValues2 = (item) => {
        if (item != 3) {
            return (
                <View style={styles.optionView}>
                    <Text style={styles.optionText}>{item + 5}</Text>
                    <TouchableOpacity
                        style={styles.optionButton}
                    >
                        <Text></Text>
                    </TouchableOpacity>
                </View>
            )
        } else if (item == 3) {
            return (
                <View style={styles.optionView}>
                    <Text style={styles.optionText}>{item + 5}</Text>
                    <TouchableOpacity
                        style={{backgroundColor: '#D2EEC7',borderWidth:wp('1.2'),borderColor:'#554871',borderRadius: hp('30'), width: wp('5.5'),height:hp('2.5'), marginTop: hp('2')}}
                    >
                        <Text></Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
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
                <View style={styles.projectTitleView}>
                    <Text style={styles.projectNameText}> {route.params.projectName}</Text>
                </View>
                <Text style={styles.versionText}>Version 1</Text>
                <Text style={styles.bodyText}>How likely are you to recommend this app to a friend?</Text>
                <FlatList
                    data={values}
                    keyExtractor={(item, index) => String(index)}
                    horizontal={true}
                    style={styles.optionList}
                    renderItem={({ item, index }) => (
                        renderValues1(item)
                    )}
                />
                <FlatList
                    data={values}
                    keyExtractor={(item, index) => String(index)}
                    horizontal={true}
                    style={styles.optionList2}
                    renderItem={({ item, index }) => (
                        renderValues2(item)
                    )}
                />
                <View style={styles.feedbackInputView}>
                    <Text style={styles.feedbackInputText}>Comments, thoughts, feedback, suggestions?</Text>
                </View>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => { navigation.goBack() }}
                >
                    <Text style={{ marginLeft: wp('5') }}></Text>
                    <Text style={styles.buttonText}>Back</Text>
                    <MaterialIcons
                        name='navigate-next'
                        size={hp('3')}
                        color={'#D2EEC7'}
                        style={{ marginRight: wp('5') }}
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
        flex: 1.5, backgroundColor: '#2D0A4B', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignContent: 'center'
    },
    headerText: {
        fontSize: hp('2.3'), fontFamily: 'Montserrat-Regular', fontWeight: '800', marginTop: hp('4'), color: '#B8A4C7', marginRight: wp('10')
    },
    body: {
        flex: 10, backgroundColor: '#340E56',
    },
    projectTitleView: {
        borderBottomWidth: wp('0.3'), borderBottomColor: '#754B85', paddingBottom: hp('2'), marginHorizontal: wp('4'), marginVertical: hp('2'),
    },
    projectNameText: {
        color: '#FFFFFF', fontSize: hp('3.4'), fontFamily: 'Montserrat-Regular', fontWeight: '800', textAlign: 'left',
    },
    versionText: {
        fontFamily: 'Montserrat-Regular', color: '#D2EEC7', fontWeight: '800', fontSize: hp('2.2'), marginHorizontal: wp('4'), paddingVertical: hp('2.5')
    },
    bodyText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '800', color: '#FFFFFF', fontSize: hp('2.2'), textAlign: 'left', width: wp('70'), marginHorizontal: wp('4'), letterSpacing: wp('0.3')
    },
    optionList: {
        marginHorizontal: wp('5'),marginTop:hp('5')
    },
    optionList2: {
        marginHorizontal: wp('5'), marginBottom:hp('2')
    },
    optionView: {
        marginHorizontal: wp('6'),
    },
    optionText: {
        fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontWeight: '500', fontSize: hp('2.5')
    },
    optionButton: {
        backgroundColor: '#FFFFFF30',borderRadius: hp('30'), width: wp('5'),height:hp('2.5'), marginTop: hp('2')
    },
    feedbackInputView: {
        backgroundColor: '#754B8540', marginHorizontal: wp('6'),borderRadius: hp('2'),paddingHorizontal:wp('2'),paddingBottom:hp('6')  
    },
    feedbackInputText: {
        color: '#D2EEC730',fontFamily:'Montserrat-Regular',fontSize:hp('2'),fontWeight:'500',paddingTop:hp('1.5'),paddingHorizontal:hp('1')
    },
    footer: {
        backgroundColor: '#340E56', flex: 2,
    },
    nextButton: {
        borderWidth: wp('0.5'), alignContent: 'center', borderColor: '#D2EEC7', marginTop: hp('5'), paddingVertical: hp('1.5'), borderRadius: hp('5'), flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: wp('15')
    },
    buttonText: {
        color: '#D2EEC7', alignSelf: 'center', fontFamily: 'Montserrat-Regular', fontSize: hp('2'), fontWeight: '700',
    }

})