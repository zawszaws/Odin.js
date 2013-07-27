({
    baseUrl: "../src/",
    name: "odindoc",
    
    optimize: "uglify2",
    uglify2: {
	
        output: {
	    beautify: true,
	    comments: true
	},
	compress: {
	    sequences: false
	},
	warnings: true,
	mangle: false
    },
    
    out: "./odin.js",
})