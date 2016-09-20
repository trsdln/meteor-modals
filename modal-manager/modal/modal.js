Template._Modal.onRendered(function() {
  this.modalInstance = ModalManager._getInstanceById(this.data._id);
  return this.modalInstance._onModalRendered(this.$('.__modal-wrapper'));
});

Template._Modal.helpers({
  isHidden() { return this.visible === false; } });

Template._Modal.events({
  'click .close-modal-button'(event, instance) {
    return instance.modalInstance.close();
  }
});
