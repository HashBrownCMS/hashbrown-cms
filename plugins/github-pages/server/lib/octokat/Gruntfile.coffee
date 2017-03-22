module.exports = (grunt) ->

  fs = require('fs')
  pkg = require('./package.json')

  # Enable Sepia fixtures
  process.env['VCR_MODE'] ?= 'playback'

  # Project configuration.
  grunt.initConfig
    pkg: pkg

    # Lint
    # ----

    # CoffeeLint
    coffeelint:
      options:
        arrow_spacing:
          level: 'error'
        line_endings:
          level: 'error'
          value: 'unix'
        max_line_length:
          level: 'error'
          value: 150
        no_unnecessary_fat_arrows:
          level: "ignore"

      source: ['src/*.coffee']
      grunt: 'Gruntfile.coffee'


    # Dist
    # ----
    browserify:
      options:
        browserifyOptions:
          extensions: ['.js', '.coffee']
          standalone: 'Octokat'
          debug: false # Source Maps
        transform: ['coffeeify']
      octokat:
        files:
          'dist/octokat.js': ['src/octokat.coffee']


    # Clean
    clean:
      files:
        src: [
          'dist/'
          'tmp/'
        ]
        # filter: 'isFile'


    # Release a new version and push upstream
    bump:
      options:
        commit: true
        push: true
        pushTo: ''
        commitFiles: ['package.json', 'bower.json', 'dist/octokat.js']
        # Files to bump the version number of
        files: ['package.json', 'bower.json']

    mochaTest:
      test:
        options:
          reporter: 'spec'
          require: 'coffee-script'
        src: ['test/**/node*.coffee']

    # Used for coveralls.io code coverage
    mochacov:
      options:
        coverage: true # use blanket
        reporter: 'spec'
        require: ['coffee-script']
        compilers: ['coffee:coffee-script']
      all: ['test/**/node*.coffee']

    # Code coverage in PhantomJS requires commenting out the following in
    # node_modules/mocha/mocha.js:
    # - `self.suiteURL(suite)`
    # - `self.testURL(test)`
    blanket_mocha:
      all: [ 'test/index.html' ]
      options:
        threshold: 54
        log: true
        reporter: 'Dot'

    mocha_phantomjs:
      all:
        options:
          urls: [ 'http://localhost:9876/test/index.html' ]

    connect:
      server:
        options:
          port: 9876
          base: '.'

    watch:
      files: 'src/**/*.coffee'
      tasks: ['dist']


    # Build the JS files for npm so the library can be used with browserify
    coffee:
      compile:
        files:
          'dist/node/deprecate.js'      : 'src/deprecate.coffee'
          'dist/node/chainer.js'        : 'src/chainer.coffee'
          'dist/node/grammar/url-validator.js'        : 'src/grammar/url-validator.coffee'
          'dist/node/grammar/tree-options.js'        : 'src/grammar/tree-options.coffee'
          'dist/node/grammar/object-matcher.js'        : 'src/grammar/object-matcher.coffee'
          'dist/node/grammar/preview-headers.js'        : 'src/grammar/preview-headers.coffee'
          'dist/node/helpers/base64.js'  : 'src/helpers/base64.coffee'
          'dist/node/helpers/querystring.js' : 'src/helpers/querystring.coffee'
          'dist/node/helpers/hypermedia.js' : 'src/helpers/hypermedia.coffee'
          'dist/node/helpers/promise-find-library.js' : 'src/helpers/promise-find-library.coffee'
          'dist/node/helpers/promise-find-native.js' : 'src/helpers/promise-find-native.coffee'
          'dist/node/helpers/promise-node.js' : 'src/helpers/promise-node.coffee'

          'dist/node/plugins/promise/library-first.js'  : 'src/plugins/promise/library-first.coffee'
          'dist/node/plugins/promise/native-first.js'  : 'src/plugins/promise/native-first.coffee'
          'dist/node/plugins/promise/native-only.js'  : 'src/plugins/promise/native-only.coffee'

          'dist/node/plugins/object-chainer.js'  : 'src/plugins/object-chainer.coffee'
          'dist/node/plugins/path-validator.js'  : 'src/plugins/path-validator.coffee'
          'dist/node/plugins/preview-apis.js'  : 'src/plugins/preview-apis.coffee'
          'dist/node/plugins/use-post-instead-of-patch.js'  : 'src/plugins/use-post-instead-of-patch.coffee'
          'dist/node/plugins/authorization.js'  : 'src/plugins/authorization.coffee'

          'dist/node/plugins/simple-verbs.js'  : 'src/plugins/simple-verbs.coffee'
          'dist/node/plugins/pagination.js'  : 'src/plugins/pagination.coffee'
          'dist/node/plugins/read-binary.js'  : 'src/plugins/read-binary.coffee'
          'dist/node/plugins/hypermedia.js'  : 'src/plugins/hypermedia.coffee'
          'dist/node/plugins/camel-case.js'  : 'src/plugins/camel-case.coffee'
          'dist/node/plugins/cache-handler.js' : 'src/plugins/cache-handler.coffee'

          'dist/node/plugins/fetch-all.js'  : 'src/plugins/fetch-all.coffee'

          'dist/node/base.js'           : 'src/base.coffee'
          'dist/node/octokat.js'        : 'src/octokat.coffee'
          'dist/node/plus.js'           : 'src/plus.coffee'
          'dist/node/requester.js'      : 'src/requester.coffee'
          'dist/node/verb-methods.js'   : 'src/verb-methods.coffee'


  # Dependencies
  # ============
  for name of pkg.dependencies when name.substring(0, 6) is 'grunt-'
    grunt.loadNpmTasks(name)
  for name of pkg.devDependencies when name.substring(0, 6) is 'grunt-'
    if grunt.file.exists("./node_modules/#{name}")
      grunt.loadNpmTasks(name)

  # Tasks
  # =====

  grunt.registerTask 'dist', [
    'clean'
    'coffeelint'
    'browserify' # Build single file for browsers
    'coffee' # Build JS files for npm
  ]

  grunt.registerTask 'test', [
    'dist'
    'mochaTest'
    'connect'
    'mocha_phantomjs'
    # 'blanket_mocha' # NOTE: Uncomment once the `suiteURL` problem noted above is fixed
  ]

  # Dist
  # -----
  grunt.registerTask 'release', [
    'test'
    'bump'
  ]

  grunt.registerTask 'release-minor', [
    'test'
    'bump:minor'
  ]

  # Default
  # -----
  grunt.registerTask 'default', [
    'test'
  ]
