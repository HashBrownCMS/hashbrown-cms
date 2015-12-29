var Liquid = {};

Liquid.parse = function(input) {
    console.log()

    return _.textarea(
        { class: 'form-control' },
        input
    );
};

module.exports = Liquid;
