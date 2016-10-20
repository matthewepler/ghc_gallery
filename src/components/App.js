import React, { Component } from 'react';
import classNames from 'classnames';
import Ajax from 'simple-ajax';
import _ from 'underscore';

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
            loadedPosts: 0,
            totalPosts: 0,
            type: null,
            success: false,
            sending: false,
        };
    }

    componentWillMount() {
        if (window.location.href.includes('admin')) {
            firebase.auth().signInWithEmailAndPassword('gstore@thisismkg.com', '599broadway').catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // ...
            });
        }
    }

    componentDidMount() {
        const dbRef = firebase.database().ref('posts/');
        
        const allPosts = this.state.posts;
        dbRef.on('value', data => { // .limitToLast(1)
            //console.log(_.size(data.val()));
            this.setState({totalPosts: _.size(data.val())});
            for (let v in data.val()) {
                allPosts.push(data.val()[v]);
                this.setState({
                    posts: allPosts,
                    loadedPosts: this.state.loadedPosts + 1,
                });
            }
            // allPosts.push(data.val());
            // 
        });

        dbRef.on('child_removed', data => {
            console.log('post removed: ', data.val());
        });
    }

    shouldComponentUpdate() {
        return this.state.loadedPosts === this.state.totalPosts -1;
    }

    launchModal(type, link) {
        this.setState({link, type});
    }

    modalOff() {
        this.removeError();
        this.setState({link: null});
        this.textInput.value = '';
    }

    sendData(data) {
        if (this.state.type === 'text') {
            data = "+1" + data;
        }

        //const url = window.location.href + '/post';

        let ajax = new Ajax({
            url: '/',
            method: 'POST',
            dataType: 'json',
            data: {
               "data" : data,
               "type" : this.state.type,
               "link": this.state.link
            }
        });

        ajax.on('success', event => {
            console.log('ajax success: ', event.target.response);
            if (event.target.response === 'true') {
                this.removeError();
                this.setState({sending: false});
                this.setState({success: true});
                setTimeout(() => {
                    this.setState({success: false});
                    this.modalOff();
                }, 2000);
            } else {
                this.setState({sending: false});
                this.removeError();
                if (this.state.type === 'text') {
                    this.addError('phone number');    
                } else if (this.state.type === 'email') {
                    this.addError('email');
                }
                
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
                    this.setState({sending: true});
                    this.sendData(input);
                    this.removeError();
            } else {
                this.removeError();
                this.addError('email');
            }
        } else if (this.state.type === 'text') {
            const regex = /\d{3}-?\d{3}-?\d{4}/
            if (regex.test(input)) {
                this.setState({sending: true});
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
        const total = posts.length - 117;
        if (total > 0) console.log(total);

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
                <div className="app-posts" id="app-posts-div">
                    {posts}
                </div>
                <div className={showHide}>
                    <div className="modal">
                        <div 
                            className="close"
                            onClick={this.modalOff.bind(this)}
                            >&#x02A2F;
                        </div>
                        {this.state.sending === true ?
                            <i className="fa fa-circle-o-notch fa-spin check" aria-hidden="true"></i>
                            :
                            <div>
                            {this.state.success === true ? 
                                <i className="fa fa-check-circle check" aria-hidden="true"></i>
                                : 
                                (<div className="input-form">
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
                                </div>)
                            }
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
