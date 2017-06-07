import React,{Component} from 'react';
import {Logo,Section} from '../common/UI';
import UserInfo from '../user-info';
import MapView from './map';
import ListView from './list-view';
import SearchBar from '../search-bar';
import DetailView from '../detail';
import {Services} from '../common';
import './index.css';
import _ from 'lodash';


class Search extends Component {

  constructor(props){
    super(props);

    const subject  = props.match.params.subject;
    const location  = props.match.params.location;

    this.state = {
      coords:null,
      search:{
        subject,
        location
      },
      mini:false,
      detail:null,
      show_detail:false,
      loginState:{
        logined:false,
        session_id:'',
        fullname:'',
        mail:''
      }
    };

  }

  showDetail(detail){
    this.setState({detail:detail,show_detail:true});
  }

  searchChange(query){
    this.setState({search:query});
    this.findrestaurants();
    if(query.location && query.subject){
      this.props.history.replace(`/search/${query.location}/${query.subject}`);
    }
  }

  findrestaurants(){
    let {subject,location} = this.state.search;

    Services.search(location,subject)
      .then(result => result.json())
      .then(json => this.processrestaurants(json));
  }

  processrestaurants(mapMarkers){
    this.setState({'mapMarkers':mapMarkers});
  }

  onMapLoaded(){
    if((!this.state.search.location || this.state.search.location==='') && (this.state.coords!= null)){
      console.log(map,this.state.coords);
    }
  }

  onMarkerClick(marker){
    this.showDetail(marker.data);
  }

  autoHideHeader() {
		var currentTop = window.scrollY;
		this.setState({mini:(currentTop >=70)});
		 window.scrolling = false;
	}

  onLoginStateChange(newstate){
    this.setState({loginState:newstate});
  }

  componentDidMount(){
    if(!location || location===''){
      navigator.geolocation.getCurrentPosition(position=>{
        this.setState({coords: position.coords});
      });
    }

    this.searchChange(this.state.search);

    window.scrolling = false;
    window.addEventListener('scroll',()=>{
      if( !window.scrolling ) {
        window.scrolling = true;
        (!window.requestAnimationFrame)
          ? setTimeout(()=>this.autoHideHeader(), 250)
          : requestAnimationFrame(()=>this.autoHideHeader());
      }
    });

  }

  render(){
    const searchFn = _.debounce(q=>this.searchChange(q),300);
    const w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('body')[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    const style = {
      minHeight:y-290
    };

    return (
      <div className={'search-page' + (this.state.mini?' mini-search':'')}>
        <div className="search-page-header" >
          <Section>
            <Logo width="170px" height="80px"/>
            <UserInfo onLoginStateChange={(newstate)=>this.onLoginStateChange(newstate)} />
          </Section>
          <SearchBar onChange={query=>searchFn(query)} value={this.state.search} />
        </div>
        <div className="search-page-contents" style={style} >


          <ListView
            onViewDetailClick={(detail)=>this.showDetail(detail)}
            markers={this.state.mapMarkers} />

          <MapView
            onMapLoaded={()=>this.onMapLoaded()}
            onMarkerClick={(marker)=>this.onMarkerClick(marker)}
            markers={this.state.mapMarkers}
            location={this.state.search.location} />

        </div>
        <div className="search-footer">
          <div className="contents">
                <span className="copyleft">Copyleft &copy;</span> 2017, All Rights Not Reserved!!
          </div>
        </div>
        {(this.state.show_detail)?(
          <DetailView
            visible={true}
            detail={this.state.detail}
            login={this.state.loginState}
            onClose={()=>this.setState({show_detail:false})} />
        ):''}

      </div>
    )
  }
}

export default Search;
