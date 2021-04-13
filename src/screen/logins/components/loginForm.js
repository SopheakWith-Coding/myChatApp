import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const screenWidth = Dimensions.get('screen').width;

export default class LoginForm extends React.Component {
  render() {
    const {
      navigation,
      loading,
      emailOnChangeText,
      passwordOnChangeText,
      disabled,
      onPress,
    } = this.props;
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.SubContainer}>
          <View style={styles.ImageWrapper}>
            <Image
              style={{width: 120, height: 120, borderRadius: 60}}
              source={{
                uri:
                  'https://image.freepik.com/free-vector/colorful-logo-chat_1017-1721.jpg',
              }}
            />
            <Text style={styles.textTitle}>SIGN IN</Text>
          </View>
          <TextInput
            style={styles.TextInput}
            placeholder="Enter your email"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={emailOnChangeText}
          />
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            secureTextEntry
            onChangeText={passwordOnChangeText}
          />
          <View style={styles.ViewButtonWrapper}>
            <View style={styles.ButtonWrapper}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.ButtonTouchableOpacity}
                disabled={disabled}
                onPress={onPress}>
                {loading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text style={styles.ButtonText}>Log In</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.ButtonTouchableOpacity}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.SignUpButton}
                onPress={() => navigation.navigate('Sign Up')}>
                <Text style={styles.ButtonText}>Create an Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  ImageWrapper: {
    marginBottom: 40,
    alignItems: 'center',
  },
  textTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
  },
  SubContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextInput: {
    marginTop: 15,
    lineHeight: 25,
    width: screenWidth - 32,
    padding: 12,
    backgroundColor: 'white',
    fontSize: 18,
    borderRadius: 5,
  },
  ViewButtonWrapper: {
    alignItems: 'center',
    marginTop: 40,
  },
  ButtonWrapper: {
    marginVertical: 15,
  },
  ButtonTouchableOpacity: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    width: screenWidth - 32,
    backgroundColor: '#ffd54f',
  },
  ButtonText: {
    fontSize: 15,
  },
});
