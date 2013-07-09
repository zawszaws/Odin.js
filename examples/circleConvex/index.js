require(
    {
	baseUrl: "../../src/"
    },
    [
	"odin"
    ],
    function( Odin ){
	
	Odin.globalize();
	
	game = new Game({
	    debug: true
	});
	
	game.on("init", function(){
	    vec2_1 = new Vec2;
	    
	    scene = new Scene2D;
	    camera = new Camera2D({
		position: new Vec2( 0, 0 ),
		zoom: 1
	    });
	    
	    ground = new GameObject2D({
		position: new Vec2( 0, -1 ),
		components: [
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 4, 0.25 ),
			allowSleep: false,
			linearDamping: new Vec2( 0.9, 0.9 ),
			angularDamping: 0.9,
			type: RigidBody2D.KINEMATIC
		    })
		]
	    });
	    ground.on("update", function(){
		var body = this.getComponent("RigidBody2D").body,
		    velocity = body.velocity;
		
		if( Input.key("up") ){
		    velocity.y += 0.1;
		}
		if( Input.key("down") ){
		    velocity.y -= 0.1;
		}
		if( Input.key("right") ){
		    velocity.x += 0.1;
		}
		if( Input.key("left") ){
		    velocity.x -= 0.1;
		}
		
		if( Input.key("a") ){
		    body.angularVelocity += 0.05;
		}
		if( Input.key("d") ){
		    body.angularVelocity -= 0.05;
		}
	    });
	    
	    scene.add( ground );
	    
	    ball = new GameObject2D({
		position: new Vec2( 0, 2 ),
		components: [
		    new Sprite2D({
			image: "../content/images/player.png",
			x: 0,
			y: 0,
			w: 64,
			h: 64,
			width: 1,
			height: 1
		    }),
		    new RigidBody2D({
			mass: 1,
			radius: 0.5
		    })
		]
	    });
	    scene.add( ball );
	    
	    if( !Device.mobile ){
		Mouse.on("wheel", function(){
		    camera.zoomBy( -this.wheel*Time.delta*4 );
		});
		Mouse.on("move", function(){
		    
		    if( this.left ){
			camera.translate( vec2_1.set( this.delta.x, this.delta.y ).smul( -Time.delta*0.5 ) );
		    }
		});
	    }
	    else{
		Touches.on("move", function( touch ){
		    camera.translate( vec2_1.set( touch.delta.x, touch.delta.y ).smul( -Time.delta*0.5 ) );
		});
	    }
	    
	    scene.add( camera );
	    
	    this.addScene( scene );
	    this.setScene( scene );
	    this.setCamera( camera );
	});
	
	game.init();
    }
);