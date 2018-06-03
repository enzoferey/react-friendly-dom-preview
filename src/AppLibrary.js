import React from 'react';
import logo from './logo.svg';
import './App.css';

import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import axios from 'axios';

class Node extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hovered: false,
    }
  }

  render() {
    const { hovered } = this.state;
    const { children } = this.props;
    const style = hovered ? { border: '1px solid red' } : {};
    return (
      <span style={{ display: 'inline-block', boxSizing: 'border-box', ...style}} onMouseEnter={() => this.setState({ hovered: true })} onMouseLeave={() => this.setState({ hovered: false })}>
        {children}
      </span>
    );
  }
}

const noHover = [ "!doctype", "html", "head", "meta", "title", "link", "script", "body", "path" ];

const transform = (node, index) => {
  console.log(node);
  if(node.type !== "text" && noHover.indexOf(node.name) === -1)
    return <Node key={`node-${index}`}>{convertNodeToElement(node, index, transform)}</Node>

  return convertNodeToElement(node, index, transform);
};


const options = { transform };

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      html: null,
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8000?url=https://www.botxo.co/')
      .then((response) => {
        this.setState({ html: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { html, } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        {/*{html && html.map((nodeHTML, index) => <Node key={`node-${index}`} html={nodeHTML}/>)}*/}
        <div>{ReactHtmlParser(html, options)}</div>;
      </div>
    );
  }
}

export default App;