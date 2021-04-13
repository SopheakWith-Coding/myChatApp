import React from 'react';
import auth from '@react-native-firebase/auth';
import LoginForm from './components/loginForm';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loading: false,
    };
  }

  onLogin = () => {
    const {email, password} = this.state;
    this.setState({loading: true});
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({loading: false});
      })
      .catch((err) => {
        this.setState({loading: false});
        if (err.code === 'auth/wrong-password') {
          alert('Incorrect Password');
        } else if (err.code === 'auth/invalid-email') {
          alert('Invalid Email');
        } else if (err.code === 'auth/user-not-found') {
          alert('User not found');
        }
      });
  };

  render() {
    const {email, password, loading} = this.state;
    const {navigation} = this.props;
    return (
      <LoginForm
        loading={loading}
        navigation={navigation}
        emailOnChangeText={(email) => this.setState({email: email})}
        passwordOnChangeText={(password) => this.setState({password: password})}
        disabled={email.length === 0 || password.length === 0}
        onPress={() => this.onLogin()}
      />
    );
  }
}

export default Login;
