import React,{Component} from 'react';
import Rating from './rating';
import {Button} from '../common/ui';

class ListView extends Component {

  onViewDetailClick(item){
    this.props.onViewDetailClick && this.props.onViewDetailClick(item);
  }

  render(){
    return (
      <div className="search-result-list">
        <div className="list">
          {this.props.markers && this.props.markers.map(item=>(
            <div id={'item-'+item.id} key={item.id} className="item">
              <div className="img">
                  <img className="item-img" src={item.image} />
                  <Rating rating={item.rating} />
              </div>
              <div className="info">
                <span className="link">
                  <a href={item.url || '#'} ><strong>{item.title}</strong></a>
                </span>
                <span className="phone">
                  {item.phone}
                </span>

                <span className="address">
                  {item.address || ""}{item.address && <br />}

                  <br />
                  {item.city},{item.country}
                </span>
              </div>
              <Button text="View Detail" onClick={()=>this.onViewDetailClick(item)} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ListView;
