# Publish Counts

A fork of a package to help you publish the count of a cursor, in real time that can handle large collections.

## Why?

tmeasday:publish-counts is good, but can't doesn't know how to count past 50,000 without killing your server.  This fork adds an option (fastCount) that will let you, with nearly total accuracy, count large collections almost instantaneously to start and with minimal overhead.

fastCount can also be very beneficial for counting collections that are infrequently mutated (in situations where you append to a collection only, it is free speed over tmeasday:publish-counts)

So, with that said I've decided to fork that project.  Additions to tmeasday:publish-counts will be merged into this fork.

The example showcases the performance differences between the two (though, as stated above, large collections are NOT the only reason to use fastCount).  Turning it off causes massive server instability.

## Option fastCount `{fastCount: true}` (Default is false)

If you were to think of this new feature as something that already exists, it's the equivalent of using a meteor method that returned the current count on a collection and then observing subsequent changes to the collection past the initial count.

This change is not without trade-offs; of course, things removed from your data set included in the initial count call will not be reflected in the total count. For most big counts it will not be noticeable if a count is slightly off, but still gives the user an idea of how the collection is growing.

## Installation

``` sh
$ meteor add ros:publish-counts
```

## API

Simply call `Counts.publish` within a publication, passing in a name and a cursor:

```js
Meteor.publish('publication', function() {
  Counts.publish(this, 'name-of-counter', Posts.find());
});
```

On the client side, once you've subscribed to `'publication'`, you can call `Counts.get('name-of-counter')` to get the value of the counter, reactively.

The `Counts.publish` function returns the observer handle that's used to maintain the counter. You can call its `stop` method in order to stop the observer from running.

## Options

### Readiness

If you publish a count within a publication that also returns cursor(s), you probably want to pass `{noReady: true}` as a final argument to ensure that the "data" publication sets the ready state. For example, the following publication sends down 10 posts, but allows us to see how many there are in total:

```js
Meteor.publish('posts-with-count', function() {
  Counts.publish(this, 'posts', Posts.find(), { noReady: true });
  return Posts.find({}, { limit: 10 });
});
```

### nonReactive

If you specify `{nonReactive: true}` the cursor won't be observed and only the initial count will be sent on initially subscribing. This is useful in some cases where reactivity is not desired, and can improve performance.

### countFromField

`countFromField` allows you to specify a field to calculate the sum of its numbers across all documents.
For example if we were to store page visits as numbers on a field called `visits`:

```
{ content: 'testing', visits: 100 },
{ content: 'a comment', visits: 50 }
```

We could then publish them like:

```js
Meteor.publish('posts-visits-count', function() {
  Counts.publish(this, 'posts-visits', Posts.find(), { countFromField: 'visits' });
});
```


And calling `Counts.get('posts-visits')` returns `150`

### countFromFieldLength

`countFromFieldLength` allows you to specify a field to calculate the sum of its **length** across all documents.
For example if we were to store the userIds in an array on a field called `likes`:

```
{ content: 'testing', likes: ['6PNw4GQKMA8CLprZf', 'HKv4S7xQ52h6KsXQ7'] },
{ content: 'a comment', likes: ['PSmYXrxpwg276aPf5'] }
```

We could then publish them like:

```js
Meteor.publish('posts-likes-count', function() {
  Counts.publish(this, 'posts-likes', Posts.find(), { countFromFieldLength: 'likes' });
});
```

## Template helper

To easily show the counter value within your templates, you can use the `getPublishedCount` template helper.

Example:
```html
<p>There are {{getPublishedCount 'posts'}} posts</p>
```

## Notes

The package includes a test that checks the number of observer handles opened and closed (to check for memory leaks). You need to run the `enable-publication-tests-0.7.0.1` branch of `percolatestudio/meteor` to run it however.

## License

MIT. (c) Percolate Studio

publish-counts was developed as part of the [Verso](http://versoapp.com) project.
