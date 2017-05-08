function GameObject() {
	this.id=Util.guid();
	this.children={};
	this.parent;
	this.name;
	this.compmentMap={};
	this.compmentMap.Transform=new Transform();
  this.compmentMap.Transform.gameObject=this;
  this.compmentMap.Transform.compmentMap=this.compmentMap;
};
GameObject.prototype.equals = function(first_argument) {
	return this.id===this.id;
};
GameObject.prototype.getChildByInd=function (ind) {
	return this.children[Object.keys(this.children)[ind]];
};
GameObject.prototype.getChildByName=function(name){
	return children[name];
};
GameObject.prototype.addCompment = function(compment) {

	if (!(compment instanceof Compment)) {
        throw compment +" is not a compment";
	}
  if(compment.name==="Transform"){
    var keys=Object.keys(compment);
    for (var i = keys.length - 1; i >= 0; i--) {
      this.compmentMap.Transform[keys[i]]=compment[keys[i]];
    }
  }else{
		this.compmentMap[compment.name]=compment;
		compment.transform=this.compmentMap.Transform;
  }
  var THIS=this;
  requestAnimationFrame(function(){GE.addTask(THIS,compment);});

  return compment;
};

GameObject.prototype.getCompment=function(name){
  return this.compmentMap[name];
};

GameObject.prototype.setParent=function(parentObj){

	if (!(parentObj instanceof GameObject)) {
		throw parentObj +" is not a GameObject";
	}
	if (this.name) {
		 parentObj.children[this.id]=this;
     this.parent=parentObj;
	}
};
GameObject.prototype.removeParent=function(){
  if (this.parent) {
    delete this.parent.children[this.id];
    this.parent=undefined;
  }
};
GameObject.prototype.setChild=function(obj){
  if (!(obj instanceof GameObject)) {
    throw obj +" is not a GameObject";
  }
  if (obj.id) {
     this.children[obj.id]=obj;
     obj.parent=this;
  }
};
GameObject.prototype.removeChild=function(obj){
  if (this.children[obj.id]) {
    delete this.children[obj.id];
    obj.parent=undefined;
  }
};
GameObject.prototype.destroySelf = function() {
    GE.destroyGameObject(this);
};


function Compment(){

};
Compment.prototype.awake = function() {
 // console.log("awake........");
};
Compment.prototype.start = function() {
  //console.log("start.......");
};
Compment.prototype.earlyUpdate = function() {
  //console.log("update.....");
};
Compment.prototype.update = function() {
  //console.log("update.....");
};
Compment.prototype.lateUpdate = function() {
  //console.log("update.....");
};
Compment.prototype.setName = function(val) {
  this.name=val;
};

function Transform(){
/*  console.log("trans id : "+this.id);*/
  this.compmentMap;
    this.name="Transform";
    this.position={x:0,y:0};
    this.rotation=0;
    this.scale={x:1,y:1};
    var _pro=this;
    this.setPosition=function(val){
      _pro.position=val;
    };
    this.setRotation=function(val){
      _pro.rotation=val;
    };
    this.setScale=function(val){
       _pro.scale=val;
    };
}
Transform.prototype=Compment.prototype;
Transform.prototype.getCompment=function(name){
    return this.compmentMap[name];
};

var GE=function () {

	  var impMap={Transform:"Transform"};
    var completeNum=1;

    var gameObjMap={};

    var awakeTask=[];
    var startTask=[];

    var earlyUpdateTask=[];
    var earlyUpdateTaskMap={};

    var updateTask=[];
    var updateTaskMap={};

    var lateUpdateTask=[];
    var lateUpdateTaskMap={};

    var serviceList=[];

    var _import=function (nameList) {
    	for (var i = nameList.length - 1; i >= 0; i--) {
    		var filename=nameList[i];
        if (/Service$/.test(filename)) {
         serviceList.push(filename.substring(0,filename.length-7));
        }
    		if (!(impMap[filename]||(window[filename] instanceof Compment))) {
    			impMap[filename]=filename;
          loadScript(filename);
    		}
    	}
    };
    var loadScript=function(filename){
      var path;
      if (/Service$/.test(filename)) {
        filename=filename.substring(0,filename.length-7);
        path="service/"+filename+".js"
      }else{
        path="compment/"+filename+".js";
      }
        var script=document.createElement("script");
        script.type="text/javascript";
        script.src=path;
        document.body.appendChild(script);
        script.onload=function(){
          completeNum++;
          var Fn=window[filename];
          if ((typeof Fn)=="function") {
            window[filename].prototype=Compment.prototype;
            //console.log(filename+" add compment prototype");
          }else{
            throw filename+ " is not a function";
          }
/*          if (window[filename]&&serviceList.indexOf(filename)!==-1) {
            throw "Service 【"+ filename+ "】  is existed";
          }*/
        }
    };

    var startService=function(){
      var temp={};

      for (var i = serviceList.length - 1; i >= 0; i--) {
        if(!temp[serviceList[i]]){
         window[serviceList[i]]=window[serviceList[i]]();
         temp[serviceList[i]]=1;
       }
     }
     temp=undefined;
     serviceList=undefined;
   };

    var listen=function (completeTask) {
    	if (Object.keys(impMap).length===completeNum) {
    		
        startService();
    		completeTask();

    		prosessGame();
    	}else{
    		setTimeout(function() {listen(completeTask)}, 100);
    	}
    };
    
    var _startGame=function(namelist,completeTask){
          _import(namelist);
          listen(completeTask);
    };
    var prosessGame=function(){
         HitManager.update();
         doTask(awakeTask);
         doTask(startTask);
         startTask=[];
         awakeTask=[];
         Screen.clear();
         doTask(earlyUpdateTask);
         doTask(updateTask);
         Time.update();
         Screen.showFps();
        requestAnimationFrame(prosessGame);
        //setTimeout(prosessGame, 40);
        doTask(lateUpdateTask);
    };

    var doTask=function(taskList){
        for (var i =0;i<taskList.length; i++) {
        	taskList[i]();
        }
    };
    
    var _findGameObjectById=function(id){
        return gameObjMap[id];
    };
    var _addTask=function(obj,compment){
        
        if (!gameObjMap[obj.id]) {
          checkName(obj);
          gameObjMap[obj.id]=obj;
        }
        if (!updateTaskMap[obj.id]) {
          updateTaskMap[obj.id]={};
        }
        if (!lateUpdateTaskMap[obj.id]) {
          lateUpdateTaskMap[obj.id]={};
        }
         if (!earlyUpdateTaskMap[obj.id]) {
          earlyUpdateTaskMap[obj.id]={};
        }


        awakeTask.push(compment["awake"].bind(compment));
        startTask.push(compment["start"].bind(compment));

        var upTask=compment["update"].bind(compment);
        updateTaskMap[obj.id][compment.name]=upTask;
        updateTask.push(upTask);

        if (compment["lateUpdate"]) {
          var lateTsk=compment["lateUpdate"].bind(compment);
          lateUpdateTaskMap[obj.id][compment.name]=lateTsk;
          lateUpdateTask.push(lateTsk);
        }
         if (compment["earlyUpdate"]) {
          var earlyTsk=compment["earlyUpdate"].bind(compment);
          earlyUpdateTaskMap[obj.id][compment.name]=earlyTsk;
          earlyUpdateTask.push(earlyTsk);
        }
        //console.log(compment["update"]);
    };

    var _destroyGameObject=function(obj){

        if (gameObjMap[obj.id]) {
           delete gameObjMap[obj.id];

           var compNames=Object.keys(updateTaskMap[obj.id]);
           for (var i = compNames.length - 1; i >= 0; i--) {

             var updateFn=updateTaskMap[obj.id][compNames[i]];
             var index=updateTask.indexOf(updateFn);
             if (index!==-1) {
               updateTask.splice(index,1);
             }

             var lateUpdateFn=lateUpdateTaskMap[obj.id][compNames[i]];
             var lateIndex=lateUpdateTask.indexOf(lateUpdateFn);
             if (lateIndex!==-1) {
               lateUpdateTask.splice(lateIndex,1);
             }

             var earlyUpdateFn=earlyUpdateTaskMap[obj.id][compNames[i]];
             var earlyIndex=earlyUpdateTask.indexOf(earlyUpdateFn);
             if (earlyIndex!==-1) {
               earlyUpdateTask.splice(earlyIndex,1);
             }
           }
           delete lateUpdateTaskMap[obj.id];
           delete updateTaskMap[obj.id];
           delete earlyUpdateTaskMap[obj.id];
           HitManager.cancellBorder(obj.id);

           if (obj.parent) {
              obj.removeParent();
           }

        }
    };

    var checkName=function(obj){

    	var name=obj.name;
    	if (!name) {
    		throw  obj+" does not have a name";
    	}
       if (gameObjMap[name]) {
       	  var num=name.match(/\([\d]{1,1000}\)/g);
       	 
       	  if (num) {
              num=num[num.length-1];
       	  	  name-=num;
              num=1+Util.parseInt(num.match(/[\d]{1,1000}/)[0],10);
       	  }else{
            num=1;
          }
              name+="("+num+")";
              obj.name=name;
       }
    };

	return {
		import:_import,
		start:_startGame,
		addTask:_addTask,//obj,compment
    findGameObjectById:_findGameObjectById,
    destroyGameObject:_destroyGameObject
	};
};
GE=GE();