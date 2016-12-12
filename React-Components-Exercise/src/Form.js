import React from 'react';

let Form = React.createClass ({
    render:function(){
        return (
            <form onSubmit={this.props.onSubmit}>
                <input type="text"/>
                <input type="submit" defaultValue='Submit'/>
            </form>
        )
    }
});
let List = React.createClass ({
    render:function(){
        let counter = 0;
        return (
            <ul>
                {
                    this.props.listValues.map(name => (<li key={counter++}>{name}</li>))
                }
            </ul>
        )
    }
});


export default Form;