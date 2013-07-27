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
            host: "192.168.1.197"
        });
        
        game.on("init", function(){
            // Client Game goes here
        });
    }
);