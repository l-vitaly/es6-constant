es6-constant
================

## Information

<table>
<tr>
<td>Package</td><td>es6-constant</td>
</tr>
<tr>
<td>Description</td>
<td>Gulp plugin for dynamic generation of ES6 constant module.<br>
Based of <a href="https://github.com/vlobchuk/es6-constant">es6-constant</a></td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>

## Usage

### Configuration in `gulpfile.js`

_**gulpfile.js**_

```javascript
var es6Constant = require('es6-constant');

gulp.task('config', function () {
  gulp.src('app/config.json')
    .pipe(es6Constant({
      ENV: 'development'
    }))
    // Writes config.js to dist/ folder
    .pipe(gulp.dest('dist'));
});
```
