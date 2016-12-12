import React from 'react';

class TitleBar extends React.Component{
    constructor (props){
        super(props);
        this.state = {
            display:'block'
        };
        this.handleToggle = this.handleToggle.bind(this);
    }
    handleToggle(){
         if(this.state.display === 'block'){
            this.setState({
                display:'none'
            })
        } else {
             this.setState({
                 display:'block'
             })
         }
    }
    render ()  {
        let display = {display:this.state.display};
        console.log(this.state.display);
        let counter = 0;
        return <header className="header">
            <div className="header-row">
                <a className="button" onClick={this.handleToggle}>&#9776;</a>
                <span className="title">{this.props.title}</span>
            </div>
            <div className="drawer" style={display} >
                <nav className="menu">
                    {
                        this.props.links.map(([href,name]) => (<a key={counter++} className="menu-link" href={href}>{name}</a>))
                    }
                </nav>
            </div>
                <p>{this.state.name}</p>
        </header>


    }
}

export default TitleBar;
