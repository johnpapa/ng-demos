beforeEach(function () {
    jasmine.addMatchers({
        isYankees: function () {
            return {
                compare: function (actual, expected) {
                    var team = actual;

                    return {
                        pass: team.title === 'yankees'
                    };
                }
            };
        }
    });
});
