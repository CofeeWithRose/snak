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
	}else if (!compment.name){
		throw compment +" the compment has no name ";
	}if(compment.name==="Transform"){
    var keys=Object.keys(compment);
    for (var i = keys.length - 1; i >= 0; i--) {
      this.compmentMap.Transform[keys[i]]=compment[keys[i]];
    }
  }else{
		this.compmentMap[compment.name]=compment;
		compment.transform=this.compmentMap.Transform;
  }
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
	}
  
};
GameObject.prototype.setChild=function(obj){

  if (!(obj instanceof GameObject)) {
    throw obj +" is not a GameObject";
  }
  if (obj.id) {
     this.children[obj.id]=obj;
  }
  
};


function Compment(){

};
Compment.prototype.awake = function() {
 // console.log("awake........");
};
Compment.prototype.start = function() {
  //console.log("start.......");
};
Compment.prototype.update = function() {
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

var Util=function(){
    function _guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    };
    function _stringify(obj){
       var record=[];

       function replacer(key,value){
          if(value instanceof Image){
              value={src:value.src};
          }else if(!value._){
             value._=1;
             record.push(value);
          }else{
            return undefined;
          }
           return value;
        };

        var str=JSON.stringify(obj,replacer).replace(/"_":1/g,"").replace(/,}/g,"}");
         
        for (var i = record.length - 1; i >= 0; i--) {
           delete record[i]._;
        };
        return str;
    };
    function _parseInt(number) {
    return number*1 | 0 || 0;
}
    return {
      stringify:_stringify,
      guid:_guid,
      parseInt:_parseInt
    }
};
Util=Util();

var Time={
    frameCount:0,
    startTime:0,
    delTime:0,
    lastTime:0,
    gamTime:0,
    update:function(){
        var now=new Date().getTime();
         Time.frameCount++;
         Time.delTime=now-Time.lastTime;
         Time.lastTime=now;
         Time.gamTime=now-Time.startTime;
    }
 
};
var Input=function(){
   var _getKeyUp=function(key){
     return Input.up[key];
  };
return{
  getKeyUp:_getKeyUp
}
};
Input=Input();
Input.down={};
Input.up={};
Input.update=function(){
  var d=Object.keys(Input.down);
  var u=Object.keys(Input.up);
  for (var i = d.length - 1; i >= 0; i--) {
    Input.down[d[i]]=false;
  }
  for (var i = u.length - 1; i >= 0; i--) {
    Input.up[u[i]]=false;
  }
}
window.addEventListener("keydown",function(e){
  Input[e.key]=true;
  Input.down[e.key]=true;
});
window.addEventListener("keyup",function(e){
  Input[e.key]=false;
  Input.up[e.key]=true;
});

var ResourceFactory=function(){
    var source={};
    var _getResource=function(type,src){

        if (source[type]&&source[type][src]) {
          return source[type][src];
        }else {
          if (!source[type]) {
             source[type]={};
          }
          var temp=new window[type]();
          temp.src=src;
          source[type][src]=temp;
         // console.log("load resource");
          return temp;
        }
    }
    return{
      getResource:_getResource
    }
};
ResourceFactory=ResourceFactory();

var Screen=function(){
   var _position={x:0,y:0};
   var canvas=document.getElementById("canvas");
   canvas.width=canvas.clientWidth;
   canvas.height=canvas.clientHeight;
   var context=canvas.getContext("2d");
   var fps=document.getElementById("FPS");
   var _draw=function(obj,x,y,w,h){
        context.drawImage(obj,x,y,w,h);
   }
   var _showFps=function(){

     if (Time.frameCount%100==1) {
          fps.innerHTML=Util.parseInt(1000/Time.delTime);
      }    
   };
   var _clear=function(){
     context.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
     
   }
   return{
   	position:_position,
   	draw:_draw,
    clear:_clear,
    showFps:_showFps
   }
};
Screen=Screen();

var HitManager=function HitManager(){
   var woeker=new Worker("Worker/hitTest.js");
   var borderMap={};
   var hiterMap={};

   var onHitTaskMap={};

   var borderList=[];
   var hiterList=[];



   var _registBorder=function _registBorder(border,isHiter){

        if (isHiter) {
          hiterList.push(border);
          hiterMap[border.id]=border;
        }else{
           borderList.push(border);
           borderMap[border.id]=border;
        }
        var gameObject=GE.findGameObjectById(border.id);
        var compmentMap=gameObject.compmentMap;
        var compNames=Object.keys(compmentMap);

        var onHitTaskList=[];
        for (var i = compNames.length - 1; i >= 0; i--) {
             var hitFn=compmentMap[compNames[i]][isHiter? "onHit":"onHitted"];

           if(hitFn){

              onHitTaskList.push(hitFn);
           }
        }

        onHitTaskMap[gameObject.id]=onHitTaskList;
   };

   var _cancellBorder=function _cancellBordrt(id){

      if (borderMap[id]) {
        borderList.splice(borderList.indexOf(borderMap[id]),1);
        delete  onHitTaskMap[id];
        delete borderMap[id];
      }
      if (hiterMap[id]) {
          hiterList.splice(hiterList.indexOf(hiterMap[id]),1);
        delete  onHitTaskMap[id];
        delete hiterMap[id];
      }
        
   };

   var _update=function hitUpdate(){
    console.log("send req..");
      var req={};
      req.border=borderList;
      req.hiter=hiterList;
      woeker.postMessage(req);
      woeker.onMessage=function onHitPPross(e){
        console.log("hit test");
        var resu=e.data;
        for (var i = resu.length - 1; i >= 0; i--) {
           onHit(resu[i].hiter,resu.border);
        }
         
      }
   };

   //after hited ,hiterBoder add attribuilt named position which record the position of the object hitting.
   //at same time ,border also add attribuilt named position which record the position that objet hited it.
   var onHit=function(hiterBorder,border){
      var hitTrans=GE.findGameObjectById(hiterBorder.id).getCompment("Transform");
      var borderTrans=GE.findGameObjectById(border.id).getCompment("Transform");
      var resultHitFns=hiterMap[hiterBorder.id];
      var resultHitedFns=borderMap[boder.id];
      for (var i = resultHitFns.length - 1; i >= 0; i--) {
        resultHitFns[i](border.position,borderTrans);
      }
      for (var i = resultHitedFns.length - 1; i >= 0; i--) {
        resultHitedFns[i](hiterBorder.position,borderTrans);
      }
   };
  return{
    registBorder:_registBorder,
    cancellBorder:_cancellBorder,
    update:_update
  }

};
HitManager=HitManager();

var GE=function () {

	var impMap={Transform:"Transform"};
    var completeNum=1;

    var gameObjMap={};

    var awakeTask=[];
    var startTask=[];
    var updateTask=[];
    var updateTaskMap={};

    var _import=function (nameList) {
    	for (var i = nameList.length - 1; i >= 0; i--) {
    		var filename=nameList[i];
    		if (!(impMap[filename]||(window[filename] instanceof Compment))) {
    			impMap[filename]=filename;
          loadScript(filename);
    		}
    	}
    	
    };
    var loadScript=function(filename){
        var script=document.createElement("script");
        script.type="text/javascript";
        script.src="compment/"+filename+".js";
        document.body.appendChild(script);
        script.onload=function(){
          completeNum++;
          var Fn=window[filename];
          if ((typeof Fn)=="function") {
            window[filename].prototype=Compment.prototype;
          }else{
            throw filename+ " is not a function";
          }
          
        }
    };

    var listen=function (completeTask) {
    	if (Object.keys(impMap).length===completeNum) {
    		Time.startTime=new Date().getTime();
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
         doOnceTask(awakeTask);
         doOnceTask(startTask);
         startTask=[];
         awakeTask=[];
         Time.update();
         Screen.showFps();
        requestAnimationFrame(prosessGame);
        //setTimeout(prosessGame, 40);
         Screen.clear();

         doUpdate();
         Input.update();

    };

    var doOnceTask=function(taskList){
        for (var i = taskList.length - 1; i >= 0; i--) {
        	taskList[i]();
        }
    };
    var doUpdate=function doUpdate(){
        for (var i = updateTask.length - 1; i >= 0; i--) {
           updateTask[i]();
        }
    };
    var refreshUpdateTask=function(){
        updateTask=[];
        var nowTask=Object.keys(updateTaskMap);
          for (var i = nowTask.length - 1; i >= 0; i--) {
            var task=updateTaskMap[nowTask[i]];
            for (var j = task.length - 1; j >= 0; j--) {
              updateTask.push(task[j]);
            }
          }
        nowTask=null;
    };
    
    var _findGameObjectById=function(id){
        return gameObjMap[id];
    };
    var _insGamObj=function(obj){
          if (obj instanceof GameObject) {
          	checkName(obj);
          	gameObjMap[obj.id]=obj;
          	combineList(awakeTask,getTaskList(obj,"awake"));
            combineList(startTask,getTaskList(obj,"start"));
            updateTaskMap[obj.id]=getTaskList(obj,"update");

            var children=Object.keys(obj.children);
        	for (var i = children.length - 1; i >= 0; i--) {

        		_insGamObj(obj.children[children[i]]);
        	}
          }else{
	          throw obj +"is not a GameObject";
          }
          refreshUpdateTask();
       /*console.log("x: "+obj.getCompment("Transform").position.x);*/
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
    var getTaskList=function(obj,type){
        var compList=Object.keys(obj.compmentMap);
        var tasks=[];
        for (var i = compList.length - 1; i >= 0; i--) {
        	tasks.push(obj.compmentMap[compList[i]][type]);
        }
        compList=null;
        return tasks;
    };
    var combineList=function(listA,listB){
        for (var i = listB.length - 1; i >= 0; i--) {
        	listA.push(listB[i]);
        }
    };

	return {
		import:_import,
		start:_startGame,
		instantGameObject:_insGamObj,
    findGameObjectById:_findGameObjectById
	};
};
GE=GE();