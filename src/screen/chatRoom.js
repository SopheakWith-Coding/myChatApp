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
    const {chatID} = this.props.route.params;
    firestore()
      .collection('messages')
      .where('roomID', '==', chatID)
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
    const {authUserItem} = this.props.route.params;
    const authUserName = authUserItem.name;
    const authUserProfile = authUserItem.profileImage;
    const {chatID} = this.props.route.params;
    const authUid = auth().currentUser.uid;
    const text = messages[0].text;
    const ownerMessage = {
      text: `You: ${text}`,
      createdAt: new Date().getTime(),
    };
    const memberMessage = {
      text: `${authUserItem.name}: ${text}`,
      createdAt: new Date().getTime(),
    };
    firestore()
      .collection('messages')
      .add({
        text,
        createdAt: new Date().getTime(),
        roomID: chatID,
        user: {
          _id: authUid,
          name: authUserName,
          avatar: authUserProfile,
        },
      });
    const channelsRef = firestore().collection('channels');
    channelsRef
      .where('roomID', '==', chatID)
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
  };

  ChatsSend = async (messages) => {
    const {authUserItem} = this.props.route.params;
    const authUserName = authUserItem.name;
    const authUserProfile = authUserItem.profileImage;
    const {chatID} = this.props.route.params;
    const {item} = this.props.route.params;
    const userName = `${item.name}`;
    const authUid = auth().currentUser.uid;
    const chatterID = auth().currentUser.uid;
    const chateeID = item.uuid;
    const text = messages[0].text;
    const welcomeMessage = {
      text: text,
      createdAt: new Date().getTime(),
    };
    const image = item.profileImage;
    const authImage = authUserItem.profileImage;
    const membersID = [];
    membersID.push(chatterID);
    membersID.push(chateeID);
    membersID.sort();
    const channelsRef = firestore().collection('channels');
    const result = await channelsRef
      .where('roomID', '==', chatID)
      .limit(1)
      .get();
    if (result.empty) {
      channelsRef.doc().set({
        uuid: chatterID,
        roomID: chatID,
        name: authUserName,
        profileImage: authImage,
        latestMessage: welcomeMessage,
        members: membersID,
        owner: chateeID,
        type: 'Chats',
      });
      channelsRef.doc().set({
        uuid: chateeID,
        roomID: chatID,
        name: userName,
        profileImage: image,
        latestMessage: welcomeMessage,
        members: membersID,
        owner: chatterID,
        type: 'Chats',
      });
    } else {
      channelsRef
        .where('roomID', '==', chatID)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            channelsRef.doc(doc.id).update({
              latestMessage: welcomeMessage,
            });
          });
        });
    }
    firestore()
      .collection('messages')
      .add({
        text,
        createdAt: new Date().getTime(),
        roomID: chatID,
        user: {
          _id: authUid,
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
      this.ChatsSend(messages);
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
