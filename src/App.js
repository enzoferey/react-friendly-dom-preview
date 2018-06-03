import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import axios from 'axios';

function arrayToObject(array) {
  const object = {};

  for(let i = 0; i < array.length; i++) {
    const attr = array[i][0];
    const value = array[i][1];
    object[attr] = value;
  }
  return object;
};

function toDOM(obj) {
  if (typeof obj == 'string') {
    obj = JSON.parse(obj);
  }

  let node = null;
  const { nodeType } = obj;

  switch (nodeType) {
    case 1: //ELEMENT_NODE
      const CustomTag = obj.tagName;
      const children = obj.childNodes || [];
      if(children.length > 0)
        node = <CustomTag {...arrayToObject(obj.attributes)}>{children.map(child => toDOM(child))}</CustomTag>
      else
        node = <CustomTag {...arrayToObject(obj.attributes)} />
      break;
    case 3: //TEXT_NODE
      node = <span>obj.nodeValue</span>;
      break;
    case 8: //COMMENT_NODE
      break;
    case 9: //DOCUMENT_NODE
      break;
    case 10: //DOCUMENT_TYPE_NODE
      break;
    case 11: //DOCUMENT_FRAGMENT_NODE
      break;
    default:
      return node;
  }

  return node;
}

class Node extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: false,
    }
  }

  render() {
    const { hovered } = this.state;
    const { html } = this.props;
    const style = hovered ? { border: '1px solid red' } : {};
    return (
      <div style={{...style}} onMouseEnter={() => this.setState({ hovered: true })} onMouseLeave={() => this.setState({ hovered: false })} dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
}

Node.defaultProps = {
  html: "<p data-preview-id=\"habak\">first node</p><p data-preview-id=\"habak\">second node</p>",
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      html: null,
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8000?url=https://www.enzoferey.com/')
      .then((response) => {
        this.setState({ html: response.data });
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { html } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {/*{html && html.map((nodeHTML, index) => <Node key={`node-${index}`} html={nodeHTML}/>)}*/}
        {html && toDOM(html)}

      </div>
    );
  }
}

export default App;
