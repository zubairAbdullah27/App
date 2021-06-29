import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TextInput, Modal, FlatList, SafeAreaView, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

export default function preTestSurvery({ navigation, route }) {

    //default question
    const [question, setQuestion] = useState([
        { type: 'mcq', title: 'Gender', options: ['Male', 'Female', 'Other', 'other'], },
        { type: 'mcq', title: 'Age', options: ['16-24', '25-30', '31-40', '41-50', '50-65', '65+'] },
        { type: 'mcq', title: 'Income Level', options: ['$0-$20,000', '$20,001-60,000$', '$60,001-$100,000', '$100,001-250,000$', '$250,000+'] },
        { type: 'input', title: 'Profession', placeholder: 'write your profession' },
        { type: 'permission', title: 'Video Recording Permission', permissionExplainText: 'see preview', permissionText: '' },
        { type: 'permission', title: 'Audio Recording Permission', permissionExplainText: 'see preview', permissionText: '' }
    ])
    //user id
    const [userId, setUserId] = useState()
    //on component mount
    useEffect(() => {
        const user = firebase.auth().currentUser;
        if (user) {
            setUserId(user.uid)
        } else {
            navigation.navigate('login')
        }
    }, [])
    /*save new question in question list*/
    const saveQuestion = () => {
        if (newQuestionCategory == 'mcq') {
            if (title != undefined && options.length > 0) {
                let newQuestion = { type: newQuestionCategory, title: title, options: options }
                let i = 0;
                let k = 0;
                for (i; i < question.length; i++) {
                    if (question[i].type == 'mcq') {
                        k++;
                    }
                }
                let newArray = []
                for (let i = 0; i <= question.length; i++) {
                    if (i < k) {
                        newArray[i] = question[i]
                    } else if (i == k) {
                        newArray[i] = newQuestion
                    } else if (i > k) {
                        newArray[i] = question[i - 1]
                    }
                }
                setQuestion(newArray)
                setNewQuestionCategory()
                setTitle()
                setOptions([])
                setCurrenOption()
                setNewQuestionScreenVisible(false)
            }
        } else if (newQuestionCategory == 'input') {
            let newQuestion = { type: newQuestionCategory, title: title, placeholder: helperText }
            let i = 0;
            let k = 0;
            for (i; i < question.length; i++) {
                if (question[i].type == 'mcq') {
                    k++;
                }
            }
            let newArray = []
            for (let i = 0; i <= question.length; i++) {
                if (i < k) {
                    newArray[i] = question[i]
                } else if (i == k) {
                    newArray[i] = newQuestion
                } else if (i > k) {
                    newArray[i] = question[i - 1]
                }
            }
            setQuestion(newArray)
            setNewQuestionCategory()
            setTitle()
            setHelperText()
            setNewQuestionScreenVisible(false)
        } else if (newQuestionCategory == 'permission') {
            let newQuestion = { type: 'permission', title: title, permissionTextExplainText: permissionExplainText, permissionText: permissionText }
            let newArray = question;
            newArray[newArray.length] = newQuestionCategory
            setQuestion(newArray)
            setNewQuestionCategory()
            setTitle()
            setPermissionText()
            setPermissionExplainText()
            setNewQuestionScreenVisible(false)

        }
    }
    /*******/
    /*add an mcq option*/
    const [cancelModaVisible, setCancelModalVisible] = useState(false)
    const addMcqOption = () => {
        if (currentOption != undefined && currentOption.length > 1) {
            let arr = options;
            arr[options.length] = currentOption
            setOptions(arr)
            responseinputRef.current.clear()
            setCurrenOption()
        }
    }
    const cancelAdd = () => {
        return (
            <View style={styles.cancelModal}>
                <Text style={styles.cancelModalTitle}>You have an unsaved question</Text>
                <Text style={styles.cancelModalText}>Are you sure you want to delete your question?</Text>
                <View style={styles.cancelModalButtonView}>
                    <TouchableOpacity
                        onPress={() => {
                            setCancelModalVisible(false)
                            setNewQuestionCategory()
                            setTitle()
                            setOptions([])
                            setCurrenOption()
                            setHelperText()
                            setPermissionText()
                            setPermissionExplainText()
                            setNewQuestionScreenVisible(false)
                        }}
                        style={styles.cancelModalDeleteButton}
                    >
                        <Text style={styles.cancelModalDeleteButtonText}>Delete Question</Text>
                    </TouchableOpacity >
                    <TouchableOpacity
                        style={styles.cancelModalCancelButton}
                        onPress={() => { setCancelModalVisible(false) }}
                    >
                        <Text style={styles.cancelModalCancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
    /*new question screen*/
    const [title, setTitle] = useState()
    const [options, setOptions] = useState([])
    const [currentOption, setCurrenOption] = useState()
    const [newQuestionScreenVisible, setNewQuestionScreenVisible] = useState(false)
    const [helperText, setHelperText] = useState();
    const [permissionExplainText, setPermissionExplainText] = useState()
    const [permissionText, setPermissionText] = useState();
    const responseinputRef = useRef();
    const renderOptions = (item, index) => {
        return (
            <View style={styles.responseView}>
                <TouchableOpacity style={styles.responseButton}></TouchableOpacity>
                <Text style={styles.responseOptionText}>{item}</Text>
            </View>
        )
    }
    /render the new question/
    const questionModal = () => {
        if (newQuestionCategory == 'mcq') {
            return (
                <View style={styles.container}>
                    <Modal
                        transparent={true}
                        visible={cancelModaVisible}
                    >
                        <SafeAreaView style={styles.addQuestionModalView}>
                            {
                                cancelAdd()
                            }
                        </SafeAreaView>
                    </Modal>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => {
                                setNewQuestionCategory()
                                setTitle()
                                setOptions([])
                                setCurrenOption()
                                setNewQuestionScreenVisible(false)
                            }}
                            style={{ marginLeft: wp('4'), marginTop: hp('4') }}
                        >
                            <MaterialIcons
                                name='arrow-back-ios'
                                size={hp('3')}
                                color={'#B8A4C7'}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Multiple choice</Text>
                        <Text></Text>
                    </View>
                    <View style={styles.body}>
                        <View style={[styles.bodyTopView, { borderBottomWidth: wp('0.2') }]}>
                            <Text style={[styles.projectNameText, { fontWeight: '800', fontSize: hp('3'), marginTop: hp('1.5') }]}>Multiple choice qustion</Text>
                            <Text style={styles.testNameText}>{route.params.projectName}</Text>
                            <Text style={styles.testNameText}>{route.params.testName}</Text>
                        </View>
                        <View style={{ flex: 8, marginHorizontal: wp('8') }}>
                            {
                                title == undefined ?
                                    <TextInput
                                        placeholder={'Custom question ' + (question.length)}
                                        onChangeText={(e) => { setTitle(e) }}
                                        placeholderTextColor={'#D2EEC770'}
                                        style={styles.customInputTitle}
                                    />
                                    :
                                    <TextInput
                                        placeholder={title}
                                        onChangeText={(e) => { setTitle(e) }}
                                        style={styles.customInputTitle}
                                    />
                            }
                            <TextInput
                                editable={title != undefined && title.length > 0}
                                placeholder={'Response ' + (options.length + 1)}
                                ref={responseinputRef}
                                placeholderTextColor={'#D2EEC770'}
                                style={[styles.customInputTitle, { fontWeight: '600', marginLeft: wp('5') }]}
                                onChangeText={(e) => { setCurrenOption(e) }}
                            />
                            <TouchableOpacity
                                onPress={() => { addMcqOption() }}
                                disabled={title == undefined || title.length == 0}
                                style={styles.addResponseButton}>
                                <Text style={styles.addResponseButtonText}>Add response</Text>
                            </TouchableOpacity>
                            <Text style={styles.previewText}>Preview</Text>
                            <Text style={styles.questionTitle}>{title}</Text>
                            <FlatList
                                data={options}
                                style={{ marginVertical: hp('1'), marginHorizontal: wp('2') }}
                                keyExtractor={(item, index) => String(index)}
                                renderItem={({ item, index }) => (
                                    renderOptions(item, index)
                                )}
                            />
                        </View>
                    </View>
                    <View style={[styles.footer, { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }]}>
                        <TouchableOpacity
                            onPress={() => { setCancelModalVisible(true) }}
                            style={[styles.cancelButton]}>
                            <Text style={[styles.cancelButtonText]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={options.length < 1}
                            onPress={() => { saveQuestion() }}
                            style={[styles.saveButton, {}]}>
                            <Text style={styles.saveButtonText}>Save question</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else if (newQuestionCategory == 'input') {
            return (
                <View style={styles.container}>
                    <Modal
                        transparent={true}
                        visible={cancelModaVisible}
                    >
                        <SafeAreaView style={styles.addQuestionModalView}>
                            {
                                cancelAdd()
                            }
                        </SafeAreaView>
                    </Modal>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => {
                                setNewQuestionCategory()
                                setTitle()
                                setHelperText()
                                setNewQuestionScreenVisible(false)
                            }}
                            style={{ marginLeft: wp('4'), marginTop: hp('4') }}
                        >
                            <MaterialIcons
                                name='arrow-back-ios'
                                size={hp('3')}
                                color={'#B8A4C7'}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Free response</Text>
                        <Text></Text>
                    </View>
                    <View style={styles.body}>
                        <View style={[styles.bodyTopView, { borderBottomWidth: wp('0.2') }]}>
                            <Text style={[styles.projectNameText, { fontWeight: '800', fontSize: hp('3'), marginTop: hp('1.5') }]}>Free response</Text>
                            <Text style={styles.testNameText}>{route.params.projectName}</Text>
                            <Text style={styles.testNameText}>{route.params.testName}</Text>
                        </View>
                        <View style={{ flex: 8, marginHorizontal: wp('8') }}>
                            {
                                title == undefined ?
                                    <TextInput
                                        placeholder={'Custom question ' + (question.length)}
                                        onChangeText={(e) => { setTitle(e) }}
                                        placeholderTextColor={'#D2EEC770'}
                                        style={styles.customInputTitle}
                                    />
                                    :
                                    <TextInput
                                        placeholder={title}
                                        onChangeText={(e) => { setTitle(e) }}
                                        style={styles.customInputTitle}
                                    />
                            }
                            <TextInput
                                editable={title != undefined && title.length > 0}
                                placeholder={'Free response helper Text'}
                                ref={responseinputRef}
                                placeholderTextColor={'#D2EEC770'}
                                style={[styles.customInputTitle, { fontWeight: '500', marginTop: hp('4'), marginBottom: hp('2') }]}
                                onChangeText={(e) => { setHelperText(e) }}
                            />
                            <Text style={[styles.previewText, { marginVertical: hp('2') }]}>Preview</Text>
                            <Text style={styles.questionTitle}>{title}</Text>
                            {
                                helperText != undefined && helperText.length > 0 ?
                                    <TextInput
                                        placeholder={helperText}
                                        placeholderTextColor='#FFFFFF70'
                                        style={[styles.questionTitle, { borderBottomWidth: wp('0.2'), paddingVertical: hp('1.5'), borderBottomColor: '#FFFFFF70' }]}
                                        editable={false}
                                    /> :
                                    null
                            }
                        </View>
                    </View>
                    <View style={[styles.footer, { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }]}>
                        <TouchableOpacity
                            onPress={() => { setCancelModalVisible(true) }}
                            style={[styles.cancelButton]}>
                            <Text style={[styles.cancelButtonText]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={helperText == undefined || helperText.length < 1}
                            onPress={() => { saveQuestion() }}
                            style={[styles.saveButton, {}]}>
                            <Text style={styles.saveButtonText}>Save question</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else if (newQuestionCategory == 'permission') {
            return (
                <View style={styles.container}>
                    <Modal
                        transparent={true}
                        visible={cancelModaVisible}
                    >
                        <SafeAreaView style={styles.addQuestionModalView}>
                            {
                                cancelAdd()
                            }
                        </SafeAreaView>
                    </Modal>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => {
                                setNewQuestionCategory()
                                setTitle()
                                setPermissionText()
                                setPermissionExplainText()
                                setNewQuestionScreenVisible(false)

                            }}
                            style={{ marginLeft: wp('4'), marginTop: hp('4') }}
                        >
                            <MaterialIcons
                                name='arrow-back-ios'
                                size={hp('3')}
                                color={'#B8A4C7'}
                            />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Permission form</Text>
                        <Text></Text>
                    </View>
                    <View style={styles.body}>
                        <View style={[styles.bodyTopView, { borderBottomWidth: wp('0.2') }]}>
                            <Text style={[styles.projectNameText, { fontWeight: '800', fontSize: hp('3'), marginTop: hp('1.5') }]}>Permission form</Text>
                            <Text style={styles.testNameText}>{route.params.projectName}</Text>
                            <Text style={styles.testNameText}>{route.params.testName}</Text>
                        </View>
                        <View style={{ flex: 8, marginHorizontal: wp('8') }}>
                            {
                                title == undefined ?
                                    <TextInput
                                        placeholder={'Custom permission title'}
                                        onChangeText={(e) => { setTitle(e) }}
                                        placeholderTextColor={'#D2EEC770'}
                                        style={styles.customInputTitle}
                                    />
                                    :
                                    <TextInput
                                        placeholder={title}
                                        onChangeText={(e) => { setTitle(e) }}
                                        style={styles.customInputTitle}
                                    />
                            }
                            <TextInput
                                editable={title != undefined && title.length > 0}
                                placeholder={'Permission form explainer text'}
                                ref={responseinputRef}
                                placeholderTextColor={'#D2EEC770'}
                                style={[styles.customInputTitle, { fontWeight: '500', marginTop: hp('4'), marginBottom: hp('2') }]}
                                onChangeText={(e) => { setPermissionExplainText(e) }}
                            />
                            <TextInput
                                placeholder={'Paste in the permission text here'}
                                multiline={true}
                                editable={permissionExplainText != undefined && permissionExplainText.length > 0}
                                placeholderTextColor={'#D2EEC750'}
                                style={styles.permissionText}
                                onChangeText={(e) => { setPermissionText(e) }}
                            />
                            <Text style={[styles.previewText, { marginTop: hp('2') }]}>Preview</Text>
                            <Text style={styles.questionTitle}>{title}</Text>
                            <Text
                                style={[styles.questionTitle, { fontWeight: '600', fontSize: hp('2.2') }]}>{permissionExplainText}</Text>
                            {
                                permissionText != undefined && permissionText.length > 0 ?
                                    <TextInput

                                        placeholder={permissionText}
                                        editable={false}
                                        multiline={true}
                                        scrollEnabled={true}
                                        placeholderTextColor={'#FFFFFF'}
                                        value={permissionText}
                                        style={[styles.permissionText, { paddingTop: hp('1'), paddingBottom: hp('1'), backgroundColor: '#754B85', flexGrow: 5 }]}
                                    /> :
                                    null
                            }
                        </View>

                    </View>
                    <View style={[styles.footer, { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }]}>
                        <TouchableOpacity
                            onPress={() => { setCancelModalVisible(true) }}
                            style={[styles.cancelButton]}>
                            <Text style={[styles.cancelButtonText]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={permissionText == undefined || permissionText.length < 1}
                            onPress={() => { saveQuestion() }}
                            style={[styles.saveButton, {}]}>
                            <Text style={styles.saveButtonText}>Save question</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    /********************************/
    /*Question category Modal*/
    const [newQuestionModalVisible, setNewQuestionModalVisible] = useState(false);
    const [newQuestionCategory, setNewQuestionCategory] = useState();

    const newQuestionModal = () => {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            setNewQuestionCategory()
                            setNewQuestionModalVisible(false)
                        }}
                        style={{ marginLeft: wp('4'), marginTop: hp('4') }}
                    >
                        <MaterialIcons
                            name='arrow-back-ios'
                            size={hp('3')}
                            color={'#B8A4C7'}
                        />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Custom Question</Text>
                    <Text></Text>
                </View>

                <View style={styles.body}>
                    <View style={[styles.bodyTopView, { borderBottomWidth: wp('0.2') }]}>
                        <Text style={[styles.projectNameText, { fontWeight: '800', fontSize: hp('3'), marginTop: hp('1.5') }]}>Select question type</Text>
                        <Text style={styles.testNameText}>{route.params.projectName}</Text>
                        <Text style={styles.testNameText}>{route.params.testName}</Text>
                    </View>
                    <View style={{ flex: 8, marginHorizontal: wp('8') }}>
                        {
                            categoryButton('Multiple Choice question', 'Test takers can select a single response from a list.', 'mcq')
                        }
                        {
                            categoryButton('Free response', 'Test takers can type their answer into a text field', 'input')
                        }
                        {
                            categoryButton('Permissions', 'Create a permission form for test takers to sign and acknowledge', 'permission')
                        }
                    </View>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => {
                            setNewQuestionCategory()
                            setNewQuestionModalVisible(false)
                        }}
                    >
                        <Text style={{ marginLeft: wp('5') }}></Text>
                        <Text style={styles.buttonText}>Cancel</Text>
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
    //return modal category button
    const categoryButton = (title, detail, type) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setNewQuestionCategory(type)
                    setNewQuestionScreenVisible(true)
                    setNewQuestionModalVisible(false)
                }}
            >
                <View style={styles.categoryButtonView}>
                    <View style={{ width: wp('80') }}>
                        <Text style={styles.categoryButtonTitle}>{title}</Text>
                        <Text style={styles.categoryButtonText}>{detail}</Text>
                    </View>
                    <MaterialIcons
                        name='navigate-next'
                        size={hp('3')}
                        color={'#D2EEC7'}
                        style={{ marginLeft: wp('2') }}
                    />
                </View>
            </TouchableOpacity>
        )
    }
    /************/

    /******Break***********/
    //save the questionare to database
    const saveHandler = () => {
        navigation.navigate('postTestSurvery', { projectName: route.params.projectName, testName: route.params.testName, testDescription: route.params.testDescription, question: question })
    }
    /*survery question render*/
    //render mcq options
    const renderMCqOptions = (item, index) => {
        if (index == 0) {
            return (
                <View style={styles.responseView}>
                    <TouchableOpacity style={[styles.responseButton, { width: wp('2.5'), height: hp('1.2'), backgroundColor: '#D2EEC7', borderWidth: wp('0.2'), borderColor: '#754B85' }]}></TouchableOpacity>
                    <Text style={[styles.responseOptionText, { fontSize: hp('1.7'), fontWeight: '500' }]}>{item}</Text>
                </View>
            )
        } else {
            return (
                <View style={styles.responseView}>
                    <TouchableOpacity style={[styles.responseButton, { width: wp('2.5'), height: hp('1.2') }]}></TouchableOpacity>
                    <Text style={[styles.responseOptionText, { fontSize: hp('1.8'), fontWeight: '500' }]}>{item}</Text>
                </View>
            )
        }
    }
    //delete quesiton
    const deleteQuestion = (item, index) => {
        let newArray = []
        for (let i = 0; i < question.length; i++) {
            if (i == index) {
                newArray[i] = question[i + 1]
                index++;
            } else {
                newArray[i] = question[i]
            }
        }
        newArray.splice((newArray.length - 1), 1)
        setQuestion(newArray)
    }
    const suerveyQuestionRender = (item, index) => {
        if (item.type == 'mcq') {
            return (
                <View style={styles.questionView}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', width: wp('60'), alignItems: 'center' }}>
                            <MaterialCommunityIcons
                                name='equal'
                                size={hp('3')}
                                style={[styles.editIcon, { width: wp('10') }]}

                            />
                            <Text style={styles.questionTitleText}>{item.title}</Text>
                        </View>
                        <View style={styles.titleIcons}>
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
                                onPress={() => { deleteQuestion(item, index) }}
                            >
                                <Feather
                                    name='x'
                                    size={hp('2.5')}
                                    style={styles.editIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <FlatList
                            data={item.options}
                            keyExtractor={(item, index) => String(index)}
                            renderItem={({ item, index }) => (
                                renderMCqOptions(item, index)
                            )}
                        />
                    </View>
                </View>
            )
        } else if (item.type == 'input') {
            return (
                <View style={styles.questionView}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', width: wp('60'), alignItems: 'center' }}>
                            <MaterialCommunityIcons
                                name='equal'
                                size={hp('3')}
                                style={[styles.editIcon, { width: wp('10') }]}

                            />
                            <Text style={styles.questionTitleText}>{item.title}</Text>
                        </View>
                        <View style={styles.titleIcons}>
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
                                onPress={() => { deleteQuestion(item, index) }}
                            >
                                <Feather
                                    name='x'
                                    size={hp('2.5')}
                                    style={styles.editIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TextInput
                        placeholder={item.placeholder}
                        style={styles.inputPlaceHolderText}
                        placeholderTextColor={'#D2EEC7'}
                    />
                </View>
            )

        } else if (item.type == 'permission') {
            return (
                <View style={styles.questionView}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', width: wp('60'), alignItems: 'center' }}>
                            <MaterialCommunityIcons
                                name='equal'
                                size={hp('3')}
                                style={[styles.editIcon, { width: wp('10') }]}

                            />
                            <Text style={[styles.questionTitleText]}>{item.title}</Text>
                        </View>
                        <View style={styles.titleIcons}>
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
                                onPress={() => { deleteQuestion(item, index) }}
                            >
                                <Feather
                                    name='x'
                                    size={hp('2.5')}
                                    style={styles.editIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.permissionQuesitnHelprView}>
                        <Text style={styles.previewText}>{item.permissionExplainText}</Text>
                        <MaterialIcons
                            name='navigate-next'
                            size={hp('3')}
                            color={'#D2EEC7'}
                            style={{ marginRight: wp('5') }}
                        />
                    </View>
                </View>
            )
        }
    }
    /***********************/
    return (
        <View style={styles.container}>
            <Modal
                visible={newQuestionModalVisible}
            >
                {
                    newQuestionModal()
                }
            </Modal>
            <Modal
                visible={newQuestionScreenVisible}
            >
                {
                    questionModal()
                }
            </Modal>
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
                <Text style={styles.headerText}>Pre-test-Survery</Text>
                <Text></Text>
            </View>

            <View style={styles.body}>
                <View style={styles.bodyTopView}>
                    <Text style={styles.projectNameText}>{route.params.projectName}</Text>
                    <Text style={styles.testNameText}>{route.params.testName}</Text>
                </View>
                <View style={{ flex: 8, marginHorizontal: wp('8') }}>
                    <Text style={styles.optionListHeadingText}>Test taker demographic and info questions</Text>
                    <TouchableOpacity
                        onPress={() => { setNewQuestionModalVisible(true) }}
                    >
                        <Text style={styles.addButton}>+ Add</Text>
                    </TouchableOpacity>
                    <FlatList
                        data={question}
                        style={{ width: wp('95') }}
                        keyExtractor={(item, index) => String(index)}
                        renderItem={({ item, index }) =>
                            suerveyQuestionRender(item, index)
                        }
                    />
                </View>

            </View>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => { saveHandler() }}
                >
                    <Text style={{ marginLeft: wp('5') }}></Text>
                    <Text style={styles.buttonText}>Save</Text>
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
        flex: 6, backgroundColor: '#340E56',
    },
    bodyTopView: {
        flex: 1.4, borderBottomWidth: wp('0.3'), paddingBottom: hp('3'), marginTop: hp('1'), marginHorizontal: wp('8'), borderBottomColor: '#754B85'
    },
    projectNameText: {
        color: '#FFFFFF', fontSize: hp('3.2'), fontFamily: 'Montserrat-Regular', fontWeight: '800', marginTop: hp('1'),
    },
    testNameText: {
        color: '#B8A4C7', fontSize: hp('2'), fontFamily: 'Montserrat-Regular', fontWeight: '500', letterSpacing: wp('0.3'), marginTop: hp('1')
    },
    optionListHeadingText: {
        color: '#D2EEC7', fontFamily: 'Montserrat-Regular', fontWeight: '800', fontSize: hp('2'), marginVertical: hp('2'), lineHeight: hp('3.5')
    },
    addButton: {
        fontFamily: 'Montserrat-Regular', fontSize: hp('2'), color: '#FFFFFF', fontWeight: '700'
    },
    footer: {
        flex: 1.5, backgroundColor: '#340E56'
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
    /*category selection modal*/
    categoryButtonView: {
        marginVertical: hp('2'), borderBottomWidth: wp('0.2'), paddingVertical: hp('1'), borderBottomColor: '#754B85', flexDirection: 'row', alignItems: 'center'
    },
    categoryButtonTitle: {
        fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontWeight: '800', fontSize: hp('2'), letterSpacing: wp('0.2')
    },
    categoryButtonText: {
        fontFamily: 'Montserrat-Regular', color: '#FFFFFF', marginTop: hp('1'), paddingBottom: hp('2'), fontSize: hp('2'), fontWeight: '500', letterSpacing: wp('0.2'), lineHeight: hp('2.8')
    },
    /*custom question modal*/
    customInputTitle: {
        fontFamily: 'Montserrat-Regular', fontWeight: '600', fontSize: hp('2.5'), borderBottomWidth: wp('0.2'), borderBottomColor: '#D2EEC770', color: '#D2EEC7', marginTop: hp('2.5'), paddingBottom: hp('1')
    },
    addResponseButton: {
        alignSelf: 'flex-end', paddingHorizontal: wp('4'), alignItems: 'center', borderRadius: hp('15'), backgroundColor: '#A1D1AF', paddingVertical: hp('0.5'), marginVertical: hp('1.2')
    },
    addResponseButtonText: {
        fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontSize: hp('1.5'), paddingVertical: hp('0.5'), fontWeight: '600', letterSpacing: wp('0.3')
    },
    optionButton: {
        backgroundColor: '#FFFFFF30', borderRadius: hp('30'), width: wp('5'), height: hp('2.5'), marginTop: hp('2')
    },
    previewText: {
        color: '#F1FCF0', fontFamily: 'Montserrat-Regular', fontSize: hp('2.5'), fontWeight: '500', letterSpacing: wp('0.2'), marginBottom: hp('2')
    },
    questionTitle: {
        color: '#F1FCF0', fontFamily: 'Montserrat-Regular', fontSize: hp('2.8'), fontWeight: '800', letterSpacing: wp('0.3'), marginHorizontal: wp('5'), marginVertical: hp('1')
    },
    responseView: {
        flexDirection: 'row', alignItems: 'center', marginHorizontal: wp('8'), marginVertical: hp('0.5')
    },
    responseButton: {
        width: wp('4'), height: hp('2'), backgroundColor: '#754B85', borderRadius: hp('15'), marginRight: wp('4')
    },
    responseOptionText: {
        fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontWeight: '600', fontSize: hp('2.5'), letterSpacing: wp('0.3')
    },
    cancelButton: {
        borderWidth: wp('0.4'), borderColor: '#D2EEC7', paddingHorizontal: wp('4'), paddingVertical: hp('1.5'), borderRadius: hp('4')
    },
    cancelButtonText: {
        fontFamily: 'Montserrat-Regular', color: '#D2EEC7', fontWeight: '600', fontSize: hp('2'), letterSpacing: wp('0.1')
    },
    saveButton: {
        backgroundColor: '#D2EEC790', paddingHorizontal: wp('4'), paddingVertical: hp('1.7'), borderRadius: hp('15')
    },
    saveButtonText: {
        fontFamily: 'Montserrat-Regular', color: '#340E56', fontWeight: '600', fontSize: hp('2'), letterSpacing: wp('0.2')
    },
    addQuestionModalView: {
        flex: 1, justifyContent: 'center', marginBottom: hp('20'), backgroundColor: '#340E5690',
    },
    cancelModal: {
        alignSelf: 'center', backgroundColor: 'white', paddingHorizontal: wp('10'), paddingVertical: hp('1'), backgroundColor: '#F1FCF0', borderRadius: hp('3'), shadowColor: "#000", shadowOffset: { width: 0, height: hp('1.5'), }, shadowOpacity: 0.32, shadowRadius: 5.46, elevation: 9,
    },
    cancelModalTitle: {
        fontFamily: 'Montserrat-Regular', color: '#2D0A4B', fontWeight: '700', fontSize: hp('2.5'), paddingVertical: hp('1'), width: wp('75'), letterSpacing: wp('0.1')
    },
    cancelModalText: {
        fontFamily: 'Montserrat-Regular', color: '#2D0A4B', fontWeight: '500', fontSize: hp('1.8'), paddingTop: hp('4'), paddingBottom: hp('10'), width: wp('70'), letterSpacing: wp('0.1')
    },
    cancelModalButtonView: {
        flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: hp('1'), paddingBottom: hp('3'), alignItems: 'center'
    },
    cancelModalDeleteButton: {
        borderWidth: wp('0.4'), borderRadius: hp('12'), borderColor: '#FF41B1', paddingHorizontal: wp('2.5'), paddingVertical: hp('1.5'), alignItems: 'center'
    },
    cancelModalDeleteButtonText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '600', color: '#FF41B1'
    },
    cancelModalCancelButton: {
        borderWidth: wp('0.25'), borderRadius: hp('12'), borderColor: '#2D0A4B', paddingHorizontal: wp('5'), paddingVertical: hp('1.5'), alignItems: 'center', backgroundColor: '#2D0A4B'
    },
    cancelModalCancelButtonText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '600', color: '#FFFFFF',
    },
    permissionText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '500', fontSize: hp('1.9'), backgroundColor: '#754B8530', textAlign: 'center', borderRadius: hp('2'), paddingTop: hp('2'), paddingBottom: hp('2'), height: hp('8'), marginTop: hp('1'), color: '#FFFFFF', letterSpacing: wp('0.2')
    },
    //question render
    questionView: {
        marginVertical: hp('1')
    },
    titleIcons: {
        flexDirection: 'row', alignSelf: 'center', paddingLeft: wp('10')
    },
    questionTitleText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '800', fontSize: hp('2.4'), color: '#FFFFFF', marginBottom: hp('1'), letterSpacing: wp('0.1'), width: wp('48'), paddingVertical: hp('1')
    },
    editIcon: {
        color: '#FFFFFF40', width: wp('8'), borderBottomWidth: wp('0.2'),
    },
    inputPlaceHolderText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '500', fontSize: hp('2'), borderBottomWidth: wp('0.2'), borderBottomColor: '#D2EEC7', paddingBottom: hp('1'), marginVertical: hp('1'), marginHorizontal: wp('8'), letterSpacing: wp('0.1'), width: wp('50')
    },
    permissionQuesitnHelprView: {
        marginHorizontal: wp('10'), flexDirection: 'row', alignItems: 'center'
    },
    previewText: {
        fontFamily: 'Montserrat-Regular', fontWeight: '500', color: '#FFFFFF', fontSize: hp('1.9'), letterSpacing: wp('0.1')
    },


})