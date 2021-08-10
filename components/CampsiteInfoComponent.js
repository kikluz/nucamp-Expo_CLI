import React, { Component } from 'react';
// TASK ONE
import { 
    Text, View, ScrollView, StyleSheet, Share, 
    Button, FlatList, Modal, Alert, PanResponder  
    } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state => {
    return {
        // request as a props 
        campsites: state.campsites,
        comments: state.comments,
        favorites: state.favorites
    };
};


// TASK 3 Dispatch the new postComment action creator
const mapDispatchToProps = {
    postFavorite: campsiteId => (postFavorite(campsiteId)),

    // Add postComment, passing the campsiteId, rating, author, and text as parameters.
    postComment: (campsiteId, rating, author, text) => (postComment(campsiteId, rating, author, text))
};

function RenderCampsite(props) {

    // create a ref  using theReact.createRef() method 
    // so ref point to animatable Component
    const view = React.createRef();

    const { campsite } = props;
    // reconizedDrag arrow function take parameter an Object and destructure from it
    // a property name dx(distance of a gesture across the x-axis ) use ternary operator
    // return true is value is less then -200 and flase if ist NOT
    const recognizeDrag = ({dx}) => (dx < -200) ? true : false;

    const recognizeComment = ({dx}) => (dx > 200) ? true : false;

    const panResponder = PanResponder.create({
        // active the pan responder to respond to gestures on the component 
        onStartShouldSetPanResponder: () => true,
        // panHandlers, trigger when gesture fist recognised
        onPanResponderGrant: () => {
            // use ref, the animatable view Component and refert to the 
            // current mounted instance of this component, call an animatable fucntion
            view.current.rubberBand(1000)
            // use promise wheter is finishe or it is cnacelled
                .then(endState => console.log(endState.finished ? 'finished' : 'cnacel'));
        },  
        // Event handler, set parameters e (event), gestureState, holding values 
        onPanResponderEnd: (e, gestureState) => {
            console.log('pan responder end', gestureState);
            // if the gesture was more than 200 pixels to the left 
            if (recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + campsite.name + ' to favorites?',
                    // array which holds objects to configure the alert buttons
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => console.log('Cancel Pressed')
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ?
                                console.log('Already set as a favorite') : props.markFavorite()
                        }
                    ],
                    // user can not tap outside of the alert box to close it 
                    { cancelable: false }
                );
            }
            else if(recognizeComment(gestureState)){
                props.onShowModal();
            }
            return true;
        }
    });

    // share campsite, three paramaters
    const shareCampsite = (title, message, url) => {
        // we use the share AIP's 
        Share.share({
            title,
            message: `${title}: ${message} ${url}`,
            url
        },{
            dialogTitle: 'Share ' + title
        });
    }

    if (campsite) {
        return (

            <Animatable.View 
                animation='fadeInDown' duration={2000} delay={1000}
                // setup ref prop with value View
                ref={view}
                // use spread syntax to spread out the panResponder panHandlers, conbine them into one Object
                {...panResponder.panHandlers}>

                <Card featuredTitle={campsite.name} image={{ uri: baseUrl + campsite.image }}>
                
                    <Text style={{ margin: 10 }}>
                        {campsite.description}
                    </Text>

                    <View style={styles.cardRow}>
                        <Icon name={props.favorite ? 'heart' : 'heart-o'} type='font-awesome' color='#f50'
                            raised
                            reverse
                            onPress={() => props.favorite ?
                                console.log('Already set as a favorite') : props.markFavorite()}
                        />

                        {/* TASK ONEweek 2 */}
                        <Icon name={'pencil'} type='font-awesome' color='#5637DD' raised reverse
                            onPress={() => props.onShowModal()}
                        />

                        <Icon
                            name={'share'} type='font-awesome' color='#5637DD' raised reverse
                            onPress={() => shareCampsite(
                                    campsite.name, 
                                    campsite.description,
                                    baseUrl + campsite.image
                                )
                            }
                        />
                    </View>
                </Card>

            </Animatable.View>
        );
    }
    return <View />;
} 

function RenderComments({ comments }) {

    const renderCommentItem = ({ item }) => {
        return (
            <View style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                {/* TASK 2 */}

                <Rating
                    imageSize={10}
                    startingValue={item.rating}
                    style={{ alignItems: 'flex-start', paddingVertical: '5%' }}
                    readonly

                />

                <Text style={{ fontSize: 12 }}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    };


    return (
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
            <Card title='Comments'>
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}



class CampsiteInfo extends Component {

    // TASK ONE create a constructor and initialize a state property
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            // TASK 2
            rating: 5,
            author: '',
            text: ''
        }
    }


    // TASK ONE Event handler to show and hide the Modal: Add a toggleModal method to the CampsiteInfo component
    toggleModal() {
        // check surrent state of property and toggle it to opposite using setState
        this.setState({ showModal: !this.state.showModal });

    }

    // TASK 2 Handle form submission
    // TASK 3 Use postComment action creator instead of logging the new comment to the console
    handleComment(campsiteId) {

        // Call postComment, passing the campsiteId argument along with the three form values from the state.
        this.props.postComment(campsiteId, this.state.rating, this.state.author, this.state.text);
        this.toggleModal();

    }
    // TASK 2 Reset form: 
    resetForm() {
        this.setState({
            showModal: false,
            rating: 5,
            author: '',
            text: ''
        })
    }

    markFavorite(campsiteId) {
        this.props.postFavorite(campsiteId);
    }

    static navigationOptions = {
        title: 'Campsite Information'
    }

    render() {
        const campsiteId = this.props.navigation.getParam('campsiteId');
        const campsite = this.props.campsites.campsites.filter(campsite => campsite.id === campsiteId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.campsiteId === campsiteId);
        return (
            <ScrollView>
                <RenderCampsite campsite={campsite}
                    // iclude will return  boolean true or false
                    favorite={this.props.favorites.includes(campsiteId)}
                    markFavorite={() => this.markFavorite(campsiteId)}
                    onShowModal={() => this.toggleModal()}
                />
                <RenderComments comments={comments} />

                {/* TASK ONE */}
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>

                        {/* TASK 2 */}

                        <Rating

                            showRating={this.state.rating}
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={rating => this.setState({ rating: rating })}
                            style={{ paddingVertical: 10 }}
                        />

                        <Input
                            placeholder="Author"
                            leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            style={styles}
                            onChangeText={author => this.setState({ author: author })}
                            value={this.state.author}  
                        />

                        <Input
                            placeholder="Comment"
                            leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                            leftIconContainerStyle={{ paddingRight: 10 }}
                            style={styles}
                            onChangeText={text => this.setState({ text: text })}
                            value={this.state.text}   
                        />
                        <View style={{ margin: 10 }}>
                            <Button
                                onPress={() => {
                                    this.handleComment(campsiteId);
                                    this.resetForm();
                                }}

                                color='#5637DD'
                                title='Submit'
                            />
                        </View>

                        <View style={{ margin: 10 }}>
                            <Button
                                onPress={() => {
                                    this.toggleModal();
                                    this.resetForm();
                                }}
                                color='#808080'
                                title='Cancel'
                            />

                        </View>
                    </View>
                </Modal>
            </ScrollView>

        );
    }
}


const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },

    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#5637DD',
        textAlign: 'center',
        color: '#FFF',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CampsiteInfo);