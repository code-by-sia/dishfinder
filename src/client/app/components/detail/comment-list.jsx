import React , {Component} from 'react';
import {Button} from '../common/ui';
import {Services} from '../common';

class CommentList extends Component {
  constructor(props){
    super(props);

    this.state = {
      comments:[],
      commentText:''
    }
  }

  postComment(){
    Services.postComment(this.props.login.session_id,this.props.yelpId,this.state.commentText)
    .catch(err=>console.log(err))
    .then(c=>c.json())
    .then(newComments=>{
      if(newComments && !newComments.error ){
        this.setState({'comments':newComments,commentText:''});
      }
    });
  }

  loadComments(){

    Services.getComments(this.props.yelpId)
    .then(c=>c.json())
    .then(comments => this.setState({'comments':comments}));
  }

  componentDidMount() {
    this.loadComments();
  }

  componentWillReceiveProps(props){
    console.log(props);
     //this.loadComments();
    /*Services.getComments(this.props.yelpId)
    .then(comments => this.setState(comments));*/
  }

  render(){
    var i=0;
    return (
      <div className="comment-list-component">
        {(this.props.login.logined)?(
          <div className="new-comment">
            <textarea
              className="comment-text"
              onChange={(event)=>this.setState({commentText:event.target.value})}
              value={this.state.commentText} >

            </textarea>
            <Button className="post-comment-button" text="Post Comment" onClick={()=>this.postComment()} />
          </div>
        ):''}
        <div className="items">
          {this.state.comments && this.state.comments.map(comment=>(
            <div key={i++} className="comment-item">
              <span><strong>{comment.user}</strong> says :</span>
              <blockquote>
                {comment.text}
              </blockquote>
            </div>
          ))}


        </div>
      </div>
    );
  }
}

export default CommentList;
