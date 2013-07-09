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
            var scene = new Scene2D,
                vec2_1 = new Vec2;
            
            scene.add(
                new GameObject2D({
                    position: new Vec2( 0, -1 ),
                    components: [
                        new Box2D({
                            color: new Color("#000000"),
                            extents: new Vec2( 10, 0.5 )
                        }),
                        new RigidBody2D({
                            mass: 0,
                            extents: new Vec2( 10, 0.5 )
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
                        userData: userData,
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
                                        [ 64, 0, 64, 64, 0.5 ],
                                        [ 128, 0, 64, 64, 1 ],
                                        [ 192, 0, 64, 64, 0.1 ]
                                    ]
                                }
                            }),
                            new RigidBody2D({
                                mass: 1,
                                radius: 0.5
                            })
                        ]
                    }),
                    camera = new Camera2D({
                        position: position.clone()
                    });
                
                scene.add( player, camera );
                userData.player = player;
                userData.speed = 3;
                userData.jump = 3;
                userData.canJump = false;
                
                player.components.RigidBody2D.on("collide", function( body, time ){
                    player.userData.canJump = true;
                });
                
                camera.on("update", function(){
                    this.follow( player, 1 / Time.delta );
                });
                
                if( !client.device.mobile ){
                    client.on("keydown", function( key ){
                        var userData = this.userData,
                            body = userData.player.components.RigidBody2D.body,
                            speed = userData.speed,
                            jump = userData.jump,
                            name = key.name;
                        
                        if( name === "up" ){
                            if( userData.canJump ){
                                body.applyImpulse( vec2_1.set( 0, jump ), body.position, true );
                                userData.canJump = false;
                            }
                        }
                        if( name === "right" ){
                            body.applyTorque( -speed, true );
                        }
                        if( name === "left" ){
                            body.applyTorque( speed, true );
                        }
                    });
                    client.on("mousemove", function( mouse ){
                        
                        if( mouse.left ){
                            client.camera.translate( vec2_1.set( mouse.delta.x, mouse.delta.y ).smul( -Time.delta*4 ) );
                        }
                    });
                    client.on("mousewheel", function( mouse ){
                        client.camera.zoomBy( -mouse.wheel*Time.delta*16 );
                    });
                }
                else{
                    client.on("touchend", function( touch ){
                        var userData = this.userData,
                            body = userData.player.components.RigidBody2D.body,
                            jump = userData.jump;
                        
                        if( userData.canJump ){
                            body.applyImpulse( vec2_1.set( 0, jump ), body.position, true );
                            userData.canJump = false;
                        }
                    });
                    client.on("accelerometer", function( accelerometer ){
                        var userData = this.userData,
                            body = userData.player.components.RigidBody2D.body,
                            speed = userData.speed;
                        
                        body.applyTorque( accelerometer.y * 2 * speed, true );
                    });
                }
                
                this.setScene( client, scene );
                this.setCamera( client, camera );
            });
            
            
            this.on("disconnect", function( id ){
                var client = this.clients[ id ],
                    scene = client.scene,
                    player = client.scene.findById( client.userData.player._id ),
                    camera = client.scene.findById( client.camera._id );
                
                console.log(id);
                
                scene.remove( player, camera );
            });
            
            this.addScene( scene );
        });
        
        game.init();
    }
);