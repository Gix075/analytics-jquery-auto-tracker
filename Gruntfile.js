module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist'],
        copy: {
            dist: {
                files: [
                    {
                        src: ['src/demo.css*'],
                        dest: 'dist/demo.css'
                    }
            ]
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/jquery.ga-trackers.pack.min.js': ['src/jquery.ga-trackers.onscroll.js', 'src/jquery.ga-trackers.js'],
                    'dist/jquery.ga-trackers.min.js': ['src/jquery.ga-trackers.js'],
                    'dist/jquery.ga-trackers.onscroll.min.js': ['src/jquery.ga-trackers.onscroll.js'],
                }
            }
        },
        processhtml: {
            dist: {
              files: {
                'dist/index.html': ['src/index.html']
              }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('default', ['clean','copy','uglify','processhtml']);

};