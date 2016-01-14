(function() {
  "use strict";

  var imagesize = require("imagesize"),
      fs = require("fs"),
      path = require("path");

  module.exports = function(grunt) {
    return grunt.registerMultiTask("sass_imagemap", "Plugin to generate a map file containing image information from folders.", function() {
      
      var files, complete, counts, done, getImageInfo, getName, info, options, _;

      _ = grunt.util._;

      getName = function(item) {
        return item.filename.replace(/\.(png|jpg|jpeg|gif)/, "");
      };

      getImageInfo = function(options) {
        var prefix = options.prefix,
            width  = options.width,
            height = options.height,
            folder = options.folder,
            name   = options.name,
            ext    = options.ext;

        folder += '/';

        if ( folder === './' ) {
          folder = '';
        }

        var css_name   = name.replace(".", "-"),
            css_folder = folder.replace("/", "-").replace(".", "-"),
            css_class_name = css_folder + css_name;

        var key = folder + name + ext;

        return "\n\t'"+key+"': (\n\t\tfilename: '"+name+ext+"',\n\t\tfolder: '"+folder+"',\n\t\tname: '"+name+"',\n\t\textension: '"+ext+"',\n\t\twidth: "+width+"px,\n\t\theight: "+height+"px\n\t),";
      };

      options = this.options({
        prefix: "",
        map: "map-images"
      });

      files = this.files;

      info = [];

      done = this.async();

      counts = grunt.util._.reduce(this.files, function(memo, item) {
        return memo + grunt.util._.size(item.src);
      }, 0);

      complete = grunt.util._.after(counts, function(err, opts) {
        var dest, txt, txtend;

        txt = "/* generated with grunt-sass-imagemap */\n\n$"+options.map+": ( ";
        txtend = "\n);\n";

        if ( typeof opts === 'undefined' ) {
          files.forEach(function(f) {
            grunt.file.write(f.dest, txt + txtend);
            grunt.log.writeln("File \"" + f.dest + "\" created.");
          });
        } else {
          dest = opts.dest;

          info = _.sortBy(opts.info, function(item) {
            return item.filename;
          });

          info.forEach(function(item) {
            var folder;
            folder = item.folder;

            return txt += getImageInfo({
              prefix: options.prefix,
              width: item.width,
              height: item.height,
              folder: folder,
              name: getName(item),
              ext: item.ext
            });

          });

          grunt.file.write(dest, txt + txtend);
          grunt.log.writeln("File \"" + dest + "\" created.");
        }

        return done();
      });

      return this.files.forEach(function(f) {
        return f.src.forEach(function(itempath) {
          var src;
          src = path.join(f.cwd, itempath);
          return fs.readFile(src, function(err, data) {
            var parser, result, retStatus;
            parser = imagesize.Parser();
            retStatus = parser.parse(data);
            if (imagesize.Parser.DONE === retStatus) {
              result = parser.getResult();
              result.filename = path.basename(src);
              result.ext = path.extname(src);
              result.folder = path.dirname(itempath);
              info.push(result);
            }
            return complete(null, {
              info: info,
              dest: f.dest
            });
          });
        });
      });
    });
  };

}).call(this);
