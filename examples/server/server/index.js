var requirejs = require("requirejs"),
    Odin = require("odin");

requirejs(
    {
        baseUrl: __dirname,
        nodeRequire: require
    },
    function(){
        
        Odin.globalize();
        
        
        Assets.add(
	    new ImageAsset({
		name: "img_player",
		src: "../assets/player.png"
	    }),
	    new SpriteSheetAsset({
		name: "anim_player",
		src: "../assets/player.json"
	    })
	);
        
        
        var game = new ServerGame({
            debug: true,
            host: "192.168.1.194"
        });
        
        game.on("init", function(){
            scene = new Scene;
            
            ground = new GameObject({
                components: [
                    new Transform2D({
                        position: new Vec2( 0, -1 )
                    }),
                    new Sprite2D({
                        image: Assets.get("img_player"),
			x: 0,
			y: 0,
			w: 64,
			h: 64,
			width: 10,
			height: 1,
			mode: Sprite2D.PINGPONG,
			animations: Assets.get("anim_player")
                    })
                ]
            });
            
            this.on("client_init", function( id ){
                var client = this.clients[ id ],
                    userData = client.userData,
                    
                    position = new Vec2( Mathf.randFloat( -5, 5 ), Mathf.randFloat( 0, 5 ) ),
                    camera = new GameObject({
                        components: [
                            new Transform2D({
                                position: new Vec2( position )
                            }),
                            new Camera2D
                        ]
                    }),
                    player = new GameObject({
                        components: [
                            new Transform2D({
                                position: new Vec2( position )
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
                
                userData.player = player;
                userData.camera = camera;
                
                
                player.on("update", function(){
                    var position = this.transform2d.position,
                        x = client.axis("horizontal"),
                        y = client.axis("vertical");
                    
                    position.x += x * 5 * Time.delta;
                    position.y += y * 5 * Time.delta;
                });
                camera.on("update", function(){
                    var wheel = client.axis("mouseWheel"),
                        mouseX = client.axis("mouseX"),
                        mouseY = client.axis("mouseY"),
                        touch = client.touch(0),
                        camera2d = this.camera2d,
                        position = this.transform2d.position,
                        dt = Time.delta,
                        speed;
                    
                    camera2d.zoom -= wheel * dt;
                    speed = camera2d.zoom * 0.25;
                    
                    if( client.mouseButton(0) ){
                        position.x -= mouseX * dt;
                        position.y += mouseY * dt;
                    }
                    if( touch ){
                        position.x -= touch.delta.x * speed * dt;
                        position.y += touch.delta.y * speed * dt;
                    }
                });
                
                scene.addGameObjects( player, camera );
                
                client.setScene( scene );
                client.setCamera( camera );
            });
            
            this.on("client_disconnect", function( id ){
                var client = this.clients[ id ],
                    userData = client.userData;
                
                scene.removeGameObjects( userData.player, userData.camera );
            });
            
            scene.add( ground );
            this.addScene( scene );
        });
        
        game.init();
    }
);