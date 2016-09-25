import React, { Component } from 'react';
import classNames from 'classnames';
import Ajax from 'simple-ajax';

// components
import Card from './Card.js'

// stylesheets
import '../assets/stylesheets/app.scss';

import logo from '../assets/logo.png';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            link: null,
            type: null,
        };
    }

    componentDidMount() {
        firebase.auth().signInAnonymously().catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(error.code, error.message);
        });
        
        // adds listening event for new files from database
        // loads all existing data objects on first run
        var dbRef = firebase.database().ref('posts/');
        dbRef.on('child_added', data => {
            console.log(data.val());
            const allPosts = this.state.posts;
            allPosts.push(data.val());
            this.setState({posts: allPosts});
        });

        dbRef.on('child_removed', data => {
            console.log(data.val());
            // TODO: find in state array and remove
        });
    }

    componentWillUnmount() {
        var user = firebase.auth().currentUser;
        user.delete().then(function() {
          console.log('user deleted');
        }, function(error) {
          console.log(error);
        });
    }

    launchModal(type, link) {
        this.setState({link, type});
    }

    modalOff() {
        this.setState({link: null});
        this.textInput.value = '';
    }

    sendData(data) {
        if (this.state.type === 'text') {
            data = "+1" + data;
        }

        let ajax = new Ajax({
            url: '/post',
            method: 'POST',
            dataType: 'json',
            data: {
               "data" : data,
               "type" : this.state.type,
               "link": this.state.link
            }
        });

        ajax.on('success', event => {
            console.log('ajax success', event.target.response);
            if (event.target.response === 'true') {
                this.removeError();
                this.modalOff();
            } else {

            }
        });

        ajax.on('error', event => {
            console.log('ajax error', event);
        });

        ajax.send();
    }

    handleSubmit() {
        const input = this.textInput.value;
        if (this.state.type === 'email') {
            const regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
            if (regex.test(input)) {
                    console.log(input); // SEND EMAIL 
                    this.removeError();
                    this.modalOff();
            } else {
                this.addError('email');
            }
        } else if (this.state.type === 'text') {
            const regex = /\d{3}-?\d{3}-?\d{4}/
            if (regex.test(input)) {
                this.sendData(input.replace('-', ''));
                this.removeError();
            } else {
                this.removeError();
                this.addError('phone number');
            }
        }
    }

    addError(type) {
        const error = document.createElement("P");
        error.setAttribute('id', 'modal-error');
        error.appendChild(document.createTextNode(`Please check your ${type} \
            and try again.`));
        document.getElementsByTagName('h3')[0].appendChild(error);
    }

    removeError() {
        if (document.getElementById('modal-error')){
            const errorElem = document.getElementById('modal-error');
            errorElem.parentNode.removeChild(errorElem);
        }
    }

    checkSubmit(e) {
        if(e && e.key === 'Enter') {
            this.handleSubmit();
        }
    }

    render() {
        const sorted = this.state.posts.sort((a,b) => {
            return new Date(b.date) - new Date(a.date);
        });
        const posts = sorted.map((p, index) => {
            return <Card 
                    post={p} 
                    key={index} 
                    action={this.launchModal.bind(this)} 
                    />
        });

        const showHide = classNames({
            'app-overlay' : true,
            'app-show' : this.state.link != null,
            'app-hide' : this.state.link === null,
        });
        
        return (
            <div className="app-wrapper">
                <div className="header">
                    <img src={logo} />
                </div>
                <div className="app-posts">
                    {posts}
                </div>
                <div className={showHide}>
                    <div className="modal">
                        <div 
                            className="close"
                            onClick={this.modalOff.bind(this)}
                            >&#x02A2F;
                        </div>
                        {this.state.type === 'email' ? <h3>Please enter your email</h3> : ''}
                        {this.state.type === 'text' ? <h3>Please enter your phone number</h3>: ''}
                        <input type="text"
                                placeholder= {this.state.type === 'email' ?
                                                'example@gmail.com' :
                                                '555-555-5555'}
                                ref={c => this.textInput = c}
                                onKeyPress={this.checkSubmit.bind(this)}
                                />
                        <input type="submit" 
                                onClick={this.handleSubmit.bind(this)}
                                value="Send"
                                />
                    </div>
                </div>
            </div>
        )
    }
}

export default App;