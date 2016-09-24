import '../assets/stylesheets/base.scss';
import React, { Component } from 'react';

const Hello = React.createClass({
  render() {
    return(
      <div>
        <form action="/" method="post">
            <input type="text" name="text1" defaultValue="tasting123" />
            <input type="submit" value="submit" /> 
        </form>
      </div>
    )
  }
});

export default Hello;