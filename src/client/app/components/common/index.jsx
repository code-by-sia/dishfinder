const GOOGLE_MAP_API_KEY = 'YOUR_GOOGLE_MAP_API_KEY';
const GOOGLE_STATIC_MAP_API_KEY = 'YOUR_GOOGLE_MAP_STATIC_API_KEY';

class Services {

  static getComments(yelpId){
    return fetch(`/api/comments/${yelpId}`,{method:'GET'});
  }

  static postComment(session_id,yelpId,comment){
    const url = `/api/comments/${yelpId}`;
    return fetch(url,{
      method:'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:`session_id=${session_id}&comment=${comment}`
    });
  }

  static search(location,subject){
    subject = encodeURI(subject);
    location = encodeURI(location);
    var url = `/api/search/${location}/${subject}`;

    return fetch(url);
  }

  static auth(session_id){
    return fetch('/api/auth',{
      method:'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:`session_id=${session_id}`
    });
  }

  static logout(session_id){
    return fetch(`/api/logout`,{
      method:'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:`session_id=${session_id}`
    });
  }

  static login(user,pass){

    return fetch(`/api/login`,{
      method:'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:`user=${user}&pass=${pass}`
    });
  }

  static register(user,name,pass,mail){
    return fetch(`/api/signup`,{
      method:'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:`username=${user}&name=${name}&password=${pass}&mail=${mail}`
    });
  }

  static recover(mail){
    return fetch(`/api/recover`,{
      method:'POST',
      headers:{'Content-Type': 'application/x-www-form-urlencoded'},
      body:`mail=${mail}`
    });
  }

}

export {Services,GOOGLE_MAP_API_KEY};
