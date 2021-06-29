import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput, Image } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

export default function TaskCreation({ navigation, route }) {

    //new task input useRef
    const taskinputRef = useRef()
    //test tasks
    const [tasks, setTasks] = useState()
    // new task to be added value
    const [newTask, setNewTask] = useState()
    //user id
    const [userId, setUserId] = useState();

    //on component mount
    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            setUserId(user.uid)
        }
        firebase.database().ref(user.uid + '/' + route.params.projectName + '/' + route.params.testName).once('value', (snapshot) => {
            if (snapshot.val() != undefined && snapshot.val() != null) {
                setTasks(snapshot.val()['tasks'])
            }
        })
    }, [])

    /*new task handler*/
    const newTaskHandler = () => {
        if (tasks != undefined) {
            let newArray = tasks;
            if (newTask != undefined && newTask.length > 1) {
                newArray[newArray.length] = newTask
                setTasks(newArray)
                setNewTask()
                taskinputRef.current.clear()
            }
        } else {
            let newArray = []
            if (newTask != undefined && newTask.length > 1) {
                newArray[newArray.length] = newTask
                setTasks(newArray)
                setNewTask()
                taskinputRef.current.clear()
            }
        }
    }
    /*****/
    /*Finish handler*/
    const finishHandler = async () => {
        firebase.database().ref(userId + '/' + route.params.projectName + '/' + route.params.testName).update({
            name: route.params.testName,
            description: route.params.testDescription,
            preTest: route.params.question,
            postTest: route.params.postTest,
            tasks: tasks
        })
        navigation.navigate('projectwelcome')
    }
    /****/

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
                <Text style={styles.headerText}>Tasks being tested</Text>
                <Text></Text>
            </View>
            <View style={styles.body}>
                <View style={styles.bodyTopView}>
                    <Text style={styles.projectNameText}>{route.params.projectName}</Text>
                </View>
                <View style={styles.bodyMainView}>
                    <Text style={styles.bodyMainViewHeading}>{route.params.testName}</Text>
                    <Text style={styles.bodyMainViewSubHeading}>What tasks in your product are your testing with users?</Text>
                </View>
                <View style={{ marginHorizontal: wp('10'), flex: 2, marginTop: hp('4') }}>
                    <FlatList
                        data={tasks}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({ item, index }) => (
                            <View style={styles.tasksListView}>
                                <MaterialCommunityIcons
                                    name='equal'
                                    size={hp('3')}
                                    style={[styles.editIcon, { width: wp('10') }]}
                                />
                                <View style={[styles.taskInput, { borderBottomColor: '#FFFFFF' }]}>
                                    <Text style={styles.tasksText}>{(index + 1) + '.  ' + item}</Text>
                                </View>
                            </View>
                        )}
                    />
                </View>
                <View style={{ marginHorizontal: wp('10'), flex: 1 }}>
                    <View style={styles.tasksListView}>
                        <MaterialCommunityIcons
                            name='equal'
                            size={hp('3')}
                            style={[styles.editIcon, { width: wp('10') }]}

                        />
                        <View style={styles.taskInput}>
                            <TextInput
                                placeholder={tasks != undefined ? 'Task ' + (tasks.length + 1) : 'Task 1'}
                                placeholderTextColor='#754B85'
                                style={styles.tasksText}
                                autoFocus={true}
                                ref={taskinputRef}
                                onChangeText={(e) => { setNewTask(e) }}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => { newTaskHandler() }}
                        style={styles.addTaskButton}
                    >
                        <Text style={styles.addTaskButtonText}>add new task</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => { finishHandler() }}
                >
                    <Text style={{ marginLeft: wp('10') }}></Text>
                    <Text style={styles.buttonText}>Finish</Text>
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
        color: '#B8A4C7', paddingVertical: hp('1.2'), fontFamily: 'Montserrat-Regular', fontSize: hp('2'), fontWeight: '500', letterSpacing: wp('0.3')
    },
    body: {
        flex: 6, backgroundColor: '#340E56', justifyContent: 'space-between',
    },
    bodyTopView: {
        marginHorizontal: wp('8'), borderBottomWidth: wp('0.4'), borderBottomColor: '#754B85', paddingVertical: hp('2')
    },
    bodyMainView: {
        flex: 1.5, marginHorizontal: wp('8')
    },
    bodyMainViewHeading: {
        fontFamily: 'Montserrat-Regular', fontSize: hp('2.5'), fontWeight: '800', color: '#FFFFFF', marginVertical: hp('2')
    },
    bodyMainViewSubHeading: {
        fontFamily: 'Montserrat-Regular', fontSize: hp('2.3'), fontWeight: '800', color: '#FFFFFF', marginBottom: hp('2'), letterSpacing: wp('0.3'), lineHeight: hp('3.5')
    },
    tasksListView: {
        flexDirection: 'row', alignItems: 'center', marginVertical: hp('1.2')
    },
    tasksText: {
        fontFamily: 'Montserrat-Regular', fontSize: hp('2.3'), fontWeight: '800', color: '#FFFFFF', paddingBottom: wp('1')
    },
    editIcon: {
        color: '#754B85',
    },
    testTasksIcon: {

    },
    taskInput: {
        borderBottomWidth: wp('0.2'), borderBottomColor: '#754B85', flex: 1
    },
    addTaskButton: {
        alignSelf: 'flex-end', paddingHorizontal: wp('4'), alignItems: 'center', borderRadius: hp('15'), backgroundColor: '#A1D1AF', paddingVertical: hp('1')
    },
    addTaskButtonText: {
        fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontSize: hp('2'), paddingVertical: hp('0.5'), fontWeight: '600', letterSpacing: wp('0.3')
    },
    footer: {
        backgroundColor: '#340E56', flex: 1.3,
    },
    nextButton: {
        borderWidth: wp('0.5'), alignContent: 'center', borderColor: '#D2EEC7', marginTop: hp('5'), paddingVertical: hp('1.5'), borderRadius: hp('5'), flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: wp('15')
    },
    buttonText: {
        color: '#D2EEC7', alignSelf: 'center', fontFamily: 'Montserrat-Regular', fontSize: hp('2'), fontWeight: '700',
    },
    nextIcon: {
        width: wp('2.5'), height: hp('2'), marginHorizontal: wp('3')
    },

})