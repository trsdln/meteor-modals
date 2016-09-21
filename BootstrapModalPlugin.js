export class BootstrapModalPlugin {
  constructor(modal) {
    this._modal = modal;
  }

  // prepare rendered modal for show
  afterShow(rootElement) {
    const modalElement = rootElement.find('.modal').first();
    modalElement.modal('show');
    return modalElement.on('hidden.bs.modal', () => this._modal._onModalHidden());
  }

  // hide modal (e.g. trigger hide animation etc.)
  beforeHide(rootElement) {
    const modalElement = rootElement.find('.modal').first();
    return modalElement.modal('hide');
  }
}
