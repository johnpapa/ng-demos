module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')


    clean:
      build:
        src: 'public/assets'


    snocketsify:
      app:
        src: 'app/client/app.coffee'
        dest: 'public/assets/app.js'

      dependencies:
        src: 'app/client/dependencies.coffee'
        dest: 'public/assets/dependencies.js'


    stylus:
      app:
        options:
          compress: false
          'include css': true
          urlfunc: 'embedurl'
          linenos: true
          define:
            '$version': '<%= pkg.version %>'
        src: 'css/app.styl'
        dest: 'public/assets/app.css'


    jade:
      views:
        options:
          pretty: true
          compileDebug: false
          client: true
          namespace: 'app.templates'
          processName: (file)-> file.replace(/views\/client\/([\w\/]+).jade/gi, '$1')
        src: 'views/client/**/*.jade'
        dest: 'public/assets/views.js'


    cssmin:
      build:
        src: 'public/assets/app.css'
        dest: 'public/assets/app.min.css'


    uglify:
      app:
        src: 'public/assets/app.js'
        dest: 'public/assets/app.min.js'

      dependencies:
        src: 'public/assets/dependencies.js'
        dest: 'public/assets/dependencies.min.js'

      views:
        src: 'public/assets/views.js'
        dest: 'public/assets/views.min.js'


    hashify:
      options:
        basedir: 'public/assets/'
        hashmap: 'hashmap.json'

      app_js:
        src: 'public/assets/app.min.js'
        dest: 'app.min.{{hash}}.js'
        key: 'app.js'

      dependencies_js:
        src: 'public/assets/dependencies.min.js'
        dest: 'dependencies.min.{{hash}}.js'
        key: 'dependencies.js'

      views_js:
        src: 'public/assets/views.min.js'
        dest: 'views.min.{{hash}}.js'
        key: 'views.js'

      app_css:
        src: 'public/assets/app.min.css'
        dest: 'app.min.{{hash}}.css'
        key: 'app.css'


    compress:
      build:
        options:
          mode: 'gzip'
        expand: true
        src: 'public/assets/*.min.*.*'
        dest: './'


    # imagemin:
    #   options:
    #     optimizationLevel: 7
    #   files:
    #     expand: true
    #     src: [
    #       'public/images/**/*.jpg'
    #       'public/images/**/*.jpeg'
    #       'public/images/**/*.png'
    #     ]
    #     dest: './'


    watch:
      options:
        spawn: false
        interrupt: true
        dateFormat: (time) ->
          grunt.log.writeln("Compiled in #{time}ms @ #{(new Date).toString()} 💪\n")

      app_js:
        files: [
          'app/client/**/*.coffee'
          'app/shared/**/*.coffee'
          '!app/client/dependencies.coffee'
        ]
        tasks: ['snocketsify:app']

      dependencies_js:
        files: [
          'app/client/dependencies.coffee'
          'vendor/**/*.js'
          'vendor/**/*.coffee'
        ]
        tasks: ['snocketsify:dependencies']

      css:
        files: [
          'css/**/*.styl'
          'vendor/**/*.css'
          'vendor/**/*.styl'
        ]
        tasks: ['stylus']

      views:
        files: [
          'views/client/**/*.jade'
          'views/shared/**/*.jade'
        ]
        tasks: ['jade']

      # images:
      #   files: [
      #     'public/images/**/*.jpg'
      #     'public/images/**/*.jpeg'
      #     'public/images/**/*.png'
      #   ]
      #   tasks: ['imagemin']


  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-snocketsify')
  grunt.loadNpmTasks('grunt-contrib-stylus')
  grunt.loadNpmTasks('grunt-contrib-jade')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-hashify')
  grunt.loadNpmTasks('grunt-contrib-compress')
  # grunt.loadNpmTasks('grunt-contrib-imagemin')
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', [
    'clean'

    'snocketsify'
    'stylus'
    'jade'
  ])

  grunt.registerTask('build', [
    'default'

    'cssmin'
    'uglify'

    'hashify'

    'compress'
    # 'imagemin' # rely on minification during development
  ])
