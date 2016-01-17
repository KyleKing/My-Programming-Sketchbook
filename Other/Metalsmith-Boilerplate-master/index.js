var Metalsmith = require('metalsmith'),
markdown       = require('metalsmith-markdown'),
templates      = require('metalsmith-templates'),
collections    = require('metalsmith-collections'),
permalinks     = require('metalsmith-permalinks'),
coffee         = require('metalsmith-coffee'),
sass           = require('metalsmith-sass'),
Handlebars     = require('handlebars'),
fs             = require('fs'),
watch          = require('metalsmith-watch'),
excerpts       = require('metalsmith-excerpts'),
jade           = require('metalsmith-jade'),
ignore         = require('metalsmith-ignore'),
tags           = require('metalsmith-tags'),
atom           = require('metalsmith-atom'),
copy = require('metalsmith-copy');


Handlebars.registerPartial('header', fs.readFileSync(__dirname + '/templates/partials/header.hbt').toString());
Handlebars.registerPartial('footer', fs.readFileSync(__dirname + '/templates/partials/footer.hbt').toString());

var findTemplate = function(config) {
    var pattern = new RegExp(config.pattern);

    return function(files, metalsmith, done) {
        for (var file in files) {
            if (pattern.test(file)) {
                var _f = files[file];
                if (!_f.template) {
                    _f.template = config.templateName;
                }
            }
        }
        done();
    };
};

Metalsmith(__dirname)
    .source('src')
    // .use(copy({
    //     pattern: '*.md',
    //     transform: function (file) {
    //         return file + '.bak';
    //     }
    // })
    .use(collections({
        pages: {
            pattern: 'content/pages/*.md'
        },
        posts: {
            pattern: 'content/posts/*.md',
            sortBy: 'date',
            reverse: true
        }
    }))
    // Ignore the partial jade files in the final build
    .use(ignore('jade-partials/*/*.jade'))
    // Build the jade files
    .use(jade({
      "pretty": true,
    }))
    .use(findTemplate({
        pattern: 'posts',
        templateName: 'post.hbt'
    }))
    .use(markdown())
    .use(tags({
        handle: 'tags',                  // yaml key for tag list in you pages
        path:'topics',                   // path for result pages
        template:'tag.hbt',    // template to use for tag listing
        sortBy: 'date',                  // provide posts sorted by 'date' (optional)
        reverse: true                    // sort direction (optional)
    }))
    .use(excerpts())
    .use(permalinks({
        pattern: ':collection/:title'
    }))
    .use(templates('handlebars'))
    .use(sass({
        outputStyle: 'compressed'
    }))
    .use(coffee())
    .destination('./build')
    // .use(watch({
    //     pattern : '**/*',
    //     livereload: true
    // }))
    .build(function(err, files) {
        if (err) { throw err; }
    });
