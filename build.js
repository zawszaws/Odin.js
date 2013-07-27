({
    baseUrl: "./src/",
    name: "odin",
    
    optimize: "uglify2",
    uglify2: {
	warnings: true,
	mangle: false
    },
    
    out: "./build/odin.js",
})