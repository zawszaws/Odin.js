var requirejs = require("requirejs"),
    Odin = require("odin");

requirejs(
    {
        baseUrl: __dirname,
        nodeRequire: require
    },
    function(){
        
        Odin.globalize();
        
        var game = new ServerGame({
            host: "192.168.1.191",
            port: 3000,
            debug: true
        });
        
        game.on("init", function(){
            var scene = new Scene2D({
                    gravity: new Vec2( 0, 0 )
                }),
                vec2_1 = new Vec2;
            
            scene.add(
                new GameObject2D({
                    position: new Vec2( 0, -8 ),
                    components: [
                        new Box2D({
                            color: new Color("#000000"),
                            extents: new Vec2( 8, 0.1 )
                        }),
                        new RigidBody2D({
                            mass: 0,
                            extents: new Vec2( 8, 0.1 )
                        })
                    ]
                }),
                new GameObject2D({
                    position: new Vec2( 0, 8 ),
                    components: [
                        new Box2D({
                            color: new Color("#000000"),
                            extents: new Vec2( 8, 0.1 )
                        }),
                        new RigidBody2D({
                            mass: 0,
                            extents: new Vec2( 8, 0.1 )
                        })
                    ]
                }),
                new GameObject2D({
                    position: new Vec2( -8, 0 ),
                    components: [
                        new Box2D({
                            color: new Color("#000000"),
                            extents: new Vec2( 0.1, 8 )
                        }),
                        new RigidBody2D({
                            mass: 0,
                            extents: new Vec2( 0.1, 8 )
                        })
                    ]
                }),
                new GameObject2D({
                    position: new Vec2( 8, 0 ),
                    components: [
                        new Box2D({
                            color: new Color("#000000"),
                            extents: new Vec2( 0.1, 8 )
                        }),
                        new RigidBody2D({
                            mass: 0,
                            extents: new Vec2( 0.1, 8 )
                        })
                    ]
                })
            );
            
            this.on("connection", function( id ){
                var client = this.clients[ id ],
                    userData = client.userData,
                    position = new Vec2( Mathf.randFloat( -6, 6 ), Mathf.randFloat( 0, 2 ) ),
                    player = new GameObject2D({
                        position: position,
                        components: [
                            new Sprite2D({
                                image: "../assets/player.png",
                                x: 0,
                                y: 0,
                                w: 64,
                                h: 64,
                                width: 1,
                                height: 1,
                                animations: {
                                    idle: [
                                        [ 0, 0, 64, 64, 0.25 ],
                                        [ 64, 0, 64, 64, 0.5 ]
                                    ],
                                    walk_up: [
                                        [ 0, 0, 64, 64, 0.1 ],
                                        [ 64, 0, 64, 64, 0.1 ]
                                    ]
                                }
                            }),
                            new RigidBody2D({
                                mass: 1,
                                elasticity: 0,
                                angularDamping: 1,
                                linearDamping: new Vec2( 0.9999, 0.9999 ),
                                radius: 0.5
                            })
                        ]
                    }),
                    camera = new Camera2D({
                        position: position.clone()
                    });
                
                scene.add( player, camera );
                
                userData.player = player;
                userData.speed = 1;
                
                client.on("keydown", function( key ){
                    var body = this.userData.player.components.RigidBody2D.body,
                        velocity = body.velocity,
                        speed = this.userData.speed,
                        name = key.name;
                    
                    if( name === "up" ) velocity.y += speed;
                    if( name === "down" ) velocity.y -= speed;
                    if( name === "right" ) velocity.x += speed;
                    if( name === "left") velocity.x -= speed;
                });
                
                client.on("mousemove", function( mouse ){
                    if( mouse.left && client.camera ){
                        client.camera.translate( vec2_1.copy( mouse.delta ).smul( -Time.delta*4 ) );
                    }
                });
                client.on("mousewheel", function( mouse ){
                    client.camera.zoomBy( -mouse.wheel*Time.delta*16 );
                });
                
                camera.on("update", function(){
                    this.follow( player, 1 / ( Time.delta * 2 ) );
                });
                
                this.setScene( client, scene );
                this.setCamera( client, camera );
            });
            
            
            this.on("disconnect", function( id ){
                var client = this.clients[ id ],
                    scene = client.scene,
                    player = client.scene.findById( client.userData.player._id ),
                    camera = client.scene.findById( client.camera._id );
                
                scene.remove( camera, player );
            });
            
            this.addScene( scene );
        });
        
        game.init();
    }
);