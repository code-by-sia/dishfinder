import React,{Component} from 'react';
import Rating from '../search/rating';
import {Modal,Button,MapPreview} from '../common/ui';
import CommentList from './comment-list';
import './index.css';

class DetailView extends Component {
  constructor(props){
    super(props);



    this.state = {
      visible:props.visible || false
    };
  }

  componentWillReceiveProps(nextProps){
      if(nextProps)
      {
        this.setState({visible:nextProps.visible});
      }
  }

  close(){
    this.setState({visible:false})
    this.props.onClose && this.props.onClose();
  }

  render(){
    const detail = this.props.detail;
    if(!detail) {
      return (<div ></div>);
    }

    console.log(this.props.detail.image);
    const headerStyle= {
      backgroundImage:`url('${detail.image}')`
    };

    return (
      <div className="detail-component" >
        <Modal visible={this.state.visible} onClick={()=>this.close()} >
          <div className="details-info" >
            <div className="details-info-header" style={headerStyle}>
              <h1>{detail.title}</h1>
              <h2>{detail.address}</h2>
              <Rating rating={detail.rating} />
            </div>
            <div className="details-info-body">
              <div className="details-info-map">
                <MapPreview
                  className="map-preview"
                  zoom={18}
                  location={detail.location}/>
              </div>
              <div className="details-info-comments">
                <CommentList login={this.props.login} yelpId={detail.id} />
              </div>
            </div>
            <div className="details-info-footer">
              <Button text="Close Dialog" className="close-button" onClick={()=>this.close()} />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default DetailView;
