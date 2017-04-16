function BorderFactory(infoList,bottom,isShow,stage) {
	this.name="BorderFactory";
	var num=10;
	//{x0:23,y0:45,x1:34,y1:455,type:}
	for (var i = infoList.length - 1; i >= 0; i--) {
		var info=infoList[i];
		var w=info.x1-info.x0;
		var h=info.type? info.y1-info.y0:10;

		var mapB1=new GameObject();
	     mapB1.name="ground"+num;
	     var border=mapB1.addCompment(new HitBorder());
	     border.isShow=isShow;
	     border.setBorder(0,0,w,h);
	     stage.setChild(mapB1);
	     var trans=mapB1.getCompment('Transform').position={x:info.x0,y:bottom+info.y0};
	}
}