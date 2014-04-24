module.exports = function(grunt) {
	// Configuration for testing with using the qunit.
	grunt.initConfig({
		pkg: '<json:package.json>',
		qunit: {
			files: ['t/test.html']
		},
		jshint: {
			default: {
				src: ['jquery.simple-dtpicker.js'],
				options: {
					eqnull: true,
					loopfunc: true,
				},
				predef: [
					'eqnull', 'eqeqeq'
				]
			}
		},
		jquerymanifest: {
			options: {
				source: grunt.file.readJSON('package.json'),
				overrides: {
					name: "simple-dtpicker", 
					docs: "https://github.com/mugifly/jquery-simple-datetimepicker/blob/master/README.md", 
					demo: "http://mugifly.github.com/jquery-simple-datetimepicker/jquery.simple-dtpicker.html", 
					keywords: ["date","time","picker","input","form","datepicker","timepicker"]
				}
			}
		}
		});

	// Load a module	
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-jquerymanifest');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	// Register a tasks
	grunt.registerTask('test', ['qunit', 'jshint']);
	grunt.registerTask('default', ['jquerymanifest', 'test']);
}
