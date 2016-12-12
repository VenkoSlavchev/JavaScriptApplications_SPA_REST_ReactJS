import React from 'react';

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

export default List;