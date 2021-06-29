import React from 'react';
import { View, StyleSheet, Image, StatusBar, Text, SafeAreaView, TouchableOpacity, ImageBackground,} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function OnBoarding3({ navigation }) {

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../assets/icons/boarding/onBoarding3.png')}
                style={{ width: wp('100'), height: hp('100'), }}
            >
                <SafeAreaView style={styles.subView}>
                    <Text style={styles.headingText}>To reach their goal.</Text>
                    <TouchableOpacity
                        onPress={()=>{navigation.navigate('onboarding4')}}
                        style={styles.nextButton}
                    >

                        <Text></Text>
                        <Text style={styles.nextText}>Next</Text>
                        <Image
                            source={require('../../assets/icons/other/navigate-next.png')}
                            style={styles.iconNext}
                        />
                    </TouchableOpacity>
                </SafeAreaView>

            </ImageBackground>
            <StatusBar barStyle='light-content' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: 'black'
    },
    subView: {
        justifyContent: 'space-between', flex: 1, marginHorizontal: wp('4')
    },
    headingText: {
        color: '#D2EEC7', fontFamily: 'Montserrat-Regular', fontSize: hp('2.5'),
        letterSpacing: wp('0.2'), lineHeight: hp('3.2'), fontWeight: '800', marginTop: hp('1'),
        width: wp('40'),textAlign:'left',paddingLeft:wp('2')
    },
    nextButton: {
        borderWidth: wp('0.45'), borderColor: '#D2EEC7', marginBottom: hp('7'), alignSelf: 'center',
        borderRadius: hp('10'),flexDirection:'row',width:wp('65'),justifyContent:'space-between',
        alignItems:'center',paddingVertical:hp('1.5')
        },
    nextText: {
        color: '#D2EEC7', fontFamily: 'Montserrat-Regular', fontWeight: '600', 
        fontSize: hp('2.5'),letterSpacing:wp('0.1')
    }
    , iconNext: {
        width:wp('4'),height:hp('2'),marginRight:wp('5')
    }
})