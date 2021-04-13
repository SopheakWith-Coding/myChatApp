import React from 'react';
import {Platform} from 'react-native';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import SignupForm from './components/signupForm';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phonenumber: '',
      day: '',
      month: '',
      year: '',
      password: '',
      confirmPassword: '',
      uuid: '',
      profileImage: null,
    };
  }

  handleChoosePhoto = async () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(async (image) => {
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.uri;
      const uploadTats = storage().ref(`profileImage/${imageUri}`);
      await uploadTats.putFile(imageUri);
      const url = await storage()
        .ref(`profileImage/${imageUri}`)
        .getDownloadURL();
      this.setState({profileImage: url});
    });
  };

  onSignUp = () => {
    const {
      firstName,
      lastName,
      email,
      phonenumber,
      day,
      month,
      year,
      password,
      profileImage,
    } = this.state;
    const placeholderImage =
      'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=';
    const imagePath = profileImage ? profileImage : placeholderImage;
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const uid = user.user.uid;
        firestore()
          .collection('users')
          .doc(`${uid}`)
          .set({
            name: firstName + ' ' + lastName,
            email: email,
            phonenumber: phonenumber,
            dob: day + ' ' + month + ' ' + year,
            password: password,
            profileImage: imagePath,
            uuid: uid,
          })
          .then(() => console.log('Data set.'));
      })
      .catch((err) => {
        if (err.code === 'auth/email-already-in-use') {
          alert('Email is already use.');
        } else if (err.code === 'auth/weak-password') {
          alert('The password is too weak.');
        }
      });
  };

  validation() {
    const {
      firstName,
      lastName,
      email,
      phonenumber,
      day,
      month,
      year,
      password,
      confirmPassword,
    } = this.state;

    const passwordAndConfirmPassword =
      password.length !== 0 &&
      confirmPassword.length !== 0 &&
      password === confirmPassword;

    const firstNameAndLastName =
      firstName.length !== 0 && lastName.length !== 0;

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const emailAndPhoneNumber = reg.test(email) && phonenumber.length !== 0;
    const datOfBirth =
      day.length !== 0 && month.length !== 0 && year.length !== 0;

    if (
      passwordAndConfirmPassword &&
      firstNameAndLastName &&
      emailAndPhoneNumber &&
      datOfBirth
    ) {
      return false;
    }

    return true;
  }

  render() {
    const {profileImage} = this.state;

    const placeholderImage =
      'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=';

    const imagePath = profileImage ? profileImage : placeholderImage;

    return (
      <SignupForm
        imageOnPress={() => this.handleChoosePhoto()}
        imagePath={imagePath}
        firstNameOnChangeText={(firstName) =>
          this.setState({firstName: firstName})
        }
        lastNameOnChangeText={(lastName) => this.setState({lastName: lastName})}
        emailOnChangeText={(email) => this.setState({email: email})}
        phoneOnChangeText={(phonenumber) =>
          this.setState({phonenumber: phonenumber})
        }
        dayOnChangeText={(day) => this.setState({day: day})}
        monthOnChangeText={(month) => this.setState({month: month})}
        yearOnChangeText={(year) => this.setState({year: year})}
        passwordOnChangeText={(password) => this.setState({password})}
        conformPasswordOnChangeText={(confirmPassword) =>
          this.setState({confirmPassword})
        }
        signupOnPress={this.onSignUp}
        disabled={this.validation()}
      />
    );
  }
}

export default Signup;
