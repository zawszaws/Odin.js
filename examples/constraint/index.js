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
	    var vec2_1 = new Vec2,
		scene = new Scene2D,
		camera = new Camera2D;
	    
	    box1 = new GameObject2D({
		position: new Vec2( -1, 2 ),
		components: [
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 0.25, 0.25 )
		    })
		]
	    });
	    box2 = new GameObject2D({
		position: new Vec2( -0.5, 2 ),
		components: [
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 0.25, 0.25 )
		    })
		]
	    });
	    box3 = new GameObject2D({
		position: new Vec2( 0, 2 ),
		components: [
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 0.25, 0.25 )
		    })
		]
	    });
	    box4 = new GameObject2D({
		position: new Vec2( 0.5, 2 ),
		components: [
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 0.25, 0.25 )
		    })
		]
	    });
	    box5 = new GameObject2D({
		position: new Vec2( 1, 2 ),
		components: [
		    new RigidBody2D({
			mass: 0,
			extents: new Vec2( 0.25, 0.25 )
		    })
		]
	    });
	    
	    ball1 = new GameObject2D({
		position: new Vec2( -2, 2 ),
		components: [
		    new RigidBody2D({
			mass: 1,
			radius: 0.25
		    })
		]
	    });
	    ball2 = new GameObject2D({
		position: new Vec2( -0.5, 0 ),
		components: [
		    new RigidBody2D({
			mass: 1,
			radius: 0.25
		    })
		]
	    });
	    ball3 = new GameObject2D({
		position: new Vec2( 0, 0 ),
		components: [
		    new RigidBody2D({
			mass: 1,
			radius: 0.25
		    })
		]
	    });
	    ball4 = new GameObject2D({
		position: new Vec2( 0.5, 0 ),
		components: [
		    new RigidBody2D({
			mass: 1,
			radius: 0.25
		    })
		]
	    });
	    ball5 = new GameObject2D({
		position: new Vec2( 1, 0 ),
		components: [
		    new RigidBody2D({
			mass: 1,
			radius: 0.25
		    })
		]
	    });
	    
	    scene.world.pworld.addConstraint(
		new PDistanceConstraint2D(
		    box1.getComponent("RigidBody2D").body,
		    ball1.getComponent("RigidBody2D").body,
		    2
		)
	    );
	    scene.world.pworld.addConstraint(
		new PDistanceConstraint2D(
		    box2.getComponent("RigidBody2D").body,
		    ball2.getComponent("RigidBody2D").body,
		    2
		)
	    );
	    scene.world.pworld.addConstraint(
		new PDistanceConstraint2D(
		    box3.getComponent("RigidBody2D").body,
		    ball3.getComponent("RigidBody2D").body,
		    2
		)
	    );
	    scene.world.pworld.addConstraint(
		new PDistanceConstraint2D(
		    box4.getComponent("RigidBody2D").body,
		    ball4.getComponent("RigidBody2D").body,
		    2
		)
	    );
	    scene.world.pworld.addConstraint(
		new PDistanceConstraint2D(
		    box5.getComponent("RigidBody2D").body,
		    ball5.getComponent("RigidBody2D").body,
		    2
		)
	    );
	    
	    scene.add( box1, box2, box3, box4, box5, ball1, ball2, ball3, ball4, ball5 );
	    
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