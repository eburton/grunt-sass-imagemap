# grunt-sass-imagemap

Plugin to generate a map file containing image information from folders.

## Example Usage

Add the following to your gruntfile:

```js
grunt.initConfig({
  sass_imagemap: {
    all: {
      files: [{
        cwd:  'images',
        src:  '**/*.{png,jpg,gif,jpeg}',
        dest: 'sass/import/maps/_images.scss'
      }]
    }
  },
});
```

Enable the task in your gruntfile:

```js
grunt.loadNpmTasks( 'grunt-sass-imagemap' );
```