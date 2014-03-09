module.exports = {
    options: {
        separator: ';'
    },
    dist: {
        src: ['<%= pkg.temp %>**/*.min.js'],
        dest: '<%= pkg.dest %>/<%= pkg.name %>.min.js'
    }
};