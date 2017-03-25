module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json');
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint']);

};