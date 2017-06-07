import React,{Component} from 'react';
import {Services} from '../common';
import {Modal} from '../common/UI';
import Cookies from 'universal-cookie';

import './index.css';

class UserInfo extends Component {

  constructor(props){
    super(props);
    this.state = {
      modal:false,
      type:props.type || 'login',
      hide_password:true,

      session:"",
      session_data:{},

      login_username:'',login_username_error:'',
      login_password:'',
      remember_me:true,

      new_email:'',new_email_error:'',
      new_username:'',new_username_error:'',
      new_password:'',new_password_error:'',
      accept_terms:false,accept_terms_error:'',

      recover_mail:'',recover_mail_error:'',
    };
  }

  togglePassword(){
    this.setState({hide_password:(!!!this.state.hide_password)});
  }

  showModal(type='login'){
    this.setState({
      modal:true,
      'type':type,
      login_username:'',
      login_username_error:'',
      login_password:'',
      remember_me:true,

      hide_password:true,

      new_email:'',new_email_error:'',
      new_username:'',new_username_error:'',
      new_password:'',new_password_error:'',
      accept_terms:false,accept_terms_error:'',

      recover_mail:'',recover_mail_error:''
    });

  }

  hideModal(){
    this.setState({
      modal:false,
    });
  }

  setType(type){
    this.setState({type});
  }

  logout(){
    Services.logout(this.state.session).
    then(r=>{
      this.setState({session:'',session_data:{}});
      this.onLoginStateChange();
    });
  }

  onLoginStateChange(){
    this.props.onLoginStateChange &&
    this.props.onLoginStateChange({
      logined:(this.state.session!=""),
      fullname: (this.state.session_data.fullname),
      mail: (this.state.session_data.fullname),
      session_id: (this.state.session),
    });
  }

  login(){
    if(this.state.login_username==""){
      this.setState({login_username_error:'Enter Username'})
      return;
    }
    Services.login(this.state.login_username,this.state.login_password)
    .catch(err=>console.log(err))
    .then(r=>r.json())
    .then(r=>{
      if(r && r.error){
        //show error message
      }else if (r && r.key) {
        const cookies  = new Cookies();
        cookies.set('session_id', r.key, { path: '/' });
        this.setState({session:r.key,session_data:r.data});
        this.onLoginStateChange();
        this.hideModal();
      }
    });
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  register(){

    var _new_username_error= (this.state.new_username == "")?'Enter Username':'';
    var _new_password_error= (this.state.new_password=="" || this.state.new_password.length < 6)?'Unsafe Password':'';
    var _new_email_error= (!this.validateEmail(this.state.new_email))?'Invalid E-Mail address':'';
    var _accept_terms_error= (!(this.state.accept_terms==true || this.state.accept_terms=="on"))?'You should accept this terms.':'';

    this.setState({
      new_username_error:_new_username_error,
      new_password_error:_new_password_error,
      new_email_error: _new_email_error,
      accept_terms_error: _accept_terms_error
    });

    if(_new_username_error || _new_password_error || _new_email_error || _accept_terms_error){
      return;
    }

    if(this.state.accept_terms==true || this.state.accept_terms=="on"){
      const mail = this.state.new_email;
      const user = this.state.new_username;
      const pass = this.state.new_password;

      Services.register(user,user,pass,mail)
      .then(r=>this.hideModal());

    }else{
      //show error
      console.log(this.state);
    }
  }

  recover(){
    if(this.state.recover_mail){
      Services.recover(this.state.recover_mail)
      .catch(err=>console.log(err))
      .then(r=>r.json())
      .then(r=>console.log(r));
    }
  }

  componentDidMount(){

    const cookies = new Cookies();
    const session_id = cookies.get('session_id');
    Services.auth(session_id)
    .then(r=>r.json())
    .then(r=> {
      if(r.key){
        this.setState({session:r.key,session_data:r.data})
        this.onLoginStateChange();
      }else{
        this.setState({session:'',session_data:{}});
        this.onLoginStateChange();
      }
    });
  }

  render(){

    const style = {
      width:(this.props.width),
      height:(this.props.height)
    };


    return(
        <div>
          <Modal onClick={()=>this.hideModal()} tabs={[{title:'Sign In'},{title:'Sign up'}]} visible={this.state.modal} >
            <ul className="switcher">
      				<li><a href="#0" onClick={()=>this.setType("login")} className={this.state.type!=="register"?"selected":""}>Sign in</a></li>
              <li><a href="#0" onClick={()=>this.setType("register")} className={this.state.type==="register"?"selected":""}>Sign up</a></li>
      			</ul>

      			<div className={"login" + ((this.state.type==="login")?" is-selected":"")}>
      				<form className="form">
      					<p className="fieldset">
      						<label className="image-replace username" htmlFor="signin-username">Username</label>
      						<input
                    className="full-width has-padding has-border signin-username"
                    type="text"
                    value={this.state.login_username}
                    placeholder="Username"
                    onChange={(event)=>this.setState({login_username:event.target.value})} />
                  <span className={"error-message"+((this.state.login_username_error!='')?' is-visible':'')}>
                    {this.state.login_username_error}
                  </span>
      					</p>

      					<p className="fieldset">
      						<label className="image-replace password" htmlFor="signin-password">Password</label>
      						<input
                    className="full-width has-padding has-border password signin-password"
                    type={this.state.hide_password?'password':'text'}
                    placeholder="Password"
                    value={this.state.login_password}
                    onChange={(event)=>this.setState({login_password:event.target.value})} />
      						<a href="#0" onClick={()=>this.togglePassword()} className="hide-password">{this.state.hide_password?'Show':'Hide'}</a>
      						<span className="error-message">Error message here!</span>
      					</p>

      					<p className="fieldset">
      						<input
                    type="checkbox"
                    className="remember-me"
                    checked="checked"
                    onChange={(event)=>this.setState({remember_me:event.target.value})} />
      						<label htmlFor="remember-me">Remember me</label>
      					</p>

      					<p className="fieldset">
      						<input className="full-width" type="button" value="Login" onClick={()=>this.login()} />
      					</p>
      				</form>

      				<p className="form-bottom-message">
                <a href="#0" onClick={()=>this.setType("recover")}>Forgot your password?</a>
              </p>
      				<a href="#0" className="close-form">Close</a>
      			</div>

      			<div className={"signup" +((this.state.type==="register")?" is-selected":"")}>
      				<form className="form">
      					<p className="fieldset">
      						<label className="image-replace username" htmlFor="signup-username">Username</label>
      						<input
                    className="full-width has-padding has-border signup-username"
                    type="text"
                    placeholder="Username"
                    value={this.state.new_username}
                    onChange={(event)=>this.setState({new_username:event.target.value})} />
                  <span className={(this.state.new_username_error!='')?'error-message is-visible':'error-message'}>{this.state.new_username_error}</span>
      					</p>

      					<p className="fieldset">
      						<label className="image-replace email" htmlFor="signup-email">E-mail</label>
      						<input
                    className="full-width has-padding has-border signup-email"
                    type="email"
                    placeholder="E-mail"
                    value={this.state.new_email}
                    onChange={(event)=>this.setState({new_email:event.target.value})} />
                  <span className={(this.state.new_email_error!='')?'error-message is-visible':'error-message'}>{this.state.new_email_error}</span>
      					</p>

      					<p className="fieldset">
      						<label className="image-replace password" htmlFor="signup-password">Password</label>
      						<input
                    className="full-width has-padding has-border password signup-password"
                    type={this.state.hide_password?"password":"text"}
                    placeholder="Password"
                    value={this.state.new_password}
                    onChange={(event)=>this.setState({new_password:event.target.value})} />
      						<a href="#0" className="hide-password" onClick={()=>this.togglePassword()} >{this.state.hide_password?"Show":"Hide"}</a>
      						<span className={(this.state.new_password_error!='')?'error-message is-visible':'error-message'}>{this.state.new_password_error}</span>
      					</p>

      					<p className="fieldset">
      						<input
                    type="checkbox"
                    className="accept-terms"
                    onChange={(event)=>this.setState({accept_terms:event.target.value})}/>
      						<label htmlFor="accept-terms">I agree to the <a href="#0">Terms</a></label>
                  <span className={(this.state.accept_terms_error!='')?'error-message is-visible':'error-message'}>{this.state.accept_terms_error}</span>
      					</p>

      					<p className="fieldset">
      						<input
                    className="full-width has-padding"
                    type="button"
                    value="Create account"
                    onClick={()=>this.register()}/>
      					</p>
      				</form>

      				 <a href="#0" className="close-form">Close</a>
      			</div>

      			<div className={"reset-password" +((this.state.type==="recover")?" is-selected":"")}>
      				<p className="form-message">
                Lost your password? Please enter your email address. You will receive a link to create a new password.
              </p>

      				<form className="form">
      					<p className="fieldset">
      						<label className="image-replace email" htmlFor="reset-email">E-mail</label>
      						<input
                    className="full-width has-padding has-border reset-email"
                    type="email"
                    placeholder="E-mail"
                    value={this.state.recover_mail}
                    onChange={(event)=>this.setState({recover_mail:event.target.value})} />
                  <span className={(this.state.recover_mail!='')?'error-message is-visible':'error-message'}>{this.state.recover_mail}</span>
      					</p>

      					<p className="fieldset">
      						<input
                    className="full-width has-padding"
                    type="button"
                    onClick={()=>this.recover()}
                    value="Reset password" />
      					</p>
      				</form>

      				<p className="form-bottom-message">
                <a href="#0" onClick={()=>this.setType('login')}>Back to login</a>
              </p>
      			</div>
      			<a href="#0" className="close-form" onClick={()=>this.hideModal() }>Close</a>
          </Modal>
          <div className="user-container" style={style}>
            {(this.state.session !="")?(
              <span>
                <a href="#">{this.state.session_data.name}</a>
                <img className="logout" src="/public/img/logout.svg" onClick={()=>this.logout()}  />
              </span>
            ):(
              <span>
                <a href="#" onClick={()=>this.showModal()} >Sign-in</a>
              </span>
            )}
          </div>
        </div>
    );
  }
}

export default UserInfo;
