# 585 ATProto Feed Generator

Generating a feed of content about the city of Rochester, NY, USA and the surrounding areas, forked from BlueSky's ATProto Feed Generator.hich to build and deploy a feed.

## Getting Started

We've set up this simple server with SQLite to store and query data. Feel free to switch this out for whichever database you prefer.

Next, you will need to do two things:

1. Implement indexing logic in `src/subscription.ts`.

   This will subscribe to the repo subscription stream on startup, parse events and index them according to your provided logic.

2. Implement feed generation logic in `src/algos`

   For inspiration, we've provided a very simple feed algorithm (`whats-alf`) that returns all posts related to the titular character of the TV show ALF.

   You can either edit it or add another algorithm alongside it. The types are in place, and you will just need to return something that satisfies the `SkeletonFeedPost[]` type.

We've taken care of setting this server up with a did:web. However, you're free to switch this out for did:plc if you like - you may want to if you expect this Feed Generator to be long-standing and possibly migrating domains.

### Deploying your feed

Your feed will need to be accessible at the value supplied to the `FEEDGEN_HOSTNAME` environment variable.

The service must be set up to respond to HTTPS queries over port 443.

### Publishing your feed

To publish your feed, go to the script at `scripts/publishFeedGen.ts` and fill in the variables at the top. Examples are included, and some are optional. To publish your feed generator, simply run `npm run publishFeed`.

To update your feed's display data (name, avatar, description, etc.), just update the relevant variables and re-run the script.

After successfully running the script, you should be able to see your feed from within the app, as well as share it by embedding a link in a post (similar to a quote post).

## Running the Server

Install dependencies with `npm` and then run the server with `npm run start`. This will start the server on port 3000, or what's defined in `.env`. You can then watch the firehose output in the console and access the output of the default custom ALF feed at [http://localhost:3000/xrpc/app.bsky.feed.getFeedSkeleton?feed=at://did:example:alice/app.bsky.feed.generator/whats-alf](http://localhost:3000/xrpc/app.bsky.feed.getFeedSkeleton?feed=at://did:example:alice/app.bsky.feed.generator/whats-alf).
