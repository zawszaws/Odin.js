({
    baseUrl: "./src/",
    name: "odin",
    
    optimize: "uglify2",
    uglify2: {
	warnings: true,
	mangle: true
    },
    
    out: "./build/odin.js",
})