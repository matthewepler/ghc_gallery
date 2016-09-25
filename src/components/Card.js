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

    render() {
        const showHide = classNames({
            'overlay' : true,
            'action-show' : this.state.dark,
            'action-hide' : !this.state.dark,
        });

        return (
            <div className="card-wrapper">
                <div className="img-block">
                    <img 
                    src={this.props.post.imageSrc} 
                    alt={this.props.post.name}
                    onClick={this.handleClick.bind(this)}
                    />
                    <div className={showHide}>
                        <div 
                            className="close"
                            onClick={this.handleClick.bind(this)}
                            >&#x02A2F;</div>
                        <div className="actions">
                            <i className="fa fa-envelope" 
                                aria-hidden="true"
                                onClick={this.handleActionClick.bind(this)}>
                            </i>
                            <i className="fa fa-comment"
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