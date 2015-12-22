### modals

Easy customizable and reactive modals

#### Example

Step 1: Include `ModalManager` in your app layout or in body (in case you don't have layouts)

```
{{> ModalManager}}
```

Step 2: Create template that will be showed as modal

```
<template name="myCustomTemplate">
 <div class="modal-header">
    <button class="close-modal-button"> x </button>
  </div>
  <div class="modal-content">
    {{yourMessage}}
  </div>
</template>
```
* Note: `close-modal-button` is predefined class for close modal button.
You don't need to add any event handlers for it.

Style it whatever you want (in example is used LESS):

```
@padding: 10px;
.modal { // root node for each opened modal
  background: #EEE;
  box-shadow: 0 0 7px rgba(0, 0, 0, 0.5);

  //some custom elements:
  .modal-header {
    background: #CCC;
    padding: @padding;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5)
  }

  .modal-content {
    padding: @padding;
  }
}
```

Step 3: Open your template in modal window when you need it

```
//open modal
var yourModal = ModalManager.open('myCustomTemplate', {yourMessage: 'Hello, Modals!'});

//close modal
yourModal.close()
```

Step 4: Have fun!