import React,{Component} from 'react';

class Rating extends Component {

  render (){
    return (
      <div className="rating">
        {"★".repeat(Math.ceil(this.props.rating||0))}
      </div>
    );
  }
}

export default Rating;
