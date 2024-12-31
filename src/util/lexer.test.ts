import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import lexer from './lexer'

describe('keyword', () => {
  it('should match "garbage plate"', () => {
    lexer.input(
      'The Nick Tahou Hots garbage plate is terrible, go to Dogtown instead',
    )
    const tokens = lexer.tokens()
    assert.equal(tokens.length, 2)
    assert.equal(tokens[0].type, 'keyword')
  })
})

describe('account', () => {
  it('should match "cityofrochester.bsky.social"', () => {
    lexer.input('thanks for being on BlueSky @cityofrochester.bsky.social yeah')
    const tokens = lexer.tokens()
    assert.equal(tokens.length, 2)
    assert.equal(tokens[0].type, 'bskyGovernment')
  })
})

describe('city', () => {
  it('should match "Rochester, NY"', () => {
    lexer.input('I love Rochester, NY')
    const tokens = lexer.tokens()
    assert.equal(tokens.length, 2)
    assert.equal(tokens[0].type, 'city')
  })

  it('should not match "Rochester, England"', () => {
    lexer.input('I love Rochester, England')
    const tokens = lexer.tokens()
    assert.equal(tokens.length, 1)
  })

  it('should not match "Rochester"', () => {
    lexer.input('I love Rochester')
    const tokens = lexer.tokens()
    assert.equal(tokens.length, 1)
  })
})

describe('uniqueCity', () => {
  it('should match "Irondequoit"', () => {
    lexer.input(
      'The town of Irondequoit is not actually part of the city of Rochester',
    )
    const tokens = lexer.tokens()
    assert.equal(tokens.length, 2)
    assert.equal(tokens[0].type, 'uniqueCity')
    assert.equal(tokens[0].value, 'Irondequoit')
  })
})
