import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const screenWidth = Dimensions.get('screen').width;

export default class CreateChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.getUsersItems();
  }

  getUsersItems = async () => {
    firestore()
      .collection('users')
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            ...documentSnapshot.data(),
          };
        });
        this.setState({users: threads});
      });
  };

  chat_id = (item) => {
    const sender_id = auth().currentUser.uid;
    const receiver_id = item.uuid;

    const members_id = [];
    members_id.push(sender_id);
    members_id.push(receiver_id);
    members_id.sort();

    return members_id.join('');
  };

  CreateChatRoom = async (call, item, authUserItem) => {
    const userName = `${item.name}`;
    const chat_id = call(item);
    const type = 'Chats';

    this.createFirstIndividualMessages(chat_id);
    this.navigateToChatRoom(type, item, chat_id, authUserItem, userName);
  };

  createFirstIndividualMessages = async (chat_id) => {
    const welcomeMessage = {
      text: "You're friend on chat app",
      createdAt: new Date().getTime(),
    };

    const smgRef = firestore().collection('messages');

    const result = await smgRef.where('room_id', '==', chat_id).limit(1).get();

    if (result.empty) {
      smgRef.doc().set({
        createdAt: new Date().getTime(),
        ...welcomeMessage,
        system: true,
        room_id: chat_id,
      });
    } else {
      smgRef.doc().update({
        createdAt: new Date().getTime(),
        ...welcomeMessage,
        system: true,
        room_id: chat_id,
      });
    }
  };

  navigateToChatRoom(type, item, chat_id, authUserItem, userName) {
    const {navigation} = this.props;

    navigation.navigate('ChatRoom', {
      type,
      item,
      chat_id,
      authUserItem,
      title: userName,
    });
  }

  navigateToNewGroup() {
    const {navigation} = this.props;
    navigation.navigate('New  Group');
  }

  flatListHeader = () => {
    const goToImage = {
      uri:
        'https://icon-library.com/images/greater-than-icon/greater-than-icon-9.jpg',
    };
    const groupImage = {
      uri: 'https://static.thenounproject.com/png/58999-200.png',
    };

    return (
      <TouchableOpacity onPress={() => this.navigateToNewGroup()}>
        <View style={styles.SubContainer}>
          <View style={styles.GroupImageWrapper}>
            <Image
              style={{width: 40, height: 40, borderRadius: 40}}
              source={groupImage}
            />
          </View>
          <View style={styles.GroupTextWrapper}>
            <Text style={styles.TextTitle}>Create a New Group</Text>
          </View>
          <View style={styles.NavigationSignWrapper}>
            <Image
              style={{width: 30, height: 30, borderRadius: 30}}
              source={goToImage}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {users} = this.state;
    const {uid} = auth().currentUser;
    const filterAuthUser = users.filter((val) => val.uuid === uid);
    const filterUser = users.filter((val) => val.uuid !== uid);

    return (
      <View style={styles.container}>
        <FlatList
          ListHeaderComponent={this.flatListHeader()}
          data={filterUser}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            const image = item.profileImage;
            return (
              <React.Fragment>
                {filterAuthUser.map((authUserItem, key) => (
                  <TouchableOpacity
                    key
                    onPress={() =>
                      this.CreateChatRoom(this.chat_id, item, authUserItem)
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
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </React.Fragment>
            );
          }}
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
    marginRight: 15,
    justifyContent: 'center',
    width: screenWidth - 90,
  },
  TextTitle: {
    fontSize: 18,
  },
  ScrollViewContainer: {
    flex: 1,
    backgroundColor: 'red',
    height: 20,
  },
  GroupImageWrapper: {
    marginVertical: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  GroupTextWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    width: screenWidth / 2 + 35,
  },
  NavigationSignWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    width: screenWidth / 8 + 20,
  },
});
