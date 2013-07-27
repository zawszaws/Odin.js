({
    include: "../../requirejs/require.js",
    
    baseUrl: "./node_modules/odin/src/",
    name: "odin",
    
    optimize: "uglify2",
    uglify2: {
        warnings: true,
	 mangle: false
    },
    
    out: "./client/odin.js",
})