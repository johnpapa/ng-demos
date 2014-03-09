// Cleans/empties the folder out completely
module.exports = {
    options: { force: true },
    all: {
        src: ['<%= pkg.dest %>', '<%= pkg.temp %>']
    }
};