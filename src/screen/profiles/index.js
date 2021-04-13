import React from 'react';
import {Platform} from 'react-native';
import auth from '@react-native-firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ViewProfile from './components/viewProfile';

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.authUserItem();
  }

  authUserItem = async () => {
    const authUid = auth().currentUser.uid;
    firestore()
      .collection('users')
      .where('uuid', '==', authUid)
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            ...documentSnapshot.data(),
          };
        });
        threads.map((item) => {
          this.setState({users: item});
        });
      });
  };

  Loutout = () => {
    auth().signOut();
  };

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
      const authUid = auth().currentUser.uid;
      firestore().collection('users').doc(authUid).update({
        profileImage: url,
      });
      this.authUserItem();
    });
  };

  render() {
    const {users} = this.state;
    const image = users.profileImage;
    return <ViewProfile users={users} image={image} onPress={this.Loutout} />;
  }
}
