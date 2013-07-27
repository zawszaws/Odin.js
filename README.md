Odin.js
=======

Canvas/WebGL Javascript Game Engine

[Examples](http://lonewolfgames.github.io/Odin.js/) - [Documentation](http://lonewolfgames.github.io/Odin.js/doc/)


## How to use
```
// install the odin.js package
// npm package is not updated as much as the github repository
// right now it is better to build from source
$ npm install odin -g

// create odin game dir, changing permision on the new folder is probably needed
$ odin path/to/game
$ cd path/to/game

// install npm packages
$ npm install

// start the server
$ node server/index.js
```

## Basic Game

### Client index.js
```
require(
    {
        baseUrl: "./"
    },
    [
        "odin",
    ],
    function( Odin ){
        
        Odin.globalize();
        
        game = new ClientGame({
            debug: true,
            host: "127.0.0.1",
            port: 3000
        });
    }
);
```

### Server index.js
```
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
            host: "127.0.0.1",
            port: 3000
        });
        
        game.on("init", function(){
            var scene = new Scene;
            
            this.on("client_init", function( id ){
                var client = this.clients[ id ],
                    userData = client.userData,
                    
                    position = new Vec2( Mathf.randFloat( -5, 5 ), Mathf.randFloat( -5, 5 ) ),
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
                        camera2d = this.camera2d,
                        position = this.transform2d.position,
                        dt = Time.delta;
                    
                    camera2d.zoom -= wheel * dt;
                    
                    if( client.mouseButton(0) ){
                        position.x -= mouseX * dt;
                        position.y += mouseY * dt;
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
            
            this.addScene( scene );
        });
        
        game.init();
    }
);
```