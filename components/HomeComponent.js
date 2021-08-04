import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, Animated } from 'react-native';
import { Card } from 'react-native-elements';
import { Value } from 'react-native-reanimated';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';


const mapStateToProps = state => {
    return {
        campsites: state.campsites,
        promotions: state.promotions,
        partners: state.partners
    };
};

function RenderItem(props) {
    // destructure the item property
    const {item} = props;

    if (props.isLoading) {
        return <Loading />;
    }
    // check for error massage 
    if (props.errMess) {
        return (
            <View>
                <Text>{props.errMess}</Text>
            </View>
        );
    }

    if (item) {
        return (
            <Card
                featuredTitle={item.name}
                image={{uri: baseUrl + item.image}}
            >
                <Text style={{margin: 10}}>
                    {item.description}
                </Text>
            </Card>
        );
    }
    return <View />;
}

class Home extends Component {
    
    // add constructor to store the Animated Value in the local component state
    constructor(props){
        super(props);
        this.state = {
            scaleValue: new Animated.Value(0)
        };
    }

    // create a method  for timing with two arguments 
    animate(){
        Animated.timing(
            this.state.scaleValue,
            {
                // changes the value from 0 to 1-(100% in terms of scale)
                toValue: 1,
                // duration property set to 1 1/2 seconds 
                duration: 1500,
                // set useNativeDriver to true to improve the performance of Animation library
                useNativeDriver: true
            }
            // chain a method call() to start the run  animation
        ).start();
    }

    // called just onces
    componentDidMount() {
        this.animate();
    }

    static navigationOptions = {
        title: 'Home'
    }

    render() {
        return (
            // Animated.ScrollView gives a ScrollView that is hook up to the animated aip
            // this.state.scaleValue is the dynamic value that will change the animation when running 
            <Animated.ScrollView style={{transform: [{scale: this.state.scaleValue}]}}>
                <RenderItem
                    item={this.props.campsites.campsites.filter(campsite => campsite.featured)[0]}
                    isLoading={this.props.campsites.isLoading}
                    errMess={this.props.campsites.errMess}
                />
                <RenderItem
                    item={this.props.promotions.promotions.filter(promotion => promotion.featured)[0]}
                    isLoading={this.props.promotions.isLoading}
                    errMess={this.props.promotions.errMess}
                />
                <RenderItem
                    item={this.props.partners.partners.filter(partner => partner.featured)[0]}
                    isLoading={this.props.partners.isLoading}
                    errMess={this.props.partners.errMess}
                />
            </Animated.ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);
