import cities from '../data/cities-towns.json'
import citiesUnique from '../data/cities-towns-unique.json'

import Tokenizr from 'tokenizr'

const lexer = new Tokenizr()

// Exact matches.
const keywords = [
  'rochacha',
  'rochester institute of technology',
  'eastman school',
  'garbage plate',
  'genny cream ale',
  'rochesterny',
  'museum of play',
  'monroe county',
  'durand beach',
  'durand eastman',
  'george eastman',
  'mcclibraries',
]

const keywordsRegex = new RegExp(keywords.join('|'), 'i')

lexer.rule(keywordsRegex, (ctx, match) => {
  ctx.accept('keyword')
})

// Government, businesses and institutions.
const accounts = [
  'cityofrochester.bsky.social',
  'urochester.bsky.social',
  'urmed.bsky.social',
  'anomalyfilmfest.com',
  'rocbbqsupply.bsky.social',
  'thelittletheatre.bsky.social',
  'rocvictoryalliance.bsky.social',
  'roclgbtqtogether.bsky.social',
  'downtownrocs.org',
  'mcclibraries.bsky.social',
  'wxxirochester.bsky.social',
  'rittigers.bsky.social',
]
lexer.rule(new RegExp(accounts.join('|'), 'i'), (ctx, match) => {
  ctx.accept('account')
})

// Check for city names
lexer.rule(
  new RegExp(
    cities.map((city) => `(${city})(?=.*\\b(new york|,ny|, ny)\\b)`).join('|'),
    'i',
  ),
  (ctx, match) => {
    ctx.accept('city')
  },
)

// Check for unique city names
lexer.rule(new RegExp(citiesUnique.join('|'), 'i'), (ctx, match) => {
  ctx.accept('uniqueCity')
})

// Ignore everything else.
lexer.rule(/./, (ctx, match) => {
  ctx.ignore()
})

export default lexer
