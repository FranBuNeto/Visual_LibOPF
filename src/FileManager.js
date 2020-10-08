

export default class FileManager{
  constructor(parent,stateUpdate) {
    this.parent = parent;
    this.stateUpdate = stateUpdate;
    
    this.Module = require('./libopf.js')(); // Your Emscripten JS output file
    this.FS = this.Module.FS;
    this.colors = [
      "#63b598", "#ce7d78", "#ea9e70", "#a48a9e", "#c6e1e8", "#648177" ,"#0d5ac1" ,
      "#f205e6" ,"#1c0365" ,"#14a9ad" ,"#4ca2f9" ,"#a4e43f" ,"#d298e2" ,"#6119d0",
      "#d2737d" ,"#c0a43c" ,"#f2510e" ,"#651be6" ,"#79806e" ,"#61da5e" ,"#cd2f00" ,
      "#9348af" ,"#01ac53" ,"#c5a4fb" ,"#996635","#b11573" ,"#4bb473" ,"#75d89e" ,
      "#2f3f94" ,"#2f7b99" ,"#da967d" ,"#34891f" ,"#b0d87b" ,"#ca4751" ,"#7e50a8" ,
      "#c4d647" ,"#e0eeb8" ,"#11dec1" ,"#289812" ,"#566ca0" ,"#ffdbe1" ,"#2f1179" ,
      "#935b6d" ,"#916988" ,"#513d98" ,"#aead3a", "#9e6d71", "#4b5bdc", "#0cd36d",
      "#250662", "#cb5bea", "#228916", "#ac3e1b", "#df514a", "#539397", "#880977",
      "#f697c1", "#ba96ce", "#679c9d", "#c6c42c", "#5d2c52", "#48b41b", "#e1cf3b",
      "#5be4f0", "#57c4d8", "#a4d17a", "#225b8", "#be608b", "#96b00c", "#088baf",
      "#f158bf", "#e145ba", "#ee91e3", "#05d371", "#5426e0", "#4834d0", "#802234",
      "#6749e8", "#0971f0", "#8fb413", "#b2b4f0", "#c3c89d", "#c9a941", "#41d158",
      "#fb21a3", "#51aed9", "#5bb32d", "#807fb", "#21538e", "#89d534", "#d36647",
      "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
      "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
      "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#21538e", "#89d534", "#d36647",
      "#7fb411", "#0023b8", "#3b8c2a", "#986b53", "#f50422", "#983f7a", "#ea24a3",
      "#79352c", "#521250", "#c79ed2", "#d6dd92", "#e33e52", "#b2be57", "#fa06ec",
      "#1bb699", "#6b2e5f", "#64820f", "#1c271", "#9cb64a", "#996c48", "#9ab9b7",
      "#06e052", "#e3a481", "#0eb621", "#fc458e", "#b2db15", "#aa226d", "#792ed8",
      "#73872a", "#520d3a", "#cefcb8", "#a5b3d9", "#7d1d85", "#c4fd57", "#f1ae16",
      "#8fe22a", "#ef6e3c", "#243eeb", "#1dc18", "#dd93fd", "#3f8473", "#e7dbce",
      "#421f79", "#7a3d93", "#635f6d", "#93f2d7", "#9b5c2a", "#15b9ee", "#0f5997",
      "#409188", "#911e20", "#1350ce", "#10e5b1", "#fff4d7", "#cb2582", "#ce00be",
      "#32d5d6", "#17232", "#608572", "#c79bc2", "#00f87c", "#77772a", "#6995ba",
      "#fc6b57", "#f07815", "#8fd883", "#060e27", "#96e591", "#21d52e", "#d00043",
      "#b47162", "#1ec227", "#4f0f6f", "#1d1d58", "#947002", "#bde052", "#e08c56",
      "#28fcfd", "#bb09b", "#36486a", "#d02e29", "#1ae6db", "#3e464c", "#a84a8f",
      "#911e7e", "#3f16d9", "#0f525f", "#ac7c0a", "#b4c086", "#c9d730", "#30cc49",
      "#3d6751", "#fb4c03", "#640fc1", "#62c03e", "#d3493a", "#88aa0b", "#406df9",
      "#615af0", "#4be47", "#2a3434", "#4a543f", "#79bca0", "#a8b8d4", "#00efd4",
      "#7ad236", "#7260d8", "#1deaa7", "#06f43a", "#823c59", "#e3d94c", "#dc1c06",
      "#f53b2a", "#b46238", "#2dfff6", "#a82b89", "#1a8011", "#436a9f", "#1a806a",
      "#4cf09d", "#c188a2", "#67eb4b", "#b308d3", "#fc7e41", "#af3101", "#ff065",
      "#71b1f4", "#a2f8a5", "#e23dd0", "#d3486d", "#00f7f9", "#474893", "#3cec35",
      "#1c65cb", "#5d1d0c", "#2d7d2a", "#ff3420", "#5cdd87", "#a259a4", "#e4ac44",
      "#1bede6", "#8798a4", "#d7790f", "#b2c24f", "#de73c2", "#d70a9c", "#25b67",
      "#88e9b8", "#c2b0e2", "#86e98f", "#ae90e2", "#1a806b", "#436a9e", "#0ec0ff",
      "#f812b3", "#b17fc9", "#8d6c2f", "#d3277a", "#2ca1ae", "#9685eb", "#8a96c6",
      "#dba2e6", "#76fc1b", "#608fa4", "#20f6ba", "#07d7f6", "#dce77a", "#77ecca"]
  }

  graphKeys = {keys: ["title","description","nnodes","nlabels","nfeats"],
              disabled: [true,true,false,true,true],
              onChange: [(title,node) => {node.title = title; this.parent.Tree.current.setState({})},() => {},() => {},() => {},() => {}]}
  graphNodeKeys = {keys: ["title","id","truelabel","feat"],
                  disabled: [true,false,true,true],
                  onChange: [(title,node) => {node.self.title = title},() => {},(newLabel,node) => {node.self.truelabel = newLabel; node.self.color = this.colors[newLabel]},
                  (newfeat,indexFeat,node) => {
                    node.self.feat[indexFeat] = newfeat; 
                    node.self.x = node.feat[0];
                    node.self.y = node.feat[1];}]}

  subGraphKeys = {keys: ["title","description","nnodes","nlabels","nfeats"],
                  disabled: [true,true,false,true,true],
                  onChange: [(title,node) => {node.title = title; this.parent.Tree.current.setState({})},() => {},() => {},() => {},() => {}]}
                    
  modelKeys = {keys: ["title","description","nnodes","nlabels","nfeats","df","bestk","K","mindens","maxdens","ordered_list_of_nodes"]}
  modelNodeKeys = {keys: ["title","id","truelabel","pred","nodelabel","pathval","radius","dens","feat"]}

  quick_Sort(origArray) {
    if (origArray.length <= 1) { 
      return origArray;
    } else {
  
      var left = [];
      var right = [];
      var newArray = [];
      var pivot = origArray.pop();
      var length = origArray.length;
  
      for (var i = 0; i < length; i++) {
        if (origArray[i].id <= pivot.id) {
          left.push(origArray[i]);
        } else {
          right.push(origArray[i]);
        }
      }
  
      return newArray.concat(this.quick_Sort(left), pivot, this.quick_Sort(right));
    }
  }

  runOPFFunction(opfFunction, variables, description, graphOrigin, modelFileOrigin = null){
    const cwrap = this.Module.cwrap("c_"+opfFunction,null,['number', 'number']);
  
    variables = [""].concat(variables);  //  ["","files/auxone.dat","0.5","0","0.5","0"];
    var ptrArr = this.Module._malloc(variables.length * 4);
    var ptrAux = []
    for (var i = 0; i < variables.length; i++) {
        var len = variables[i].length + 1;
        var ptr = this.Module._malloc(len);
        ptrAux = ptrAux.concat(ptr);
        this.Module.stringToUTF8(variables[i].toString(), ptr, len);
  
        this.Module.setValue(ptrArr + i * 4, ptr, "i32");      
    }
  
    var ptrNum = this.Module._malloc(4);
    this.Module.setValue(ptrNum, variables.length, 'i32');
  
    cwrap(ptrNum,ptrArr);
    var array = [];
    var dir = this.FS.readdir("files/");
    var buffer = [[],[],[],[],[]]
    for(i in dir){
      if(dir[i].substring(6) !== ""){ //use function to know what will be back can be useful
        switch(dir[i].substr(-4)) {
          case ".tim": //execucion time
            array = this.FS.readFile("files/"+dir[i],{encoding: 'utf8'});
            console.log("tim",array);
            this.FS.unlink("files/"+dir[i]);
            break;
          case ".dat": //subGraph
            buffer[0] = buffer[0].concat(this.readSubGraph(new DataView(this.FS.readFile("files/"+dir[i], null).buffer),dir[i].substring(7).replace(".dat",""), description, graphOrigin));
            this.FS.unlink("files/"+dir[i]);
            break;
          case ".cla": //modelFile
            buffer[1] = buffer[1].concat(this.readModelFile(new DataView(this.FS.readFile("files/"+dir[i], null).buffer),"Model File " + this.parent.Tree.current.state.activeData.ModelFiles.children.length,description));
            this.FS.unlink("files/"+dir[i]);
            break;
          case ".out": //classification
            buffer[3] = buffer[3].concat(this.readClassification("files/"+dir[i],"classification "+this.parent.Tree.current.state.activeData.Classifications.children.length,description));
            this.FS.unlink("files/"+dir[i]);
            break;
          case ".acc": //accuracy
            array = this.FS.readFile("files/"+dir[i],{encoding: 'utf8'}).split("\n");
            console.log(array);
            this.FS.unlink("files/"+dir[i]);
            break;
          case ".dis": //distances
            buffer[2] = buffer[2].concat(this.readDistances(new DataView(this.FS.readFile("files/"+dir[i], null).buffer),"distance "+this.parent.Tree.current.state.activeData.Distances.children.length,description));
            this.FS.unlink("files/"+dir[i]);
            break;
            case ".pra": //pruning rate
            array = this.FS.readFile("files/"+dir[i],{encoding: 'utf8'}).split("\n");
            console.log(array);
            this.FS.unlink("files/"+dir[i]);
            break;
          case ".pre": //pred file (classification)
            buffer[4] = buffer[4].concat([this.FS.readFile("files/"+dir[i],{encoding: 'utf8'}).split("\n")]);
            console.log(buffer[4]);
            this.FS.unlink("files/"+dir[i]);
            break;
          default:
            break;
        }
      }
    }
		//discover who is the subgraph father to add the pred!!!!
    if(buffer[4].length){
      for(i = 0; i < graphOrigin.nnodes; i++){
        graphOrigin.nodes[i].pred = buffer[4][0][i]
      }
      graphOrigin.modelFileClassificator = modelFileOrigin
    }
    this.parent.Tree.current.addBuffer(buffer);
  }

  readGraph(dv, title, description){
    var graph= {
      nnodes: -1, nlabels: -1, nfeats: -1, title: title, description:description, open: false,
      infoKeys: this.graphKeys,
      nodes: [],
      edges:[]
    };

    var cont = 0;
    graph.nnodes = dv.getInt32(cont,true);//nnodes
    graph.nlabels = dv.getInt32(cont=cont+4,true);//nlabels
    graph.nfeats = dv.getInt32(cont=cont+4,true);//nfeats
    for(var i = 0; i < graph.nnodes; i++){
      graph.nodes[i] = {
      infoKeys: this.graphNodeKeys,
      feat: [  ],
      id: dv.getInt32(cont=cont+4,true),//position
      truelabel: dv.getInt32(cont=cont+4,true),//truelabel
      x:0, y:0, size:0.5, color:null, title:"", label:"", self:null};
      graph.nodes[i].color = this.colors[graph.nodes[i].truelabel]
      graph.nodes[i].title = "Node "+graph.nodes[i].id.toString();
      graph.nodes[i].label = graph.nodes[i].title;
      graph.nodes[i].self = graph.nodes[i];
      for(var j = 0; j < graph.nfeats; j++){
        graph.nodes[i].feat[j] = dv.getFloat32(cont=cont+4,true);//feat
      }
      graph.nodes[i].x = graph.nodes[i].feat[0];
      graph.nodes[i].y = graph.nodes[i].feat[1];
    }
    graph.nodes = this.quick_Sort(graph.nodes);
    return(graph);
  }

  writeGraph(graph, file){
    const buf = Buffer.allocUnsafe((3 + graph.nnodes*(2+graph.nfeats))*4);
    
    var cont = 0;
    buf.writeInt32LE(graph.nnodes,cont);
    buf.writeInt32LE(graph.nlabels,cont=cont+4);
    buf.writeInt32LE(graph.nfeats,cont=cont+4);
    for(var i = 0; i < graph.nnodes; i++){
      buf.writeInt32LE(graph.nodes[i].id,cont=cont+4);
      buf.writeInt32LE(graph.nodes[i].truelabel,cont=cont+4);
      for(var j = 0; j < graph.nfeats; j++){
        buf.writeFloatLE(graph.nodes[i].feat[j],cont=cont+4);
      }
    }
    this.FS.writeFile(file,Buffer.from(buf));
  }
  
  readSubGraph(dv, title, description, graphOrigin){ //definition: !id = array index!
    var subGraph = {title: title, description:description, nodes:[], edges:[], graphOrigin:graphOrigin, infoKeys:this.subGraphKeys}
    var cont = 0;
    subGraph.nnodes = dv.getInt32(cont,true);//nnodes
    subGraph.nlabels = dv.getInt32(cont=cont+4,true);//nlabels
    subGraph.nfeats = dv.getInt32(cont=cont+4,true);//nfeats
    var id;
    for(var i = 0; i < subGraph.nnodes; i++){
      id = dv.getInt32(cont=cont+4,true);
      subGraph.nodes = subGraph.nodes.concat(this.parent.Tree.current.state.activeData.graph.nodes[id])
      cont += 4 + subGraph.nfeats * 4
    }
    subGraph.nodes = this.quick_Sort(subGraph.nodes);
    return(subGraph)
  }
  
  writeSubGraph(graph, file){
    console.log("g",graph)
    const buf = Buffer.allocUnsafe((3 + graph.nodes.length*(2+graph.graphOrigin.nfeats))*4);
    
    var cont = 0;
    buf.writeInt32LE(graph.nodes.length,cont);
    buf.writeInt32LE(graph.graphOrigin.nlabels,cont=cont+4);
    buf.writeInt32LE(graph.graphOrigin.nfeats,cont=cont+4);
    for(var i = 0; i < graph.nodes.length; i++){
      buf.writeInt32LE(graph.nodes[i].id,cont=cont+4);
      buf.writeInt32LE(graph.nodes[i].truelabel,cont=cont+4);
      for(var j = 0; j < graph.graphOrigin.nfeats; j++){
        buf.writeFloatLE(graph.nodes[i].feat[j],cont=cont+4);
      }
    }
    this.FS.writeFile(file,Buffer.from(buf));
  }

  readModelFile(dv, title, description){
    var modelFile= {
      nnodes: -1, nlabels: -1, nfeats: -1, df: -1, bestk: -1, K: -1, mindens: -1, maxdens: -1, title: title, open: false, description:description, ordered_list_of_nodes: [],
      infoKeys: this.modelKeys,
      nodes: [],
      edges:[]
    };
    
    var cont = 0;
    modelFile.nnodes = dv.getInt32(cont,true);
    modelFile.nlabels = dv.getInt32(cont=cont+4,true);
    modelFile.nfeats = dv.getInt32(cont=cont+4,true);
    modelFile.df = dv.getFloat32(cont=cont+4,true);
    modelFile.bestk = dv.getInt32(cont=cont+4,true);
    modelFile.K = dv.getFloat32(cont=cont+4,true);
    modelFile.mindens = dv.getFloat32(cont=cont+4,true);
    modelFile.maxdens = dv.getFloat32(cont=cont+4,true);
    for(var i = 0; i < modelFile.nnodes; i++){
      modelFile.nodes[i] = {
      infoKeys: this.graphNodeKeys,
      feat: [  ],
      id: dv.getInt32(cont=cont+4,true),//position
      truelabel: dv.getInt32(cont=cont+4,true),
      pred: dv.getInt32(cont=cont+4,true),
      nodelabel: dv.getInt32(cont=cont+4,true),
      pathval: dv.getFloat32(cont=cont+4,true),
      radius: dv.getFloat32(cont=cont+4,true),
      dens: dv.getFloat32(cont=cont+4,true),
      x:0, y:0, size:0.5, color:null, title:"", label:""}; //nodelabel == LABEL FROM OPF
      modelFile.nodes[i].color = this.colors[modelFile.nodes[i].truelabel]
      modelFile.nodes[i].title = "Node "+modelFile.nodes[i].id.toString();
      modelFile.nodes[i].label = modelFile.nodes[i].title;
      for(var j = 0; j < modelFile.nfeats; j++){
        modelFile.nodes[i].feat[j] = dv.getFloat32(cont=cont+4,true);//feat
      }
      modelFile.nodes[i].x = modelFile.nodes[i].feat[0];
      modelFile.nodes[i].y = modelFile.nodes[i].feat[1];
    }
    for(i = 0; i < modelFile.nnodes; i++){
      modelFile.ordered_list_of_nodes[i] = dv.getInt32(cont=cont+4,true);
    }
    //modelFile.nodes = this.quick_Sort(modelFile.nodes);
    for(var ID in modelFile.ordered_list_of_nodes){
      if(modelFile.nodes[ID].pred !== -1){
        modelFile.edges = modelFile.edges.concat({
          id: modelFile.edges.length,
          source: modelFile.nodes[ID].id,
          target: modelFile.nodes[modelFile.nodes[ID].pred].id,
          type: "arrow",
        })
      }
    }
    return(modelFile);
  }

  writeModelFile(modelFile, file){
    const buf = Buffer.allocUnsafe((8 + modelFile.nnodes*(7+modelFile.nfeats) + modelFile.ordered_list_of_nodes.length)*4);
    
    var cont = 0;
    buf.writeInt32LE(modelFile.nnodes,cont);
    buf.writeInt32LE(modelFile.nlabels,cont=cont+4);
    buf.writeInt32LE(modelFile.nfeats,cont=cont+4);
    buf.writeFloatLE(modelFile.df,cont=cont+4);
    buf.writeInt32LE(modelFile.bestk,cont=cont+4);
    buf.writeFloatLE(modelFile.K,cont=cont+4);
    buf.writeFloatLE(modelFile.mindens,cont=cont+4);
    buf.writeFloatLE(modelFile.maxdens,cont=cont+4);
    for(var i = 0; i < modelFile.nnodes; i++){
      buf.writeInt32LE(modelFile.nodes[i].id,cont=cont+4);//position
      buf.writeInt32LE(modelFile.nodes[i].truelabel,cont=cont+4);
      buf.writeInt32LE(modelFile.nodes[i].pred,cont=cont+4);
      buf.writeInt32LE(modelFile.nodes[i].nodelabel,cont=cont+4);
      buf.writeFloatLE(modelFile.nodes[i].pathval,cont=cont+4);
      buf.writeFloatLE(modelFile.nodes[i].radius,cont=cont+4);
      buf.writeFloatLE(modelFile.nodes[i].dens,cont=cont+4);
      for(var j = 0; j < modelFile.nfeats; j++){
        buf.writeFloatLE(modelFile.nodes[i].feat[j],cont=cont+4);
      }
    }
    for(i = 0; i < modelFile.nnodes; i++){
      buf.writeInt32LE(modelFile.ordered_list_of_nodes[i],cont=cont+4);
    }
    this.FS.writeFile(file,Buffer.from(buf));
  }

  readClassification(file, title, description){
    return({classification: this.FS.readFile(file,{encoding: 'utf8'}).split("\n"), title: title, description:description})
  }

  writeClassification(classification, file){
    var aux = ""
    classification.classification.map((classification, index) => {
      aux = aux.concat(classification.toString()+"\n");
      return -1;
    });
    this.FS.writeFile(file,aux,{encoding: 'utf8'});
  }

  readDistances(dv, title, description){
    var cont = 0;
    var nsamples = dv.getInt32(cont,true);
    var distances = new Array(nsamples);
    for(var i=0; i<nsamples; i++) {
      distances[i] = new Array(nsamples);
      for(var j=0; j<nsamples; j++) {
        distances[i][j] = dv.getFloat32(cont=cont+4,true);
      }
    }

    return({"distances": distances, title: title, description:description});
  }

  writeDistances(distances, file){
    const buf = Buffer.allocUnsafe((1 + (distances.length^2))*4);

    var cont = 0;
    buf.writeInt32LE(distances.length,cont);

    for(var i=0; i<distances.length; i++) {
      for(var j=0; j<distances.length; j++) {
        buf.writeFloatLE(distances[i][j],cont=cont+4);
      }
    }
    
    this.FS.writeFile(file,Buffer.from(buf));
  }
}