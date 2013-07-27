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
            host: "192.168.1.194"
        });
        
        game.on("init", function(){
            // Client Game goes here
            
            this.connect();
        });
        
        game.on("connect", function(){
            // Client Game after connecting to server goes here
        });
        
        game.init();
    }
);