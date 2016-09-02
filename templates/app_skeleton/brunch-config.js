module.exports = {
  npm: {
    globals: {
      $: 'jquery',
      jQuery: 'jquery',
      _: "underscore",
      riot: "riot",
      UIKit: "uikit"
    },
    styles: {
      select2: ['dist/css/select2.css'],
    }
  },
  hooks: {
    preCompile: (end) => {
      var fs = require('fs');
      fs.createReadStream('node_modules/uikit/dist/js/components/pagination.js').pipe(fs.createWriteStream('app/vendors/uikit-pagination.js'));
      fs.createReadStream('node_modules/uikit/dist/js/components/form-select.js').pipe(fs.createWriteStream('app/vendors/uikit-form-select.js'));
      fs.createReadStream('node_modules/uikit/dist/js/components/datepicker.js').pipe(fs.createWriteStream('app/vendors/uikit-datepicker.js'));
      fs.createReadStream('node_modules/select2/dist/js/select2.js').pipe(fs.createWriteStream('app/vendors/select2.js'));
      end();
    }
  },
  files: {
    javascripts: {
      joinTo: {
        'js/js.js': /^app\/[js|widgets]/,
        'js/vendors.js': [/^(?!app)/, /^app\/vendors/ ], 
      }
    },
    stylesheets: {
      joinTo: {
        'css/css.css': /^app\/[css]/,
        'css/vendors.css': [/^(?!app)/, /^app\/vendors/],
      },
    },
  },
  plugins: {
    htmlPages: {
      compileAssets: true
    }
  },

  overrides: {
    production: {
      paths: {
        public: 'dist'
      }
    } 
  }
  
};