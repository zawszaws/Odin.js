require(
    {
	baseUrl: "../../src/"
    },
    [
	"odin"
    ],
    function( Odin ){
	
	Odin.globalize();
	
	
	Assets.add(
	    new ImageAsset({
		name: "img_player",
		src: "../content/images/player.png"
	    }),
	    new SpriteSheetAsset({
		name: "anim_player",
		src: "../content/spritesheets/player.json"
	    })
	);
	
	game = new Game({
	    debug: true,
	    forceCanvas: true
	});
	
	game.on("init", function(){
	    vec2_1 = new Vec2;
	    
	    scene = new Scene;
	    
	    camera = new GameObject({
		components: [
		    new Transform2D({
			position: new Vec2( 0, 0 )
		    }),
		    new Camera2D({
			zoom: 1
		    })
		]
	    });
	    camera.on("update", function(){
		var wheel = Input.axis("mouseWheel"),
		    mouseX = Input.axis("mouseX"),
		    mouseY = Input.axis("mouseY"),
		    touch = Input.touch(0),
		    camera2d = this.camera2d,
		    position = this.transform2d.position,
		    dt = Time.delta,
		    speed;
		
		camera2d.zoom -= wheel * dt;
		speed = camera2d.zoom * 0.25;
		
		if( Input.mouseButton(0) ){
		    position.x -= mouseX * speed * dt;
		    position.y += mouseY * speed * dt;
		}
		if( touch ){
		    position.x -= touch.delta.x * speed * dt;
		    position.y += touch.delta.y * speed * dt;
		}
	    });
	    
	    sprite = new GameObject({
		components: [
		    new Transform2D({
			position: new Vec2( 0, 0 )
		    }),
		    new Sprite2D({
			image: Assets.get("img_player"),
			x: 0,
			y: 0,
			w: 64,
			h: 64,
			width: 1,
			height: 1,
			mode: Sprite2D.PINGPONG,
			animations: Assets.get("anim_player")
		    })
		]
	    });
	    sprite.on("update", function(){
		var position = this.transform2d.position,
		    
		    x = Input.axis("horizontal"),
		    y = Input.axis("vertical"),
		    
		    speed = 5,
		    dt = Time.delta;
		
		position.x += x * speed * dt;
		position.y += y * speed * dt;
	    });
	    
	    sprite2 = new GameObject({
		components: [
		    new Transform2D({
			position: new Vec2( 0, -2 )
		    }),
		    new Sprite2D({
			image: Assets.get("img_player"),
			x: 0,
			y: 0,
			w: 64,
			h: 64,
			width: 1,
			height: 1,
			mode: Sprite2D.PINGPONG,
			animations: Assets.get("anim_player")
		    })
		]
	    });
	    
	    scene.add( camera, sprite, sprite2 );
	    
	    this.addScene( scene );
	    this.setScene( scene );
	    this.setCamera( camera );
	});
	
	game.init();
    }
);