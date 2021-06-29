import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//screens
//onboardingScreens
import OnBoarding1 from '../screens/onboarding/onboarding1';
import OnBoarding2 from '../screens/onboarding/onboarding2';
import OnBoarding3 from '../screens/onboarding/oboarding3';
import OnBoarding4 from '../screens/onboarding/onboarding4';

//project screens
import ProjectWelcome from '../screens/project/projectWelcome';
import CreateProject from '../screens/project/createProject';

//ux test creation screens
import UxTestName from '../screens/testcreation/uxTestName';
import uxTestDescription from '../screens/testcreation/uxTestDescription';
import preTestSurvery from '../screens/testcreation/preTestSurvey';
import PostTestSurvery from '../screens/testcreation/postTestSurvery';
import NPS from '../screens/testcreation/post-test-surverys/NPS';
import TaskCreation from '../screens/testcreation/taskCreation';
//user management login and signup
import Login from '../screens/user/login'
import Profile from '../screens/user/profile';
//test active screens
import TestActiveWelcome from '../screens/testActive/testActiveWelcome';
import PassDevice from '../screens/testActive/passDevice';
import PreTest from '../screens/testActive/preTest';
import PassDeviceAfterPreTest from '../screens/testActive/passDeviceAfterPretest';
import TaskRecord from '../screens/testActive/taskRecord';
import PassDeviceForNps from '../screens/testActive/PassDeviceForNPs';
import TestActiveNPS from '../screens/testActive/testActiveNps';

const { Navigator, Screen } = createStackNavigator();

const Stack = () => (
    <Navigator>
        {/*Onboarding screens*/}
        <Screen name='onboarding1' component={OnBoarding1} options={{ headerShown: false }} />
        <Screen name='onboarding2' component={OnBoarding2} options={{ headerShown: false }} />
        <Screen name='onboarding3' component={OnBoarding3} options={{ headerShown: false }} />
        <Screen name='onboarding4' component={OnBoarding4} options={{ headerShown: false }} />
         {/*Login Screens*/}
         <Screen name='login' component={Login} options={{ headerShown: false }} />
         <Screen name='profile' component={Profile} options={{ headerShown: false }} />
        {/*project screens here*/}
        <Screen name='projectwelcome' component={ProjectWelcome} options={{ headerShown: false }} />
        <Screen name='createProject' component={CreateProject} options={{ headerShown: false }} />
        {/*UX Test Creation screen*/}
        <Screen name='uxTestName' component={UxTestName} options={{ headerShown: false }} />
        <Screen name='uxTestDescription' component={uxTestDescription} options={{ headerShown: false }} />
        <Screen name='preTestSurvery' component={preTestSurvery} options={{ headerShown: false }} />
        <Screen name='postTestSurvery' component={PostTestSurvery} options={{ headerShown: false }} />
        {/*Post test survery types*/}
        <Screen name='nps' component={NPS} options={{ headerShown: false }} />
        <Screen name='taskcreation' component={TaskCreation} options={{headerShown:false}} />
        {/*Test active screens*/}
        <Screen name='testActiveWelcome' component={TestActiveWelcome} options={{headerShown:false}} />
        <Screen name='passDevice' component={PassDevice} options={{headerShown:false}} />
        <Screen name='preTest' component={PreTest} options={{headerShown:false}} />
        <Screen name='passDeviceAfterPreTest' component={PassDeviceAfterPreTest} options={{headerShown:false}} />
        <Screen name='taskRecord' component={TaskRecord} options={{headerShown:false}} />
        <Screen name='passDeviceForNPs' component={PassDeviceForNps} options={{headerShown:false}} />
        <Screen name='testActiveNps' component={TestActiveNPS} options={{headerShown:false}} />
    </Navigator>
)

const UserStack = () => (
    <NavigationContainer>
        <Stack />
    </NavigationContainer>
)
export default UserStack;