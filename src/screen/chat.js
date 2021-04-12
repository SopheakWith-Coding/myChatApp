import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';

const screenWidth = Dimensions.get('window').width;

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
      <TouchableOpacity
        onPress={() =>
          this.navigateToChatRoom({
            type,
            item,
            chat_id,
            authUserItem,
            title: `${item.name}`,
          })
        }>
        <View style={styles.SubContainer}>
          <View style={styles.imageWrapper}>
            <Image
              style={{width: 50, height: 50, borderRadius: 50}}
              source={{uri: image}}
            />
          </View>

          <View style={styles.TextWrapper}>
            <Text style={styles.TextTitle}>{item.name}</Text>
            <Text style={styles.TextSubTitle}>
              {item.latestMessage.text.slice(0, 90)}
            </Text>
          </View>
          <View style={styles.TimeWrapper}>
            <Text>
              {moment(item.latestMessage.createdAt).format('hh:mm A')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {users} = this.state;
    const sortUser = users.sort(function (a, b) {
      return b.latestMessage.createdAt - a.latestMessage.createdAt;
    });

    return (
      <View style={styles.container}>
        <FlatList
          data={sortUser}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => this.renderItem(item)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  SubContainer: {
    height: 80,
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  imageWrapper: {
    marginVertical: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  TextWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    width: screenWidth / 2 + 35,
  },
  TimeWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    marginRight: 15,
    width: screenWidth / 8 + 20,
  },
  TextTitle: {
    fontSize: 18,
  },
  TextSubTitle: {
    fontSize: 14,
  },
});
