/*Game.menu = function(game){

};

var titlescreen;

Game.menu.prototype{
	create:function(game){

	},
	update:function(game){
		this.createButton(game, "Level1", game.world.centerX, game.world.centerY + 32, 300, 100,
	  function(){
			this.state.start('Level1');

	});
	titlescreen = game.add.sprite(game.world.centerX,game.world.centerY,'titlescreen');
	titlescreen.anchot.setTo(0.5,0.5);
	},
	createButton:function(game,string,x,y,w,h,callback) {
		var button1 = game.add.button(x,y,'button',callback,this,2,1,0);

		button1.anchor.setTo(0.5,0.5);
		button1.width = w;
		button1.height = h;

		var txt = game.add.text(button1.x, button1.y, string, {font:"14px Arial", fill:"#fff", align:"center"});
		txt.anchor.setTo(0.5,0.5);
	}
};*/
