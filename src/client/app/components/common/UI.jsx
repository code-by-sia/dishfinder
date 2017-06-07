import React,{Component} from 'react';
import {GOOGLE_MAP_API_KEY} from './index';
import './common.css';

class Section extends Component {
  render(){
    return (
      <div className="section">
        {this.props.children}
        <div className="clear-fix" ></div>
      </div>
    );
  }
}

class Button extends Component {
  constructor(props){
    super(props);

  }

  onClick(){
    this.props.onClick && this.props.onClick();
  }

  render(){
    const extendedClassName = this.props.className?(" " +this.props.className):"";
    return (
      <button className={"button" + extendedClassName} onClick={()=>this.onClick()}>
        {this.props.text}
      </button>
    );
  }
}

class MapPreview extends Component {
  render(){
    const lat    = this.props.location.lat ;
    const lng    = this.props.location.lng ;
    const zoom   = this.props.zoom || 14;
    const width  = this.props.width || 300;
    const height = this.props.width || 300;
    const sensor = !!this.props.sensor;

    return(
      <img
        className={this.props.className || ""}
        width={width}
        height={height}
        alt="Location"
        src={`https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&sensor=${sensor}&key=${GOOGLE_MAP_API_KEY}&markers=color:red%7C${lat},${lng}`} />
    );
  }
}

class Logo extends Component{

  render(){
    const style = {
      width:(this.props.width),
      height:(this.props.height)
    };

    return (
      <div className="logo-container" style={style}>
        <a href="/" >
          <img className="logo-image" alt="Logo" src="/public/logo.svg" />
        </a>
      </div>
    );
  }
}

class Modal extends Component {
  render(){
    return (
      <div className={'user-modal' + (this.props.visible?' is-visible':'')} onClick={()=>this.props && this.props.onClick()}>
        <div className="user-modal-container" onClick={event=>event.stopPropagation()}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export {Modal,MapPreview,Button,Section,Logo};
