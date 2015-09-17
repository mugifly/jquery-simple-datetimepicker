module.exports = function(grunt) {
	grunt.initConfig({
		pkg: '<json:package.json>',
		// Test with using QUnit
		qunit: {
			files: ['t/test.html']
		},
		// Syntax check with using JSHint
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
		// Sync manifest for bower.json
		manifestSync: {
			dist: {
				options: {
					primaryManifest: "package.json",
					manifests: {
						bower: "bower.json"
					}
				}
			}
		}
	});

	// Load a module
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-manifest-sync');

	// Register a tasks
	grunt.registerTask('test', ['qunit', 'jshint']);
	grunt.registerTask('default', ['manifestSync', 'test']);
}
