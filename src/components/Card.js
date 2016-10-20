import React from 'react';
import classNames from 'classnames';


// styles
import '../assets/stylesheets/card.scss';

class Card extends React.Component {
    constructor() {
        super();
        this.state = {
            dark: false,
        };
    }

    componentDidMount() {

    }

    handleClick(e) {
        this.setState({dark: !this.state.dark});
    }

    handleActionClick(e) {
        let type = null;
        const classString = e.target.getAttribute('class')
        classString.includes('envelope') ? type='email' : type='text'
        this.props.action(type, this.props.post.imageSrc);
        this.handleClick();
    }

    getId() {
        const src = this.props.post.imageSrc;
        if (src) {
            const postId = src.substr(src.search(/\d{13}\.png/), 13).split('.')[0];
            return postId;
        }
    }

    handleDelete() {
        const postId = this.getId();
        firebase.database().ref('posts/' + postId).remove();
        const parent = document.getElementById('app-posts-div');
        const child = document.getElementById(postId);
        parent.removeChild(child);
    }

    render() {
        const showHide = classNames({
            'overlay' : true,
            'action-show' : this.state.dark,
            'action-hide' : !this.state.dark,
        });

        const thisId = this.getId();

        return (
            <div className="card-wrapper" id={thisId}>
                <div className="img-block">
                    <img 
                    src={this.props.post.imageSrc} 
                    alt={this.props.post.name}
                    onClick={this.handleClick.bind(this)}
                    />
                    <div className={showHide}>
                       <div 
                            id="delete"
                            onClick={this.handleDelete.bind(this)}
                            ><i className="fa fa-minus-circle" aria-hidden="true"></i>
                        </div>
                        <div 
                            className="close"
                            onClick={this.handleClick.bind(this)}
                            >&#x02A2F;
                        </div>
                        <div className="actions">
                            <i className="fa fa-envelope" 
                                aria-hidden="true"
                                onClick={this.handleActionClick.bind(this)}>
                            </i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Card.propTypes = {
    post: React.PropTypes.object,
    // post.name = String
    // post.imageSrc = String (link to google cloud storage object)
    // post.date = String (JS Date.toString())
}

export default Card;