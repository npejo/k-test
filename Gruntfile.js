'use strict';

module.exports = function (grunt) {

    var config = {
        tmp: '.tmp',
        src: 'src',
        styles: 'src/stylesheets',
        scripts: 'src/javascript',
        dist: 'dist',
        distCss: 'dist/stylesheets',
        distJs: 'dist/javascript'
    };

    // Project configuration.
    grunt.initConfig({
        cfg: config,
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            dev: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none'
                },
                files: {
                    '<%= cfg.styles %>/main.css': '<%= cfg.styles %>/main.scss'
                }
            },
            dist: {
                options: {
                    //style: 'compressed'
                },
                files: {
                    '<%= cfg.tmp %>/main.css': '<%= cfg.styles %>/main.scss'
                }
            }
        },
        autoprefixer: {
            dist: {
                options: {
                    browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'ie 8', 'ie 9']
                },
                src: '<%= cfg.tmp %>/main.css',
                dest: '<%= cfg.tmp %>/main.css'
            }
        },
        copy: {
            styles: {
                expand: true,
                cwd: '<%= cfg.tmp %>',
                dest: '<%= cfg.distCss %>',
                src: ['*.css', '*.map']
            }
        },
        watch: {
            scripts: {
                files: ['<%= cfg.styles %>/**/*.scss'],
                tasks: ['build:dev'],
                options: {
                    debounceDelay: 250
                }
            }
        },
        concat: {
            dist: {
                src: [
                    '<%= cfg.scripts %>/app-initialize.js',
                    '<%= cfg.scripts %>/models/**/*.js',
                    '<%= cfg.scripts %>/views/**/*.js',
                    '<%= cfg.scripts %>/app-run.js'
                ],
                dest: '<%= cfg.tmp %>/main.js'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            dist: {
                files: {
                    '<%= cfg.distJs %>/main.min.js': '<%= cfg.tmp %>/main.js'
                }
            }
        },
        processhtml: {
            dist: {
                files: {
                    '<%= cfg.dist %>/index.html': '<%= cfg.src %>/index.html'
                }
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');

    // Tasks
    grunt.registerTask('default', ['sass:dev', 'watch']);
    grunt.registerTask('build:dev', ['sass:dev']);
    grunt.registerTask('build', [
        'sass:dist',
        'autoprefixer:dist',
        'copy:styles',
        'concat:dist',
        'uglify:dist',
        'processhtml:dist'
    ]);

};