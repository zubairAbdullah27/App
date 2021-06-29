import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default function uxTestDescription({ navigation, route }) {

    //user projects description go here
    const [testDescription, setTestDescription] = useState()
    //nextHandler
    const nextHandler = () => {
        if(testDescription != undefined && testDescription.length>1){
            navigation.navigate('preTestSurvery',{projectName:route.params.projectName,testName:route.params.testName,testDescription:testDescription})
        }else{
            alert('Please enter valid test description')
        }
    }

    useEffect(() => {

    }, [])
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
                <Text style={styles.headerText}>Test Description</Text>
                <Text></Text>

            </View>
            <View style={styles.body}>
                <View style={{ marginHorizontal: wp('4') }}>
                    <Text style={styles.projectNameText}>{route.params.projectName}</Text>
                    <Text style={styles.testTitle}>{route.params.testName}</Text>
                </View>
                <TextInput
                    placeholder='Brief Test Description'
                    placeholderTextColor={'#754B85'}
                    onChangeText={setTestDescription}
                    autoFocus={true}
                    multiline={true}
                    style={styles.input}
                />
                <Text></Text>
            </View>
            <View style={styles.footer}>

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => { nextHandler() }}
                >
                    <Text style={{ marginLeft: wp('5') }}></Text>
                    <Text style={styles.buttonText}>Next</Text>
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
        flex: 1, backgroundColor: '#2D0A4B', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignContent: 'center'
    },
    headerText: {
        fontSize: hp('2.3'), fontFamily: 'Montserrat-Regular', fontWeight: '800', marginTop: hp('4'), color: '#B8A4C7', marginRight: wp('10')
    },
    body: {
        flex: 6, backgroundColor: '#340E56', justifyContent: 'space-between',
    },
    projectNameText: {
        color: '#754B85', fontSize: hp('3.5'), fontFamily: 'Montserrat-Regular', fontWeight: '800', marginTop: hp('1'),
    },
    testTitle: {
        color: '#754B85', fontSize: hp('2.2'), fontFamily: 'Montserrat-Regular', fontWeight: '800'
    },
    input: {
        fontFamily: 'Montserrat-Regular', fontWeight: '800', fontSize: hp('2'),color:'#D2EEC7',width:wp('60'),alignSelf:'center'
    },
    footer: {
        backgroundColor: '#340E56', flex: 3,
    },
    nextButton: {
        borderWidth: wp('0.5'), alignContent: 'center', borderColor: '#D2EEC7', marginTop: hp('5'), paddingVertical: hp('1.5'), borderRadius: hp('5'), flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: wp('15')
    },
    buttonText: {
        color: '#D2EEC7', alignSelf: 'center', fontFamily: 'Montserrat-Regular', fontSize: hp('2'), fontWeight: '700',
    }

})