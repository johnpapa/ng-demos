((exports)->
  exports.noop = ->

  exports.log = (message, prefix)->
    console.log("[#{(new Date).toUTCString()}] #{@logPrefix or prefix or '[app]:'} #{message}")

  exports.numberOrdinalSuffix = (i)->
    j = i % 10
    return i + 'st'  if j is 1 and i isnt 11
    return i + 'nd'  if j is 2 and i isnt 12
    return i + 'rd'  if j is 3 and i isnt 13
    i + 'th'

  exports.numberFormat = (number)->
    parts = number.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    parts.join('.')

  exports.choosePlural = (number, endings)->
    number + ' ' + if number is 1 then endings[0] else endings[1]

  exports.makeUrl = (url, params)->
    matches = url.match(/[:|*]\w+/g)

    if matches and (typeof params is 'string' or typeof params is 'number')
      url = url.replace(matches[0], params)

    else if params and matches
      i = 0
      l = matches.length

      while i < l
        url = url.replace(matches[i], params[matches[i].slice(1)] or '')
        i++

    url

  exports.shorten = (str, len, pos)->
    str = str or ''
    lim = ((len - 3) / 2) | 0
    res = str

    if str.length > len
      switch pos
        when 'left'
          res = '...' + str.slice(3 - len)
        when 'center'
          res = str.slice(0, lim) + '...' + str.slice(-lim)
        else
          res = str.slice(0, len - 3) + '...'

    res

  exports.capFirst = (string)-> string.charAt(0).toUpperCase() + string.slice(1)

  exports.stripTags = (str)-> if typeof str is 'string' then str.replace(/(<([^>]+)>)/g, '') else ''

  # Use when outputting string from untrusted source directly to the DOM, especially as JSON
  exports.sanitizeString = (string) ->
    string = string.replace(/\r\n/g, '\n')
    string = string.replace(/<\/script>/g, '<\\/script>')
    unescape(encodeURIComponent(string))

  exports.getClientEnv = (prop)->
    if client_env?
      client_env[prop]
    else if app?
      app.env[prop]
    else
      null

)(if typeof exports is 'undefined' then this['helpers'] = {} else exports)
