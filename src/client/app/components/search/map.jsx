import React,{Component} from 'react';
import loadjs from 'loadjs';
import {GOOGLE_MAP_API_KEY} from '../common';
import {mapStyle} from './map-style'
class MapView extends Component{

  constructor(props){
    super(props);

    this.state = {
      location:this.props.location
    };
  }


  componentDidMount(){
   loadjs(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAP_API_KEY}`,{
     success:()=>{
       this.initMap();
       this.props.onMapLoaded && this.props.onMapLoaded();
     }
   });
  }

  initMap(){

        this.mapEl = document.getElementById('google-map');
        this.map = new window.google.maps.Map(this.mapEl, {
             center: {lng: 51.3890, lat: 35.6892},
             zoom: 14,
             styles:mapStyle
           });

        this.geocoder = new window.google.maps.Geocoder();
        this.goToAddress(this.state.location);

        this.mapEl.style.height =(this.getElementHeight(window) - 168) + 'px';

  }

  goToAddress(address){

    this.geocoder.geocode({address},resp=>{
      if(!resp || !resp.length){
        return;
      }

      var l = resp[0].geometry.location;
      var lng = l.lng();
      var lat = l.lat();
      this.map.setCenter({lng,lat});
      //this.clearMarkers();
      this.props.onAddressChanges  && this.props.onAddressChanges (address);
      this.props.onPositionChanged && this.props.onPositionChanged(lng,lat);

    });
  }

  getElementHeight(el){
    return isNaN(el.innerHeight) ? el.clientHeight : el.innerHeight
  }


  componentWillReceiveProps(nextProps){

    if(this.state.location !== nextProps.location){
      this.goToAddress(nextProps.location);
    }

    if(nextProps.markers && (nextProps.markers!= this.props.markers)){
      this.clearMarkers();
      nextProps.markers && nextProps.markers.forEach(marker=>{

        var gMarker = new window.google.maps.Marker({
          'position': {lng:marker.location.lng,lat:marker.location.lat},
          'map': this.map,
          'title':marker.title,
          'animation': window.google.maps.Animation.DROP,
          'data':marker
        });

        gMarker.addListener('mouseover', () => this.onMarkerHover(gMarker));
        gMarker.addListener('click', () => this.onMarkerClick(gMarker));


        this.markers.push(gMarker);
      });

    }
  }

  onMarkerHover(marker){
    this.props.onMarkerHover && this.props.onMarkerHover(marker);
  }

  onMarkerClick(marker){
    this.props.onMarkerClick && this.props.onMarkerClick(marker);
  }

  clearMarkers(){
    this.markers && this.markers.forEach(c=> c.setMap(null));
    this.markers = [];
  }

  render(){
    return(<div className="map-view"><div id="google-map" ></div></div>)
  }
}

export default MapView;
