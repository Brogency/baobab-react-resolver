# Changelog

## 2.0.2
* Implement #7: `initialData` attribute for each item
* Implement #6: merge behaviour for data instead of set, if `merge` param is set for item
* Implement #3: `isLoading` state inside each item with `isLoading()` helper method in mixin
* Implement #4: throw exception if cursor or service is not set

## 2.0.1
* (Breaking changes) Rename `getResolve` to `getResolverBindings`
* (Breaking changes) Rename `getPromise` to `service`
* Add `resolve(force = false)` method into mixin

## 1.0.1
* Fix problem with renderToString when ResolveMixin is not used

## 1.0.0
* Initial release
