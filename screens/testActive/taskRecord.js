import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity, Image, Button, Platform, StatusBar, FlatList, Modal, Touchable } from 'react-native';
import firebase, { utils } from '@react-native-firebase/app'
import storage from '@react-native-firebase/storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AudioRecorderPlayer, {
    AVEncoderAudioQualityIOSType,
    AVEncodingOption,
    AudioEncoderAndroidType,
    AudioSet,
    AudioSourceAndroidType,
    PlayBackType,
    RecordBackType,
} from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(1);


export default function TaskRecord({ navigation, route }) {
    const tasks = route.params.testData.tasks;
    const [testActive, setTestActive] = useState(false);
    const [testTakenData, setTestTakenData] = useState([]);
    const [recordTime, setRecordTime] = useState('00:00:00');
    const [isTaskActiveModal, setIsTaskActiveModal] = useState(false);
    const [currentTaskData, setCurrentTaskData] = useState([]);
    const [taskFinished, setTaskFinished] = useState(false);
    const [currentMetering, setCurrentMetering] = useState([]);
    useEffect(() => {

    }, [])
    const path = Platform.select({
        ios: 'task.m4a',
    });
    const onStartRecord = async () => {
        const audioSet = {
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
        }
        const meteringEnabled = true;
        const uri = await audioRecorderPlayer.startRecorder(
            path,
            audioSet,
            meteringEnabled
        )
        audioRecorderPlayer.addRecordBackListener((e) => {
            if (e.isRecording) {
                setRecordTime(audioRecorderPlayer.mmssss(
                    Math.floor(e.currentPosition),
                ));
                console.log(e)
                let value = e.currentMetering + 60
                let arr = currentMetering
                arr.unshift(value)
                setCurrentMetering(arr)
            }
        })

    }
    const uploadAuio = async (path) => {
        const reference = storage().ref(route.params.projectName + '/' + route.params.testData.name + '/' + route.params.userName + '/' + tasks[testTakenData.length]);
        const pathToFile = path;
        await reference.putFile(pathToFile).then(async (res) => {
            const getDownloadUrl = await storage().ref(route.params.projectName + '/' + route.params.testData.name + '/' + route.params.userName + '/' + tasks[testTakenData.length]).getDownloadURL();
            let newObject0 = new Object()
            newObject0['notes'] = notes
            let newObject1 = new Object()
            newObject1['soundData'] = currentMetering;
            let newObject = new Object();
            newObject[tasks[currentTaskData.length]] = getDownloadUrl
            currentTaskData.unshift(newObject, newObject1, newObject0)
            return true
        })
    }
    const onStopRecord = async () => {
        var result = await audioRecorderPlayer.stopRecorder();
        audioRecorderPlayer.removeRecordBackListener();
        uploadAuio(result).then(res => {
            testTakenData[testTakenData.length] = currentTaskData;
            setNotes([])
            setRecordTime('00:00:00')
            setCurrentTaskData([])
            if (testTakenData.length < tasks.length) {
                setIsTaskActiveModal(false)
                setCurrentMetering([])
            }
        })
    }

    const onPauseRecord = async () => {
        let result = await audioRecorderPlayer.pauseRecorder()
    }

    const onResumeRecord = async () => {
        let result = await audioRecorderPlayer.resumeRecorder();
    }
    //render graph 
    var graphRef = useRef();
    const graph = (item, index) => {
        if (currentMetering.length > 5) {
            graphRef.current.scrollToIndex({ index: 0 })
        }
        return (
            <View
                style={{ borderBottomWidth: wp('0.5'), width: wp(String(item)), borderBottomColor: '#D2EEC7', marginVertical: hp('0.1'), }}>
            </View>
        )
    }
    //const add a note
    const noteHandler = () => {
        if (noteText == undefined || noteText.length < 1) {
            setAddNote(false)
            onResumeRecord()
        } else {
            let newObject = new Object();
            newObject[recordTime] = noteText;
            let arr = notes;
            arr.push(newObject)
            setNotes(arr)
            setNoteText();
            setAddNote(false)
            onResumeRecord()
        }
    }
    const [addNote, setAddNote] = useState(false);
    const [noteText, setNoteText] = useState();
    const [notes, setNotes] = useState([]);
    const addNoteModal = () => {
        return (
            <View style={styles.noteView}>
                <TextInput
                    placeholder={'add a note here'}
                    onChangeText={(e) => { setNoteText(e) }}
                    style={styles.noteInput}
                    placeholderTextColor={'#2D0A4B70'}
                />
                <TouchableOpacity
                    onPress={() => {
                        noteHandler()
                    }}
                    style={styles.noteButton}>
                    <Text style={styles.addNoteButtonText}>Done</Text>
                </TouchableOpacity>
            </View>
        )
    }
    /***** Finish tasks *****/
    const finishTasks = () => {
        setNotes([])
        setRecordTime('00:00:00')
        setCurrentTaskData([])
        setIsTaskActiveModal(false)
        setCurrentMetering([])
        navigation.navigate('passDeviceForNPs', { projectName: route.params.projectName, testData: route.params.testData, userName: route.params.userName, answer: route.params.answer, tasksData: testTakenData })
    }
    /*task active recording*/
    const taskActiveModal = () => {
        return (
            <View style={styles.container}>
                <Modal
                    transparent={true}
                    visible={addNote}
                >
                    <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: hp('30'), backgroundColor: '#00000070' }}>
                        {
                            addNoteModal()
                        }
                    </View>
                </Modal>
                <View style={styles.header}>
                    <Text></Text>
                    <Text></Text>
                    <TouchableOpacity
                        onPress={() => {

                        }}
                        style={styles.headerButton}>
                        <Image
                            source={require('../../assets/icons/other/back.png')}
                            style={styles.backIcon}
                        />
                        <Text style={styles.headerButtonText}>Back</Text>
                    </TouchableOpacity>
                    <Text></Text>
                </View>
                <View style={[styles.body]}>
                    <View style={{ flex: 10 }}>
                        <View style={{ flex: 3, marginTop: hp('2'), marginHorizontal: wp('10'), width: wp('70') }}>
                            {
                                testTakenData.length >= tasks.length ?
                                    <View>
                                        <Text style={styles.taskNumberText}>Task {testTakenData.length}</Text>
                                        <Text style={styles.taskText}>{tasks[testTakenData.length - 1]}</Text>
                                    </View> :
                                    <View>
                                        <Text style={styles.taskNumberText}>Task {testTakenData.length + 1}</Text>
                                        <Text style={styles.taskText}>{tasks[testTakenData.length]}</Text>
                                    </View>
                            }
                        </View>
                        <View style={{ flex: 15, marginHorizontal: wp(20) }}>
                            {
                                taskFinished == false ?
                                    <FlatList
                                        data={currentMetering}
                                        ref={graphRef}
                                        getItemLayout={(data, index) => { return { length: 22, index, offset: 33 * index } }}
                                        style={{ flex: 9, }}
                                        keyExtractor={(item, index) => String(index)}
                                        renderItem={({ item, index }) => (
                                            graph(item, index)
                                        )}
                                    />
                                    : null
                            }
                            <View style={{ flex: 0.5 }}>
                                <Text></Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ flex: 1, alignSelf: 'center' }}>
                        <Text style={[styles.taskNumberText, { alignSelf: 'center', marginBottom: hp('0.4') }]}>Timer</Text>
                        <Text style={[styles.timerText]}>{recordTime}</Text>
                    </View>
                </View>
                <View style={[styles.footer, { flex: 2.5 }]}>
                    {
                        testTakenData.length == tasks.length ?
                            <View style={styles.modalBottomView}>
                                <TouchableOpacity
                                    onPress={() => {

                                    }}
                                    style={styles.nextTaskButton}
                                >
                                    <Text style={styles.nexTaskButtonText}>Failed</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        finishTasks()
                                    }}
                                    style={styles.nextTaskButton}
                                >
                                    <Text style={styles.nexTaskButtonText}>Finish tasks</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={styles.modalBottomView}>
                                <TouchableOpacity
                                    onPress={() => {
                                        onStopRecord()
                                    }}
                                    style={styles.nextTaskButton}
                                >
                                    <Text style={styles.nexTaskButtonText}>Next Task</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        onPauseRecord()
                                        setAddNote(true)
                                    }}
                                    style={styles.addCommentButton}
                                >
                                    <Text style={styles.addCommentButtonText}>Make note</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>
            </View>
        )
    }

    /**********************/
    return (
        <View style={styles.container}>
            <Modal
                visible={isTaskActiveModal}
            >
                <View style={{ flex: 1 }}>
                    {
                        taskActiveModal()
                    }
                </View>
            </Modal>
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
                {
                    testActive == false ?
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 3, marginTop: hp('2'), marginHorizontal: wp('10'), width: wp('70') }}>
                                <Text style={styles.taskNumberText}>Task {testTakenData.length + 1}</Text>
                                <Text style={styles.taskText}>{tasks[testTakenData.length]}</Text>
                            </View>
                            <View style={{ flex: 8 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setIsTaskActiveModal(true)
                                        onStartRecord()
                                    }}
                                    style={styles.startButton}
                                >
                                    <Image
                                        source={require('../../assets/icons/other/playButton.png')}
                                        style={styles.playIcon}
                                    />
                                </TouchableOpacity>
                                <Text style={[styles.taskNumberText, { letterSpacing: wp('0.2'), alignSelf: 'center', marginTop: hp('12'), fontSize: hp('1'), marginBottom: hp('0.2') }]}>START TIMER</Text>
                                <Text style={styles.timerText}>{recordTime}</Text>
                            </View>
                        </View>

                        : null
                }
            </View>
            <View style={styles.footer}>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#000000'
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
        flex: 12, backgroundColor: '#340E56', justifyContent: 'center'
    },
    footer: {
        flex: 3, backgroundColor: '#340E56'
    },
    ///task start scene
    taskNumberText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '400', fontSize: hp('1.5'), color: '#F1FCF0', letterSpacing: wp('0.2')
    },
    taskText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '800', fontSize: hp('3'), color: '#F1FCF0', letterSpacing: wp('0.5')
    },
    startButton: {
        backgroundColor: '#D2EEC7', height: hp('32'), marginHorizontal: wp('16'), alignItems: 'center', justifyContent: 'center', borderRadius: hp('30')
    },
    playIcon: {
        width: wp('16'), height: hp('12'), alignSelf: 'center'
    },
    timerText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '800', color: '#FFFFFF', alignSelf: 'center', fontSize: hp('3'), letterSpacing: wp('0.4')
    },
    //Task active screen

    modalBottomView: {
        backgroundColor: '#432160', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center', paddingVertical: hp('5'), borderTopEndRadius: hp('4'), borderTopStartRadius: hp('4'), flex: 1
    },
    nextTaskButton: {
        borderWidth: wp('0.3'), borderColor: '#D2EEC7', paddingHorizontal: hp('2'), borderRadius: hp('12'), marginLeft: wp('3')
    },
    nexTaskButtonText: {
        fontFamily: 'Montserrat-Regular', color: '#D2EEC7', paddingVertical: hp('1.5'), fontSize: hp('1.8'), fontWeight: '600', letterSpacing: wp('0.2')
    },
    addCommentButton: {
        borderWidth: wp('0.3'), borderColor: '#D2EEC7', paddingHorizontal: hp('2'), borderRadius: hp('12'), backgroundColor: '#D2EEC7'

    },
    addCommentButtonText: {
        fontFamily: 'Montserrat-Regular', color: '#340E56', paddingVertical: hp('1.5'), fontWeight: '600', letterSpacing: wp('0.2'),
    },
    //note modal
    noteView: {
        backgroundColor: '#B8A4C7', justifyContent: 'space-between', alignItems: 'center', width: wp('100'), flexDirection: 'row', borderRadius: hp('12'), alignSelf: 'center', width: wp('95'), paddingVertical: hp('0.3')
    },
    noteInput: {
        fontFamily: 'MontSerrat-Regular', fontWeight: '500', color: '#2D0A4B', flex: 5, paddingHorizontal: wp('2'), fontSize: hp('2')
    },
    noteButton: {
        backgroundColor: '#2D0A4B', flex: 1.4, alignItems: 'center', borderRadius: hp('2'), marginLeft: wp('2'), paddingVertical: hp('0.3'), marginRight: wp('1')
    },
    addNoteButtonText: {
        fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontWeight: '600', fontSize: hp('1.7'), letterSpacing: wp('0.1'), paddingHorizontal: wp('1'), textAlign: 'center'
    }
})
