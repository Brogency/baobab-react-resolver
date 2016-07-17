# Changelog

## 2.0.2
* Implement `initialData` attribute for each item
* Implement merge behaviour for data instead of set, if `merge` param is set for item
* Implement `isLoading` state inside each item with `isLoading()` helper method in mixin

## 2.0.1
* (Breaking changes) Rename `getResolve` to `getResolverBindings`
* (Breaking changes) Rename `getPromise` to `service`
* Add `resolve(force = false)` method into mixin

## 1.0.1
* Fix problem with renderToString when ResolveMixin is not used

## 1.0.0
* Initial release
