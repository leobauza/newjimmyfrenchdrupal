module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dev: {
        files: {
          'sites/all/themes/jf/assets/css/styles.css' : 'sites/all/themes/jf/src/scss/styles.scss',
        },
        options: {
          sourceMap: true,
          outputStyle: 'compressed' //nested or compressed
        }
      }
    },

    // sass: {
    //   dev: {
    //     options: {
    //       style: 'compressed' //compressed or compact or expanded
    //     },
    //     files: {
    //       'sites/all/themes/jf/assets/css/styles.css' : 'sites/all/themes/jf/src/scss/styles.scss',
    //     }
    //   }
    // },

    sprite: {
      all: {
        src: 'sites/all/themes/jf/assets/img/sprites/*.png',
        dest: 'sites/all/themes/jf/assets/img/sprite.png',
        destCss: 'sites/all/themes/jf/src/scss/core/_sprite.scss',
        imgPath: '../img/sprite.png?v=1',
        padding: 5,
        //engine: 'pixelsmith', // pixelsmith by default
        algorithm: 'binary-tree'
      }
    },

    // copy: {
    //   buildSprite: {
    //     files: [
    //       {
    //         src: 'sites/all/themes/aiada/assets/img/sprite.png',
    //         dest: 'sites/all/themes/aiada/assets/img/sprite.uncompressed.png'
    //       }
    //     ]
    //   }
    // },

    // tinypng: {
    //   buildSprite: {
    //     files: {
    //       'sites/all/themes/aiada/assets/img/sprite.png': 'sites/all/themes/aiada/assets/img/sprite.png'
    //     }
    //   },
    //   options: {
    //     apiKey: 'BUIghF7ZZvuMXySv599EMWViEyAOdUsx',
    //     showProgress: true,
    //     summarize: true,
    //     checkSigs: true,
    //     sigFile: 'sites/all/themes/aiada/assets/img/tinypng_sigs.json'
    //   }
    // },

    browserify: {
      js: {
        src:  ['sites/all/themes/jf/src/js/app.js'],
        dest: 'sites/all/themes/jf/assets/js/main.js'
      }
    },

    watch: {
      sass: {
        files: ['sites/all/themes/jf/src/scss/**'],
        tasks: ['sass:dev']
      },
      js: {
        files: ['sites/all/themes/jf/src/js/**'],
        tasks: ['browserify:js']
      }
    }

  });

  // grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask('default', ['watch']);
  // grunt.registerTask('build-sprite', ['sprite:buildSprite', 'copy:buildSprite', 'tinypng:buildSprite']);
  grunt.registerTask('build-sprite', ['sprite:all']);

};
