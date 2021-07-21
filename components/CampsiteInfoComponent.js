import React from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';


// desdructure it in the parameter list 
function RenderCampsite({campsite}){
    // make sure not null or undefined check with if statement
    if(campsite){
        return (
            <Card featuredTitle={campsite.name} image={require('./images/react-lake.jpg')}>
                <Text style={{margin: 10}}>
                    {campsite.description}
                </Text>
            </Card>
        );
    }
    return <View />;
}

// fucntional CampsiteInfo component that get props 
function CampsiteInfo(props){
    // we are pulling campsite object and send it to another camponent
    return <RenderCampsite campsite={props.campsite} />;
}

export default CampsiteInfo;