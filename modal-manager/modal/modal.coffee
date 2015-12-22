Template._Modal.onRendered ->
  console.log 'rendered', @
  @modalInstance = ModalManager._getInstanceById @data._id
  @modalInstance._onModalRendered @$('.__modal-wrapper')


Template._Modal.helpers
  isHidden: -> @visible is false


Template._Modal.events
  'click .close-modal-button': (event, tmpl) ->
    tmpl.modalInstance.close()