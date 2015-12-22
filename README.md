### modals

Easy customizable and reactive modals

#### Example

Step 1: Include `ModalManager` in your app layout or in body (in case you don't have layouts)

```html
{{> ModalManager}}
```

Step 2: Create template that will be showed as modal

```html
<template name="myCustomTemplate">
  <div class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close close-modal-button" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Modal title</h4>
        </div>
        <div class="modal-body">
          <p>{{yourMessage}}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default close-modal-button">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->
</template>
```

* Note: `close-modal-button` is predefined class for close modal button.
You don't need to add any event handlers for it.

Step 3: Open your template in modal window when you need it

```js
//open modal
var yourModal = ModalManager.open('myCustomTemplate', {yourMessage: 'Hello, Modals!'});

//close modal
yourModal.close()
```

Step 4: Have fun!


#### Plugins

Example below illustrates using Bootstrap's modal window. This package supports Bootstrap by default.

If you need to support other modal window implementation you can write your own plugin.

##### Bootstrap's plugin example:

```coffee
class BootstrapModalPlugin
  constructor: (@_modal) ->
    # receives `Modal` instance

  # prepare rendered modal for showing
  afterShow: (rootElement) ->
    @_modalElement = rootElement.find('.modal')
    @_modalElement.modal('show')

  # hide modal (e.g. trigger hide animation etc.)
  beforeHide: (onHideFinished) ->
    @_modalElement.modal('hide')
    setTimeout onHideFinished, 200


# then you can register your plugin
ModalManager.registerPlugin('bootstrap', BootstrapModalPlugin)

# now you can show modal windows using your plugin anywhere in the project like:
ModalManager.open('myCustomTemplate', {yourMessage: 'Hello, Modals!'}, 'bootstrap')
```