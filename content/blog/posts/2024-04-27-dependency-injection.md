---
title: thoughts on dependency injection in typescript
category: tech
---

i've been thinking a lot about dependency injection recently. it's an
interesting topic to me; it seems like a fairly common aspect of software
outside of the javascript world, but within the javascript world it doesn't seem
like that much attention is given to it. for testing, we have alternatives
options like [sinon](https://sinonjs.org/), but that only stubs functionality at
runtime. it doesn't give our code the other benefits of dependency injection,
like making our components reusable or maintaining strong boundaries around our
modules.

there are some libraries out there, like
[inversify](https://www.npmjs.com/package/inversify) and
[tsyringe](https://www.npmjs.com/package/tsyringe). newer frameworks like
[nest.js](https://docs.nestjs.com/fundamentals/custom-providers) and
[adonis](https://docs.adonisjs.com/guides/ioc-container) also seem to have
noticed this gap and have included their own dependency injection. i have two
problems with these dependency injection solutions.

the first is that... i don't like adding (most) libraries to my projects, and i
especially don't like adding large frameworks that define how my code should be
structured.

the second issue i have with using these libraries is that they require adopting
their dsl to define the relationships between your units of code. i'm pretty
reluctant to do this, especially if it's coming from a framework that i'm not
certain about the longevity of. each of these solutions uses the experimental
stage 2 decorators configuration in typescript. now that decorators have made it
to stage 3 (and look to be different than what was proposed in stage 2), what if
the library i choose _never_ makes the switch to stage 3 or later decorators?
what if they _can't_ switch without breaking changes because of the differences
between stage 2 and stage 3 decorators? would i have to switch libraries, update
my code, refactor my units? that doesn't sound like a compelling option to me.

so, what's a girl to do if none of the dependency injection libraries really fit
her use-case? make her own!

well, i tried... several times. and then i realized that i don't feel like i
need a dependency injection library.

a rather cool thing about javascript is that objects are just objects, and
typescript leans into this with its structural typing. names aren't really a
thing and interfaces are king. an object has extra properties? who cares, it's
_at least_ a duck. so in my recent projects, the dependency injection containers
are ducks.

i've settled on having each unit being a class with a constructor that either
takes either 0 parameters or a single object matching an interface that contains
what the unit needs. by relying interfaces, your unit doesn't care about any
extra properties in either the object that it was passed in the constructor, and
also doesn't care about the specific type of its dependency.

```typescript
interface Filesystem {
	read(filename: string): string;
	write(filename: string, contents: string): void;
}

interface UnitDeps {
	fs: Filesystem;
}
class Unit {
	#fs: Filesystem;
	constructor({fs}: UnitDeps) {
		this.#fs = fs;
	}
}
```

for the main application, i'll typically define a `Toolbox` class. this class
can take some parameters or no parameters; it can be a singleton or it can be a
manyton; the world is truly your oyster here. within this class there are
getters that return instances of our units, and we construct those instances by
passing them the `Toolbox` instance that's constructing them. again, the world
is your oyster here; these instances could be singletons if you so desire.

it could look something like this:

```typescript
interface Filesystem {
	read(filename: string): string;
	write(filename: string): void;
}

class OSFilesystem implements Filesystem {
	// ...implementation
}
class S3Filesystem implements Filesystem {
	// ...implementation
}
class MemoryFilesystem implements Filesystem {
	// ...implementation
}

interface UnitDeps {
	fs: Filesystem;
}
class Unit {
	constructor({fs}: UnitDeps) {
		// whatever
	}

	doSomething(): void {}
}

class Toolbox {
	get fs(): Filesystem {
		return new OSFilesystem();
		// or...
		return new S3Filesystem();
	}
	// or, if we need fs a singleton...
	#fs: Filesystem | undefined;
	get fs(): Filesystem {
		this.#fs ??= new OSFilesystem();
		return this.#fs;
	}

	get unit(): Unit {
		return new Unit(this);
	}
	// or, if Unit needs something other than the default...
	get unit(): Unit {
		return new Unit({
			...this,
			get fs() {
				return new S3Filesystem();
			},
		});
	}
}

// if you want your Toolboxes to be specialized, maybe per-request
class HttpToolbox extends Toolbox {
	#req: Request;
	constructor(req: Request) {
		this.#req = req;
	}

	get req(): Request {
		return this.#req;
	}
}

const toolbox = new Toolbox();
toolbox.unit.doSomething();
```

and... that's kinda it. it seems obvious and a bit naive, but it's worked well
for me. it doesn't handle circular dependencies (you could create a proxy helper
for that, though), and if your units store a reference to the `Toolbox` instance
then you could potentially use multiple instances of a dependency within a unit,
but at least for me, following which dependency is used where isn't any more
difficult than with a dependency injection library. it might even be a bit
easier to follow because it doesn't require maintaining an accurate knowledge of
how the dependency injection library works; here you follow the code. it also
favors stateless classes with ephemeral instances, but so do i, so _shrug_. it
works, it's simple, i'm happy enough with it.
