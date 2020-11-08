import React from 'react';
import {FormControl, Form, OverlayTrigger, Tooltip, Button} from 'react-bootstrap';

export default class FunctionManager extends React.Component {
    constructor(props){
        super(props);

        this.yesNoDict = [{title:"No", value:0},{title:"Yes", value:1}];
        this.distancesDict = [{title:"Euclidean", value:1},{title:"Chi-Squar", value:2},{title:"Manhattan", value:3},{title:"Canberra", value:4},{title:"Squared Chord", value:5},{title:"Squared Chi-Squared", value:6},{title:"BrayCurtis", value:7}];
        this.activeFunction = null;
        this.functionDetails = {
            opf_accuracy: {function: "opf_accuracy", description: "Computes the OPF accuracy",
            entraces: () => 
            [this.entrace_Graph("S","Data object used in the opf_classify function, or similar, normaly is the testing object"),
            this.entrace_Select(this.props.parent.Tree.current.state.activeData.Classifications.children,"The output list, classified, produced by opf_classify function")],
            out: ["acc"], extraOutInfo: []},

            opf_accuracy4label: {function: "opf_accuracy4label", description: "Computes the OPF accuracy for each class of a given set",
            entraces: () => 
            [this.entrace_Graph("S","Data object used in the opf_classify function, or similar, normaly is the testing object"),
            this.entrace_Select(this.props.parent.Tree.current.state.activeData.Classifications.children,"The output list, classified, produced by opf_classify function")],
            out: ["acc"], extraOutInfo: []},

            opf_classify: {function: "opf_classify", description: "Executes the test phase of the OPF classifier",
            entraces: () => 
            [this.entrace_Graph("S","The testing data object produced by the opf_split function (subGraph object)"),
            this.entrace_Graph("M","The classifier object produced by one of the classification functions (model object)"),
            this.entrace_Select(this.props.parent.Tree.current.state.activeData.Distances.children,"The precomputed distance matrix produced by the opf_distance","Distance",true)],
            out: ["out"], extraOutInfo: ["pre","tim"]},

            opf_cluster: {function: "opf_cluster", description: "Computes clusters by unsupervised OPF",
            entraces: () => 
            [this.entrace_Graph("S","The training subGraph object, produced by the opf_split function, for example (subGraph object)"),
            this.entrace_Number("1","","1","kmax","Max degree of KNN","The kmax (maximum degree for the knn graph) [greater than 0]"),
            this.entrace_Select([{title:"Height", value:0},{title:"Area", value:1},{title:"Volume", value:2}],"Clusters by: height, area or volume","Tipe of Calculation"),
            this.entrace_Number("0","100","1","parameter of the cluster","Value of parameter cluster","Value of parameter cluster [0-100]",true),
            this.entrace_Select(this.props.parent.Tree.current.state.activeData.Distances.children,"The precomputed distance matrix produced by the opf_distance","Distance",true)],
            out: ["cla"], extraOutInfo: ["out"]},

            opf_distance: {function: "opf_distance", description: "Generates the precomputed distance file for the OPF classifier",
            entraces: () => {
              var maxPosition = Math.max.apply(Math, this.props.parent.Tree.current.state.activeData.graph.nodes.map(function(o) { return o.id; }));
              if(maxPosition >= this.props.parent.Tree.current.state.activeData.graph.nodes.length){
                if (window.confirm('The active Data have a max position(ID) higher than the quantity of nodes, to proceed you need to generate a copy of the Data with new positions values, do you want to do that?')) {
                  var newGraph = this.props.parent.FM.cloneToNewGraph(this.props.parent.Tree.current.state.activeData.graph)
                  newGraph.title = "newGraph";
                  for(var i in newGraph.nodes){
                    newGraph.nodes[i].id = i;
                  }
                  this.props.parent.Tree.current.addNewEmptyData(newGraph,"New postitions graph");
                }
                else{
                  return([]);
                }
              }
              return(
                [this.entrace_Graph("S","The Data to calculate"),
                this.entrace_Select(this.distancesDict,"Distance calculation option","Distance Calculation"),
                this.entrace_Select(this.yesNoDict,"Distance normalization?","Is to Normalize?")]
              )
            }
            ,
            out: ["dis"], extraOutInfo: []},

            /*
            opf_fold: {function: "opf_fold", description: "Generates k folds (objects) for the OPF classifier", //arrumar
            entraces: () => 
            [this.entrace_Graph("S","The subGraph object"),
            this.entrace_Number("2","","1","k","Number of Folds","Number of folds [greater than or equal a 2]"),
            this.entrace_Select(this.yesNoDict,"Distance normalization?","Is to Normalize?")]
            },

            */

            // opf_info

            opf_merge: {function: "opf_merge", description: "Merge subGraphs", //can be changed to add more (a func that add more entraces)
            entraces: () => 
            [this.entrace_Datas("A Data object"),
            this.entrace_Datas("A Data object")],
            out: ["dat"], extraOutInfo: []},

            opf_learn: {function: "opf_learn", description: "Executes the learning phase of the OPF classifier",
            entraces: () => 
            [this.entrace_Graph("S","A subGraph object, can be the training object produced by the opf_split"),
            this.entrace_Graph("S","A subGraph object, can be the evaluation produced object by the opf_split"),
            this.entrace_Select(this.props.parent.Tree.current.state.activeData.Distances.children,"The precomputed distance matrix produced by the opf_distance","Distance",true)],
            out: ["cla"], extraOutInfo: ["pre","tim","out"]},

            opf_normalize: {function: "opf_normalize", description: "Normalizes data for the OPF classifier",
            entraces: () => 
            [this.entrace_Graph("S","The subGraph object")],
            out: ["dat"], extraOutInfo: []},

            opf_pruning: {function: "opf_pruning", description: "Executes the pruning algorithm", //testar
            entraces: () => 
            [this.entrace_Graph("S","A subGraph object, can be the training object produced by the opf_split"),
            this.entrace_Graph("S","A subGraph object, can be the evaluation produced object by the opf_split"),
            this.entrace_Number("0","100","1","percentageAccuracy","Max percent of lost accuracy","Max percentage of lost accuracy [0-100]",true),
            this.entrace_Select(this.props.parent.Tree.current.state.activeData.Distances.children,"The precomputed distance matrix produced by the opf_distance","Distance",true)],
            out: ["cla"], extraOutInfo: ["pre","pra","tim"]},

            opf_semi: {function: "opf_semi", description: "Executes the semi supervised training phase",
            entraces: () => 
            [this.entrace_Graph("S","A subGraph object, labeled training object"),
            this.entrace_Graph("S","A subGraph object, unlabeled training object"),
            this.entrace_Graph("S","A subGraph object, can be the evaluation produced object by the opf_split",true),
            this.entrace_Select(this.props.parent.Tree.current.state.activeData.Distances.children,"The precomputed distance matrix produced by the opf_distance","Distance",true)],
            out: ["cla"], extraOutInfo: ["pre","tim","out"]},

            opf_split: {function: "opf_split", description: "Generates training, evaluation and test sets for the OPF classifier",
            entraces: () => 
            [this.entrace_Graph("S","The data (subGraph ou graph object)"),
            this.entrace_Number("0","100","1","training_p","Percentage of training","Percentage for the training set size [0-100]",true),
            this.entrace_Number("0","100","1","evaluating_p","Percentage of evaluating","Percentage for the evaluation set size [0-100] (leave 0 in the case of no learning)",true),
            this.entrace_Number("0","100","1","testing_p","Percentage of testing","Percentage for the test set sizee [0-100]",true),
            this.entrace_Select(this.yesNoDict,"Distance normalization?","Is to Normalize?")],
            out: ["dat","dat","dat"], extraOutInfo: []},

            opf_train: {function: "opf_train", description: "Executes the training phase of the OPF classifier",
            entraces: () => 
            [this.entrace_Graph("S","A subGraph object, can be the training object produced by the opf_split"),
            this.entrace_Select(this.props.parent.Tree.current.state.activeData.Distances.children,"The precomputed distance matrix produced by the opf_distance","Distance",true)],
            out: ["cla"], extraOutInfo: ["out","tim"]},

            opfknn_classify: {function: "opfknn_classify", description: "Executes the test phase of the OPF classifier with knn adjacency",
            entraces: () => 
            [this.entrace_Graph("S","The testing data object produced by the opf_split function (subGraph object)"),
            this.entrace_Graph("M","The classifier object produced by one of the classification functions (model object)"),
            this.entrace_Select(this.props.parent.Tree.current.state.activeData.Distances.children,"The precomputed distance matrix produced by the opf_distance","Distance",true)],
            out: ["out"], extraOutInfo: ["tim"]},

            opfknn_train: {function: "opfknn_train", description: "Executes the training phase of the OPF classifier with knn adjacency",
            entraces: () => 
            [this.entrace_Graph("S","The training subGraph object, produced by the opf_split function, for example"),
            this.entrace_Graph("S","The evaluation object, produced by the opf_split function, for example"),
            this.entrace_Number("1","","1","kmax","Max degree of KNN","The kmax (maximum degree for the knn graph) [greater than 0]"),
            this.entrace_Select(this.props.parent.Tree.current.state.activeData.Distances.children,"The precomputed distance matrix produced by the opf_distance","Distance",true)],
            out: ["cla"], extraOutInfo: ["out","tim"]}
        }

        this.state = {return: []}
    }

    entrace_Datas(description){
      var aux = [];
      for(var i in this.props.parent.Tree.current.state.treeData){
        aux = aux.concat(this.props.parent.Tree.current.state.treeData[i].graph)
      }
      return(this.entrace_Select(aux,description,"Datas"))
    }

    entrace_Graph(type, description,placeholder){
        if(type === "S"){
          return(this.entrace_Select([this.props.parent.Tree.current.state.activeData.graph].concat(this.props.parent.Tree.current.state.activeData.SubGraphs.children),description,"SubGraph"))//arrumar , divide grapg/subgraph?
        }
        else{
          return(this.entrace_Select(this.props.parent.Tree.current.state.activeData.ModelFiles.children,description,"ModelFile"))
        }
    }

    entrace_Select(dict,description,objectInfo, none = false){
        var ref = React.createRef();
        return (
          <OverlayTrigger getvalue={() => {return((ref.current.value === "" ? {title:"none", value:""} : dict[ref.current.value]))}} overlay={<Tooltip id="tooltip-disabled">{description}</Tooltip>}>
            <span className="d-inline-block">
                <Form.Control
                as="select"
                description = {description}
                custom
                ref={ref}
                >
                {none ? <option value="">None</option> : null}
                {dict.map((option, index) => (
                    <option value={index}>{option.title}</option>
                ))}
                </Form.Control>
            </span>            
          </OverlayTrigger>
        )
    }

    entrace_Number(min, max, step, placeholder, objectInfo, description, percentage = false){
        var ref = React.createRef();
        return (
          <OverlayTrigger getvalue={() => {return({description:placeholder, value:(ref.current.value / (percentage ? 100 : 1))})}} overlay={<Tooltip id="tooltip-disabled">{description}</Tooltip>}>
            <span className="d-inline-block">
                <input ref={ref} type="number" min={min} max={max} step={step} placeholder={placeholder}/>
                {percentage ? <span>%</span> : null}
            </span>   
          </OverlayTrigger>
        )
    }

    loadFunctions(){
      this.setState({return: []}, () => {this.setState({return: [
        <span className="d-inline-block">
          {this.props.parent.Tree.current.state.treeData.length > 1 ? [
            <span class="function text">Active data: </span>,
            <span className="d-inline-block">
                <FormControl as="select" custom title="Select a function" onChange={(e) => {
                  this.props.parent.Tree.current.setState({activeData: this.props.parent.Tree.current.state.treeData[e.target.value]},()=>this.loadFunctions())}}>
                  {this.props.parent.Tree.current.state.treeData.map((data,index) => {
                      return(<option value={index} selected={Object.is(data,this.props.parent.Tree.current.state.activeData)?"selected":""}>{data.graph.title}</option>)
                  })}
                </FormControl>
                </span>  ]
          : ""}
          <span class="function text"> Run function: </span>
          <span className="d-inline-block">
            <Form.Control
              as="select"
              custom title="Select a function" onChange={(e) => {
              if(this.props.parent.Tree.current.state.treeData.length){
                this.state.return[1] = this.loadFunctionEntrance(e.target.value);
                this.setState({});
              }
            }}>
              <option selected disabled hidden>Select a function</option>
              <optgroup label="Data manipulation">
                <option value="opf_split" title={this.functionDetails["opf_split"].description}>opf_split</option>
                <option value="opf_normalize" title={this.functionDetails["opf_normalize"].description}>opf_normalize</option>
                <option value="opf_distance" title={this.functionDetails["opf_distance"].description}>opf_distance</option>
                <option value="opf_merge" title={this.functionDetails["opf_merge"].description}>opf_merge</option>
              </optgroup>
              <optgroup label="Training phase">
                <option value="opf_train" title={this.functionDetails["opf_train"].description}>opf_train</option>
                <option value="opf_semi" title={this.functionDetails["opf_semi"].description}>opf_semi</option>
                <option value="opf_learn" title={this.functionDetails["opf_learn"].description}>opf_learn</option>
                <option value="opf_cluster" title={this.functionDetails["opf_cluster"].description}>opf_cluster</option>
                <option value="opf_pruning" title={this.functionDetails["opf_pruning"].description}>opf_pruning</option>
                <option value="opfknn_train" title={this.functionDetails["opfknn_train"].description}>opfknn_train</option>
              </optgroup>
              <optgroup label="Classifing phase"> 
                <option value="opf_classify" title={this.functionDetails["opf_classify"].description} disabled={this.props.parent.Tree.current.state.activeData && this.props.parent.Tree.current.state.activeData.ModelFiles.children.length? "" : "disabled"}>opf_classify</option>
                <option value="opfknn_classify" title={this.functionDetails["opfknn_classify"].description} disabled={this.props.parent.Tree.current.state.activeData && this.props.parent.Tree.current.state.activeData.ModelFiles.children.length? "" : "disabled"}>opfknn_classify</option>
              </optgroup>
            </Form.Control>   
          </span>  
        </span>
      ]})});
    }

    loadFunctionEntrance(key){
      var entrances = this.functionDetails[key].entraces()
      if(entrances.length){
        return(
          <span>
            <span class="function text">  ( </span>
            <option selected disabled hidden> Paramters: </option>
              {entrances.map((entrace, index) => (
              [<b>{((index !== 0) ? (" , ") : (""))}</b>,entrace]
            ))}
            <span class="function text"> )  </span>
            <Button variant="secondary" onClick={() => {
              var functionInfo = {opfFunction: this.functionDetails[key], objs:[]};
              entrances.map((entrace, index) => {
                functionInfo.objs = functionInfo.objs.concat(entrace.props.getvalue())
              })
              this.props.parent.Tree.current.addBuffer(this.props.parent.FM.runCFunction(functionInfo, "Created by the function "+key));
            }}>Run</Button>
          </span>
        )
      }
      else{
        this.props.parent.OPFFunctions.current.loadFunctions();
      }
    }

    render(){
      return(
        <div>
          {this.state.return}
        </div>
      )
    }
}