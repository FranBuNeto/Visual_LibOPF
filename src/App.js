import React from 'react';
import logo from './logo.svg';
import GridLayout from 'react-grid-layout';
import './App.css';
import * as d3 from 'd3';
import {Sigma, RandomizeNodePositions, RelativeSize, NodeShapes } from 'react-sigma';

function App() {
  return (
    <div className="App">
      <MyFirstGrid></MyFirstGrid>
    </div>
  );
}

class MyFirstGrid extends React.Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
    this.state = {
        data: {nodes:[{id:"n1", x: 0.399, y: 0.399}, {id:"n2", x: 0.4, y: 0.4}], edges:[]},
    };
  }

  click() {
    var fileInput = document.getElementById("dat");
    var files = fileInput.files;
    var reader = new FileReader();
    const scope = this;

    reader.readAsArrayBuffer(files[0]);

    reader.onload = function() {
      var subGraph= {
        nodes: [],
        edges:[],
      };
      var dv = new DataView(reader.result);
      var cont = 0;
      var nnodes = dv.getInt32(cont,true);//nnodes
      var nlabels = dv.getInt32(cont=cont+4,true);//nlabels
      var nfeats = dv.getInt32(cont=cont+4,true);//nfeats
      for(var i = 0; i < nnodes; i++){
        subGraph.nodes[i] = {id: dv.getInt32(cont=cont+4,true),//position
        truelabel: dv.getInt32(cont=cont+4,true),//truelabel
        feats: [  ], x:0, y:0};
        for(var j = 0; j < nfeats; j++){
          subGraph.nodes[i].feats[j] = dv.getFloat32(cont=cont+4,true);//feat
        }
        subGraph.nodes[i].x = subGraph.nodes[i].feats[0];
        subGraph.nodes[i].y = subGraph.nodes[i].feats[1];
      }
      scope.setState({ data:subGraph });
      console.log(scope.state);
    };
  }

  render() {
    const layout = [
      {i: 'ToolBar', x: 0, y: 0, w: 1, h: 2, static: true},
      {i: 'Info', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4, static: true},
      {i: 'Objects', x: 4, y: 0, w: 1, h: 2, static: true},
      {i: 'Grid', x: 0, y: 0, w: 10, h: 10, static: true},
      {i: 'Functions', x: 4, y: 0, w: 1, h: 2}
    ];

    return (
      <div>
        <GridLayout className="layout" layout={layout} cols={12} rowHeight={30} width={1200}>
          <div key="ToolBar">a</div>
          <div key="Info">b</div>
          <div key="Objects">c</div>
          <div key="Grid"><Graph data={this.state.data}/></div>
          <div key="Functions">d</div>
        </GridLayout>
        <div>
          <input type="file" id="dat" multiple></input>
          <button onClick={this.click} id ="button">load</button>
        </div>
      </div>
    )
  }
}

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }

  click() {console.log(this.props.data);}

  render() {
    return(<div><button onClick={this.click} id ="button">show</button>

    <Sigma graph={this.props.data} settings={{drawEdges:true}}>
      <RelativeSize initialSize={15}/>
    </Sigma>
  
  </div>)
  }
}


export default App;