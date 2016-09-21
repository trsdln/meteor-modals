export class Modal {
  constructor(modalDoc, manager, pluginConstructor) {
    this._modalDoc = modalDoc;
    this._manager = manager;
    this._pluginConstructor = pluginConstructor;
    this._modalPlugin = new this._pluginConstructor(this);
  }

  _notifyAboutModalChange() {
    return this._manager._updateModal(this._modalDoc);
  }

  _onModalRendered(rootElement) {
    this._manager._modalRoots[this._modalDoc._id] = rootElement;
    return this._modalPlugin.afterShow(rootElement);
  }

  _getModalRoot() {
    return this._manager._modalRoots[this._modalDoc._id];
  }

  _onModalHidden() {
    return this._manager._removeModal(this._modalDoc);
  }

  close() {
    // trigger hide animation first
    this._modalDoc.visible = false;
    this._notifyAboutModalChange();

    // then remove template from dom
    const removeTemplateCb = () => this._onModalHidden();
    return this._modalPlugin.beforeHide(this._getModalRoot(), removeTemplateCb);
  }

  updateData(newDataContext) {
    this._modalDoc.data = newDataContext;
    return this._notifyAboutModalChange();
  }
}