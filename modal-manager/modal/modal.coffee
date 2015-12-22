Template._Modal.helpers
  isHidden: -> @visible is false


Template._Modal.events
  'click .close-modal-button': (event) ->
    modal = ModalManager.getInstanceByElement event.target
    modal.close()