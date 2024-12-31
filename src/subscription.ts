import {
  OutputSchema as RepoEvent,
  isCommit,
} from './lexicon/types/com/atproto/sync/subscribeRepos'
import { FirehoseSubscriptionBase, getOpsByType } from './util/subscription'
import cities from './data/cities-towns.json'
import citiesUnique from './data/cities-towns-unique.json'

function isRochesterRelated(text: string) {
  const clean = text.toLowerCase().trim()

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
  const matchedKeyword = keywords.find((str) => clean.includes(str))
  if (matchedKeyword) {
    console.log('keyword match: ' + matchedKeyword)
    return true
  }

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
  const matchedAccount = accounts.find((str) => clean.includes(str))
  if (matchedAccount) {
    console.log('account match' + matchedAccount)
    return true
  }

  // Check for city names in clean text
  for (const city of cities) {
    if (clean.includes(city)) {
      if (
        clean.includes('new york') ||
        clean.includes(',ny') ||
        clean.includes(', ny')
      ) {
        console.log('city match: ' + city)
        return true
      }
    }
  }

  for (const city of citiesUnique) {
    if (clean.includes(city)) {
      // Check for false positives on england
      if (!clean.includes('england') && !clean.includes('london')) {
        console.log('unique city match: ' + city)
        return true
      }
    }
  }

  // Default.
  return false
}

export class FirehoseSubscription extends FirehoseSubscriptionBase {
  async handleEvent(evt: RepoEvent) {
    if (!isCommit(evt)) return

    const ops = await getOpsByType(evt)

    // This logs the text of every post off the firehose.
    // Just for fun :)
    // Delete before actually using
    for (const post of ops.posts.creates) {
      if (isRochesterRelated(post.record.text)) {
        console.log(post.record.text)
      }
    }

    const postsToDelete = ops.posts.deletes.map((del) => del.uri)
    const postsToCreate = ops.posts.creates
      .filter((create) => {
        // only alf-related posts
        return create.record.text.toLowerCase().includes('alf')
      })
      .map((create) => {
        // map alf-related posts to a db row
        return {
          uri: create.uri,
          cid: create.cid,
          indexedAt: new Date().toISOString(),
        }
      })

    if (postsToDelete.length > 0) {
      await this.db
        .deleteFrom('post')
        .where('uri', 'in', postsToDelete)
        .execute()
    }
    if (postsToCreate.length > 0) {
      await this.db
        .insertInto('post')
        .values(postsToCreate)
        .onConflict((oc) => oc.doNothing())
        .execute()
    }
  }
}
