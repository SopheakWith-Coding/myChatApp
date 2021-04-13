import React from 'react';
import {Dimensions, Platform} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      Type: null,
    };
  }

  componentDidMount() {
    this.getTypeChat();
    this.header();
    this.fetchChatMessages();
  }

  fetchChatMessages = () => {
    const {chat_id} = this.props.route.params;

    firestore()
      .collection('messages')
      .where('room_id', '==', chat_id)
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };
          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.displayName,
            };
          }
          return data;
        });
        this.setState({messages: messages});
      });
  };

  header = () => {
    const {navigation} = this.props;

    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
    });
  };

  GroupSend = (messages) => {
    const text = messages[0].text;
    this.createGroupMessages(text);
    this.updateGroupChannels(text);
  };

  createGroupMessages(text) {
    const {authUserItem, chat_id} = this.props.route.params;
    const authUid = auth().currentUser.uid;
    const authUserName = authUserItem.name;
    const authUserProfile = authUserItem.profileImage;

    firestore()
      .collection('messages')
      .add({
        text,
        createdAt: new Date().getTime(),
        room_id: chat_id,
        user: {
          _id: authUid,
          name: authUserName,
          avatar: authUserProfile,
        },
      });
  }

  updateGroupChannels(text) {
    const {authUserItem, chat_id} = this.props.route.params;
    const authUid = auth().currentUser.uid;

    const ownerMessage = {
      text: `You: ${text}`,
      createdAt: new Date().getTime(),
    };

    const memberMessage = {
      text: `${authUserItem.name}: ${text}`,
      createdAt: new Date().getTime(),
    };

    const channelsRef = firestore().collection('channels');
    channelsRef
      .where('room_id', '==', chat_id)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          if (doc.data().owner === authUid) {
            channelsRef.doc(doc.id).update({
              latestMessage: ownerMessage,
            });
          } else {
            channelsRef.doc(doc.id).update({
              latestMessage: memberMessage,
            });
          }
        });
      });
  }

  ChatsSend = async (call, messages) => {
    const {item} = this.props.route.params;
    const members_id = call(item);
    const text = messages[0].text;

    this.createIndividualChannels(text, members_id);
    this.createIndividualMessages(text);
  };

  createIndividualChannels = async (text, members_id) => {
    const {authUserItem, chat_id, item} = this.props.route.params;

    const authUserName = authUserItem.name;
    const authUserProfile = authUserItem.profileImage;

    const sender_id = auth().currentUser.uid;

    const receiver_id = item.uuid;
    const profile = item.profileImage;
    const userName = `${item.name}`;

    const welcomeMessage = {
      text: text,
      createdAt: new Date().getTime(),
    };

    const channelsRef = firestore().collection('channels');
    const result = await channelsRef
      .where('room_id', '==', chat_id)
      .limit(1)
      .get();
    if (result.empty) {
      channelsRef.doc().set({
        uuid: sender_id,
        room_id: chat_id,
        name: authUserName,
        profileImage: authUserProfile,
        latestMessage: welcomeMessage,
        members: members_id,
        owner: receiver_id,
        type: 'Chats',
      });
      channelsRef.doc().set({
        uuid: receiver_id,
        room_id: chat_id,
        name: userName,
        profileImage: profile,
        latestMessage: welcomeMessage,
        members: members_id,
        owner: sender_id,
        type: 'Chats',
      });
    } else {
      channelsRef
        .where('room_id', '==', chat_id)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            channelsRef.doc(doc.id).update({
              latestMessage: welcomeMessage,
            });
          });
        });
    }
  };

  members_id(item) {
    const sender_id = auth().currentUser.uid;
    const receiver_id = item.uuid;

    const members_id = [];

    members_id.push(sender_id);
    members_id.push(receiver_id);
    return members_id.sort();
  }

  createIndividualMessages = (text) => {
    const {authUserItem, chat_id} = this.props.route.params;

    const sender_id = auth().currentUser.uid;

    const authUserName = authUserItem.name;
    const authUserProfile = authUserItem.profileImage;

    const smgRef = firestore().collection('messages');

    smgRef.add({
      text,
      createdAt: new Date().getTime(),
      room_id: chat_id,
      user: {
        _id: sender_id,
        name: authUserName,
        avatar: authUserProfile,
      },
    });
  };

  getTypeChat = () => {
    const {type} = this.props.route.params;

    this.setState({Type: type});
  };

  callSendFunction = (messages) => {
    const {Type} = this.state;

    if (Type == 'Chats') {
      this.ChatsSend(this.members_id, messages);
    } else {
      this.GroupSend(messages);
    }
  };

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {backgroundColor: '#ECF87F'},
          right: {backgroundColor: '#2EB5E0'},
        }}
      />
    );
  };

  render() {
    const authUid = auth().currentUser.uid;
    const {messages} = this.state;

    const sortMessage = messages.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

    const isIphoneX =
      Platform.OS === 'ios' && Dimensions.get('window').height >= 812;

    return (
      <GiftedChat
        bottomOffset={isIphoneX ? 48.5 + 30 : 48.5}
        messages={sortMessage}
        onSend={this.callSendFunction}
        user={{
          _id: authUid,
        }}
        renderBubble={this.renderBubble}
      />
    );
  }
}

export default ChatRoom;
