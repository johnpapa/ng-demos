#= require ../shared/helpers

@jade.helpers = helpers
@jade.client_env = app.env

$('html').removeClass('no-js').addClass('js')
$('body').append(app.templates.sample_template())

helpers.log('initialized')
