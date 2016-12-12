import React from 'react';
import Form from './Form';
import List from './List';

let App = React.createClass({
    getInitialState:function() {
        return {
            arrayTextValues:[]
        }
    },
    handleSubmit:function(event){
        event.preventDefault();
        let inputTextValue = event.target.children[0].value.split(/\s*,\s*/).filter( name => name !== '');
        this.setState({
            arrayTextValues:inputTextValue
        })
    },
    render: function ()  {
        return <div>
                <Form onSubmit={this.handleSubmit}/>
                <List listValues={this.state.arrayTextValues}/>
               </div>

    }
});

export default App;
