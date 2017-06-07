import React,{Component} from 'react';
import Searchbar from '../search-bar';
import UserInfo from '../user-info';
import _ from 'lodash';
import {GOOGLE_MAP_API_KEY} from '../common';
import './index.css';


class Application extends Component{

  constructor(props){
    super(props);

    this.state = {
      subject:'',
      location:''
    };
  }

  search(){
    if(this.state.subject!=""){
      this.props.history.push(`/search/${this.state.location||'everywhere'}/${this.state.subject}`);
    }
  }

  componentWillMount(){

    const getAddressCity = (address, length) => {
      const findType = type => type.types[0] === "locality"
      const comp =_.find(address.address_components,findType);

      return (
        length === 'short'
          ? (comp && comp.short_name)
          : (comp && comp.long_name)
      )
    };

    const findCity=(results)=>{
      for(var i=0;i<results.length;i++)
      {
        var city = getAddressCity(results[i],"sort");
        if(city){
          return city;
        }
      }

      return "";
    };

    navigator.geolocation.getCurrentPosition(position=>{
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAP_API_KEY}`)
      .then(f=>f.json())
      .then(data=> {
        if(data && data.results && data.results.length){
          const city = findCity(data.results);
          if((!this.state.location) || (this.state.location==='')){
            this.setState({location:city});
          }
        }
      });
    });
  }

  render(){
    return (

      <div className="application">
          <UserInfo />
          <div className="resp-margin-left resp-margin-right">
            <div className="application-header">
            </div>
            <div className="logo" >
              <a href="#">
                <img src="/public/logo.svg" alt="Dish Finder | easy way to find restaurants" />
              </a>
            </div>
            <Searchbar value={this.state} onEnterPressed={()=>this.search()} onChange={value => this.setState({'subject':value.subject,'location':value.location})} />
            <button className="search-button" type="button" onClick={()=>this.search()}>
            Find {(this.state.subject!=='')?`${this.state.subject} at ${this.state.location || 'everywhere'}`:' restaurants'}
            </button>

          </div>

      </div>
    );
  }
}

export default Application;
