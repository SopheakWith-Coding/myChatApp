import React from 'react';
import {View, FlatList, ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Card from './components/userList';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authUserItem: {},
      users: [],
      UserItem: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getFriendUsers();
    this.getAuthUserItem();
  }

  getFriendUsers() {
    const authUserID = auth().currentUser.uid;
    firestore()
      .collection('channels')
      .where('owner', '==', authUserID)
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            name: '',
            profileImage: '',
            latestMessage: {text: ''},
            ...documentSnapshot.data(),
          };
        });
        this.setState({users: threads});
        this.setState({loading: true});
      });
  }

  getAuthUserItem = async () => {
    const authUserID = auth().currentUser.uid;

    firestore()
      .collection('users')
      .where('uuid', '==', authUserID)
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            ...documentSnapshot.data(),
          };
        });
        threads.map((item) => {
          this.setState({authUserItem: item});
        });
      });
  };

  navigateToChatRoom(data) {
    const {navigation} = this.props;

    navigation.navigate('ChatRoom', data);
  }

  renderItem = (item) => {
    const {authUserItem} = this.state;
    const type = item.type;
    const chat_id = item.room_id;
    const image = item.profileImage;

    return (
      <Card
        onPress={() =>
          this.navigateToChatRoom({
            type,
            item,
            chat_id,
            authUserItem,
            title: `${item.name}`,
          })
        }
        image={image}
        item={item}
      />
    );
  };

  render() {
    const {users, loading} = this.state;
    console.log(loading);
    const sortUser = users.sort(function (a, b) {
      return b.latestMessage.createdAt - a.latestMessage.createdAt;
    });

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {loading ? (
          <FlatList
            data={sortUser}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => this.renderItem(item)}
          />
        ) : (
          <ActivityIndicator size="large" />
        )}
      </View>
    );
  }
}
