import cities from '../data/cities-towns.json'
import citiesUnique from '../data/cities-towns-unique.json'
import bskyGovernment from '../data/bsky-government.json'
import bskyEdu from '../data/bsky-edu.json'
import bskyBusinesses from '../data/bsky-businesses.json'
import bskyMedia from '../data/bsky-media.json'
import bksyOrgs from '../data/bsky-orgs.json'
import keywords from '../data/keywords.json'
import Tokenizr from 'tokenizr'

const lexer = new Tokenizr()

// Exact matches.
const keywordsRegex = new RegExp(keywords.join('|'), 'i')
lexer.rule(keywordsRegex, (ctx, match) => {
  ctx.accept('keyword')
})

// BlueSky accounts.
lexer.rule(new RegExp(bskyBusinesses.join('|'), 'i'), (ctx, match) => {
ctx.accept('bskyBusinesses')
})
lexer.rule(new RegExp(bskyEdu.join('|'), 'i'), (ctx, match) => {
    ctx.accept('bskyEdu')
  })
lexer.rule(new RegExp(bskyGovernment.join('|'), 'i'), (ctx, match) => {
  ctx.accept('bskyGovernment')
})
lexer.rule(new RegExp(bskyMedia.join('|'), 'i'), (ctx, match) => {
  ctx.accept('bskyMedia')
})
lexer.rule(new RegExp(bksyOrgs.join('|'), 'i'), (ctx, match) => {
  ctx.accept('bskyOrgs')
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
