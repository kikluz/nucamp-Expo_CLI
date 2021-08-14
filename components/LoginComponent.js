import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Input, CheckBox, Button, Icon } from 'react-native-elements';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { createBottomTabNavigator, createTabNavigator } from 'react-navigation-tabs';
import { baseUrl } from '../shared/baseUrl';
import * as ImageManipulator from 'expo-image-manipulator';


// Login component 
class LoginTab extends Component {

    constructor(props) {
        super(props);
        // Use state to hold user name and password (temporarily)
        this.state = {
            // initialize to empty strings 
            username: '',
            password: '',
            // use state to hold the value of remember me  as a false
            remember: false
        };
    }
    // included as a screen in the navigation 
    static navigationOptions = {
        title: 'Login',
        tabBarIcon: ({ tintColor }) => (
            <Icon
                name='sign-in'
                type='font-awesome'
                iconStyle={{ color: tintColor }}
            />
        )
    }

    // handleLogin event hadler for with the loging button
    handleLogin() {
        // Log the state to the console
        console.log(JSON.stringify(this.state));
        // check if the remember me CheckBox is checked
        if (this.state.remember) {
            // if it is save the username nad password to SecureStore
            SecureStore.setItemAsync(
                // first argument this will be the key 
                'userinfo',
                // convert to json string before to store 
                JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
                // add a catch block and error will pass as an argument 
            ).catch(error => console.log('Could not safe user info', error));
        } else {
            // delete any data stored under the key userinfo
            SecureStore.deleteItemAsync('userinfo')
                .catch(error => console.log('Could not delete usere info', error));
        }
    }

    // ensure that the userinfo is retrieved from the secure store  when conponent mounts
    componentDidMount() {
        // check if there is any data saved under the key userinfo
        SecureStore.getItemAsync('userinfo')
            // access the value with then() method
            .then(userdata => {
                // change as an javascript object  using the parse() method
                const userinfo = JSON.parse(userdata);
                // check if  non-null truthy value 
                if (userinfo) {
                    // if so update the loging component state from the userinfo Object 
                    this.setState({ username: userinfo.username });
                    this.setState({ password: userinfo.password }); 
                    this.setState({ remember: true })
                }
            });
    }

    render() {
        return (
            // Fomr inside render method 
            <View style={styles.container}>
                <Input
                    placeholder='Username'
                    leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                    // whenever the text value for input is changed, will update the username in the state
                    // using the setState
                    onChangeText={username => this.setState({ username })}
                    // set the value so reflects the state which it makes a conttrol component
                    value={this.state.username}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />

                <Input
                    placeholder='password'
                    leftIcon={{ type: 'font-awesome', name: 'key' }}
                    onChangeText={password => this.setState({ password })}
                    value={this.state.password}
                    containerStyle={styles.formInput}
                    leftIconContainerStyle={styles.formIcon}
                />

                <CheckBox title="Remember me" center
                    checked={this.state.remember}
                    // change the state of wherever it currenlty is if its false or true
                    onPress={() => this.setState({ remember: !this.state.remember })}
                    containerStyle={styles.formCheckBox}
                />

                <View style={styles.formButton} >
                    <Button
                        // return the handleLogin() method 
                        onPress={() => this.handleLogin()}
                        title='Login'
                        icon={
                            <Icon
                                name="sign-in"
                                type="font-awesome"
                                color="#fff"
                                iconStyle={{ marginRight: 10 }}
                            />
                        }
                        buttonStyle={{ backgroundColor: '#5637DD' }}
                    />
                </View>

                <View style={styles.formButton} >
                    <Button
                        // register buttom (can be destructuring) 
                        onPress={() => this.props.navigation.navigate('Register')}
                        title='Register'
                        type='clear'
                        icon={
                            <Icon
                                name="user-plus"
                                type="font-awesome"
                                color="blue"
                                iconStyle={{ marginRight: 10 }}
                            />
                        }
                        titleStyle={{ color: 'blue' }}
                    />
                </View>

            </View>
        );
    }
}

// Register tab component 
class RegisterTab extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            fisrname: '',
            lastname: '',
            emial: '',
            remember: false,
            imageUrl: baseUrl + 'images/logo.png'
        };
    }

    static navigationOptions = {
        title: 'Register',
        tabBarIcon: ({ tintColor }) => (
            <Icon
                name='user-plus'
                type='font-awesome'
                iconStyle={{ color: tintColor }}
            />
        )
    }


    // get image from camara
    getImageFromCamera = async () => {
        // this allow to use the camara 
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        // permission to allow us to read from and to the camara roll 
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted') {
            const capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1]
            });
            if (!capturedImage.cancelled) {
                console.log(capturedImage);
                // call to setState where the imageUrl state property is being set to capturedImage.uri.
                //  Delete this line and replace it with a call to the processImage method, passing it the capturedImage.uri as its sole argument.
                this.setState({ imageUrl: capturedImage.uri });
            }
        }
    }

    // TASK 2 Create async method: Create an asynchronous method named getImageFromGallery
    //------------------------------------------------------------------------------------------------
    getImageFromGallery = async () => {
        // permission to allow us to read from and to the camara roll 
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraRollPermission.status === 'granted') {
            const capturedImage = await  ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [1, 1]
            });
            if (!capturedImage.cancelled) {
                console.log(capturedImage);
                // call to setState where the imageUrl state property is being set to capturedImage.uri.
                //  Delete this line and replace it with a call to the processImage method, passing it the capturedImage.uri as its sole argument.
                // this.setState({ imageUrl: capturedImage.uri });
                this.processImage(capturedImage.uri)
            }
        }
    }

     processImage = async (imgUri) => {

         const processedImage = await ImageManipulator.manipulateAsync(imgUri, [{resize: {
             width: 400 }}], { format: ImageManipulator.SaveFormat.PNG });

            console.log(processedImage);

         this.setState({imgUri: processedImage.uri})
    }

    

    handleRegister() {
        // Log the state to the console
        console.log(JSON.stringify(this.state));
        // check if the remember me CheckBox is checked
        if (this.state.remember) {
            // if it is save the username nad password to SecureStore
            SecureStore.setItemAsync(
                // first argument this will be the key 
                'userinfo',
                // convert to json string before to store 
                JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
                // add a catch block and error will pass as an argument 
            ).catch(error => console.log('Could not safe user info', error));
        } else {
            // delete any data stored under the key userinfo
            SecureStore.deleteItemAsync('userinfo')
                .catch(error => console.log('Could not delete usere info', error)
                );
        }
    }

    render() {
        return (

            <ScrollView>
                <View style={styles.container}>

                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: this.state.imageUrl }}
                            loadingIndicatorSource={require('./images/logo.png')}
                            style={styles.image}
                        />
                        <Button
                            title='Camera'
                            onPress={this.getImageFromCamera}
                        />
                        {/* TASK 2 */}
                        <Button
                            title='Gallery'
                            onPress={this.getImageFromGallery}
                        />
                    </View>

                    <Input
                        placeholder='Username'
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={username => this.setState({ username })}
                        value={this.state.username}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <Input
                        placeholder='Password'
                        leftIcon={{ type: 'font-awesome', name: 'key' }}
                        onChangeText={password => this.setState({ password })}
                        value={this.state.password}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <Input
                        placeholder='First Name'
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={firstname => this.setState({ firstname })}
                        value={this.state.firstname}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <Input
                        placeholder='Last Name'
                        leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                        onChangeText={lastname => this.setState({ lastname })}
                        value={this.state.lastname}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <Input
                        placeholder='Email'
                        leftIcon={{ type: 'font-awesome', name: 'envelope-o' }}
                        onChangeText={email => this.setState({ email })}
                        value={this.state.email}
                        containerStyle={styles.formInput}
                        leftIconContainerStyle={styles.formIcon}
                    />
                    <CheckBox
                        title='Remember Me'
                        center
                        checked={this.state.remember}
                        onPress={() => this.setState({ remember: !this.state.remember })}
                        containerStyle={styles.formCheckbox}
                    />
                    <View style={styles.formButton}>
                        <Button
                            onPress={() => this.handleRegister()}
                            title='Register'
                            icon={
                                <Icon
                                    name='user-plus'
                                    type='font-awesome'
                                    color='#fff'
                                    iconStyle={{ marginRight: 10 }}
                                />
                            }
                            buttonStyle={{ backgroundColor: '#5637DD' }}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}
//  create a new constant Login
const Login = createBottomTabNavigator(
    {
        Login: LoginTab,
        Register: RegisterTab
    },
    {
        tabBarOptions: {
            activeBackgroundColor: '#5637DD',
            inactiveBackgroundColor: '#cec8ff',
            activeTintColor: '#fff',
            inactiveTintColor: '#808080',
            labelStyle: { fontSize: 16 }
        }
    }
);

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin: 10
    },
    formIcon: { marginRight: 10 },
    formInput: { padding: 8 },
    formCheckBox: {
        margin: 8,
        backgroundColor: null
    },
    formButton: {
        margin: 20,
        marginRight: 40,
        marginLeft: 40
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: 10,
    },
    image: {
        width: 60,
        height: 60
    }
});

export default Login;