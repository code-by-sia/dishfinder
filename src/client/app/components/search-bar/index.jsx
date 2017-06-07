import React , {Component} from 'react';
import './index.css';

class Searchbar extends Component {

  constructor(props){
    super(props);

    const subject = (this.props.value &&  this.props.value.subject) || '';
    const location = (this.props.value &&  this.props.value.location) || '';

    this.state = {
      subject,
      location
    };
  }

  onSubjectChange(subject){
    this.setState({subject});
  }

  onLocationChange(location){
    this.setState({location});
  }


  componentDidUpdate(prevProps,prevState){
    if(prevState !== this.state){
      this.props.onChange && this.props.onChange(this.state);
    }
  }

  componentWillReceiveProps(nextProps){
    const location = nextProps.value && nextProps.value.location || '';

    if(location !== this.state.location)
    {
      this.setState({location});
    }

  }

  onKeyPress(event){
    if(event.keyCode == 13 || event.charCode == 13){
      this.props.onEnterPressed && this.props.onEnterPressed();
    }
  }

  render(){
      return (
        <div className="search-bar">
          <div className="section">
            <span className="label">
              Find
            </span>
            <span className="input">
              <input placeholder="Coffe,Tea, .." value={this.state.subject} onChange={ event => this.onSubjectChange(event.target.value)} onKeyPress={ event=> this.onKeyPress(event) } />
            </span>
          </div>
          <div className="section">
            <span className="label">
              Near
            </span>
            <span className="input">
              <input placeholder="Location" value={this.state.location} onChange={ event =>this.onLocationChange(event.target.value)} onKeyPress={event=> this.onKeyPress(event)} />
            </span>
          </div>

        </div>

      );
  }

}

export default Searchbar;
