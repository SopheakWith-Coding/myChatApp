import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  Text,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';

const screenWidth = Dimensions.get('screen').width;

export default class signupForm extends React.Component {
  render() {
    const {
      imageOnPress,
      imagePath,
      firstNameOnChangeText,
      lastNameOnChangeText,
      emailOnChangeText,
      phoneOnChangeText,
      dayOnChangeText,
      monthOnChangeText,
      yearOnChangeText,
      passwordOnChangeText,
      conformPasswordOnChangeText,
      signupOnPress,
      disabled,
    } = this.props;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.Container}>
        <View style={styles.InformationWrapper}>
          <View style={styles.ImageWrapper}>
            <TouchableOpacity activeOpacity={0.5} onPress={imageOnPress}>
              <Image style={styles.styleImage} source={{uri: imagePath}} />
            </TouchableOpacity>
          </View>
          <View style={styles.FullNameWrapper}>
            <TextInput
              style={styles.FullNameInput}
              placeholder="Enter first  name"
              autoCorrect={false}
              onChangeText={firstNameOnChangeText}
            />
            <TextInput
              style={styles.FullNameInput}
              placeholder="Enter last name"
              autoCorrect={false}
              onChangeText={lastNameOnChangeText}
            />
          </View>
          <View>
            <TextInput
              style={styles.EmailPhoneNumberInput}
              placeholder="Enter your email"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={emailOnChangeText}
            />
            <TextInput
              style={styles.EmailPhoneNumberInput}
              placeholder="Phone Number"
              textContentType={'oneTimeCode'}
              onChangeText={phoneOnChangeText}
            />
          </View>
          <View style={styles.DateOfBirthWrapper}>
            <TextInput
              style={styles.DateOfBirthInput}
              placeholder="Day"
              textContentType={'oneTimeCode'}
              onChangeText={dayOnChangeText}
            />
            <TextInput
              style={styles.DateOfBirthInput}
              placeholder="Month"
              textContentType={'oneTimeCode'}
              onChangeText={monthOnChangeText}
            />
            <TextInput
              style={styles.DateOfBirthInput}
              placeholder="Year"
              textContentType={'oneTimeCode'}
              onChangeText={yearOnChangeText}
            />
          </View>
          <View style={styles.PasswordWrapper}>
            <TextInput
              style={styles.PasswordInput}
              placeholder="Password"
              textContentType={'oneTimeCode'}
              secureTextEntry
              onChangeText={passwordOnChangeText}
            />
            <TextInput
              style={styles.PasswordInput}
              placeholder="Confirm password"
              textContentType={'oneTimeCode'}
              secureTextEntry
              onChangeText={conformPasswordOnChangeText}
            />
          </View>
          <View style={styles.SignUpWrapper}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.SignUpButton}
              disabled={disabled}
              onPress={signupOnPress}>
              <Text style={styles.ButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  ImageWrapper: {
    marginVertical: 20,
    alignItems: 'center',
  },
  styleImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  InformationWrapper: {
    paddingHorizontal: 16,
  },
  FullNameWrapper: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  FullNameInput: {
    fontSize: 15,
    paddingLeft: 10,
    borderRadius: 7,
    paddingVertical: 15,
    backgroundColor: 'white',
    width: screenWidth / 2 - 25,
  },
  EmailPhoneNumberInput: {
    fontSize: 15,
    paddingLeft: 10,
    marginBottom: 10,
    borderRadius: 7,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  DateOfBirthWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  DateOfBirthInput: {
    borderRadius: 7,
    paddingLeft: 10,
    marginBottom: 10,
    paddingVertical: 15,
    backgroundColor: 'white',
    width: screenWidth / 2 - 90,
  },
  PasswordWrapper: {},
  PasswordInput: {
    fontSize: 15,
    paddingLeft: 10,
    marginBottom: 10,
    borderRadius: 7,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  SignUpWrapper: {
    alignItems: 'center',
    marginTop: 40,
  },
  SignUpButton: {
    borderRadius: 10,
    marginBottom: 120,
    paddingVertical: 15,
    alignItems: 'center',
    width: screenWidth - 32,
    backgroundColor: '#ffd54f',
  },
  ButtonText: {
    fontSize: 15,
    color: 'black',
  },
});
