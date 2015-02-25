var src = './sites/all/themes/jf/src',
    dest = './sites/all/themes/jf/assets';

module.exports = {
  browserify: {
    bundleConfigs: [{
      entry: src + '/js/app.js',
      outputName: 'main.js',
      dest: dest + '/js'
    }
    // {
    //   entry: './sites/all/themes/jf/src/js/other.js',
    //   outputName: 'randomnameipicked.js',
    //   dest: './sites/all/themes/jf/assets/js'
    // }
    ]
  }
};