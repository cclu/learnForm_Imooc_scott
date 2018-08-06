module.exports = function (grunt) {
  grunt.initConfig({
    watch: {
      jade: {
        files: ['view/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/js/**', 'models/**/*.js', 'schema/**/*.js'],
        // tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    },
    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolder: ['./'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['static/libs/**/*.js']
      },
      all: ['static/js/**/*.js', 'test/**/*.js', 'src/**/*.js']
    },
    less: {
      development: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          'static/build/css/style.css': 'static/less/index.less'
        }
      }
    },
    uglify: {
      development: {
        files: {
          'static/build/js/admin.min.js': 'static/js/admin.js',
          'static/build/js/detail.min.js': 'static/js/detail.js',
          'static/build/js/list.min.js': 'static/js/list.js',
        }
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['test/**/*.js']
    },

    concurrent: {
      tasks: ['nodemon', 'watch', 'less', 'uglify', 'jshint'],
      options: {
        logConcurrentOutput: true
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-nodemon') // 实时更新入口文件
  grunt.loadNpmTasks('grunt-concurrent') // 慢任务监听
  grunt.loadNpmTasks('grunt-mocha-test') // 单元测试
  grunt.loadNpmTasks('grunt-contrib-less') // less 编译
  grunt.loadNpmTasks('grunt-contrib-uglify') // js压缩
  grunt.loadNpmTasks('grunt-contrib-jshint') // 代码规则

  grunt.option('force', true)
  grunt.registerTask('default', ['concurrent'])
  grunt.registerTask('test', ['mochaTest'])
  
}