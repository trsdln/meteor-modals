class BootstrapModalPlugin {
  constructor(_modal) {
    this._modal = _modal;
  }

// prepare rendered modal for show
  afterShow(rootElement) {
    const modalElement = rootElement.find('.modal').first();
    modalElement.modal('show');
    return modalElement.on('hidden.bs.modal', event => {
      return this._modal._onModalHidden();
    }
    );
  }

// hide modal (e.g. trigger hide animation etc.)
  beforeHide(rootElement, onModalHidden) {
    const modalElement = rootElement.find('.modal').first();
    return modalElement.modal('hide');
  }
}


class Modal {
  constructor(_modalDoc, _manager, _pluginConstructor) {
    this._modalDoc = _modalDoc;
    this._manager = _manager;
    this._pluginConstructor = _pluginConstructor;
    this._modalPlugin = new this._pluginConstructor(this);
  }

  _notifyAboutModalChange() { return this._manager._updateModal(this._modalDoc); }

  _onModalRendered(rootElement) {
    this._manager._modalRoots[this._modalDoc._id] = rootElement;
    return this._modalPlugin.afterShow(rootElement);
  }

  _getModalRoot() { return this._manager._modalRoots[this._modalDoc._id]; }

  _onModalHidden() { return this._manager._removeModal(this._modalDoc); }

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


class _ModalManager {
  constructor() {
    this._modalTemplates = new Mongo.Collection(null);
    this._plugins = {};
    this._modalRoots = {};
  }

  _setTemplateInstance(tmpl) { return this._templateInstace = tmpl; }

  _getInstanceById(id) {
    const doc = this._modalTemplates.findOne({ _id: id });
    const plugin = this._plugins[doc.plugin];
    if (!plugin) { throw new Error(`Plugin ${doc.plugin} doesn't exist`); }
    return new Modal(doc, this, plugin);
  }

  _updateModal(updatedModal) {
    const updateQuery = _.clone(updatedModal);
    delete updateQuery._id;
    return this._modalTemplates.update({ _id: updatedModal._id }, { $set: updateQuery });
  }

  _removeModal(modalToRemove) {
    delete this._modalRoots[modalToRemove._id];
    return this._modalTemplates.remove({ _id: modalToRemove._id });
  }

  registerPlugin(pluginName, pluginConstructor) {
    return this._plugins[pluginName] = pluginConstructor;
  }

  open(templateName, data, pluginName = 'bootstrap') {
    if (!this._templateInstace) {
      throw new Error(
        'ModalManager don\'t exist. Please put {{> ModalManager}} into body or layout template'
      );
    }

    const modalDoc = {
      name: templateName,
      plugin: pluginName,
      data
    };

    const modalId = this._modalTemplates.insert(modalDoc);
    return this._getInstanceById(modalId);
  }

  getInstanceByElement(domElement) {
// find out modal id we are in
    const currentModalElement = $(domElement).closest('.__modal-wrapper');
    const modalData = Blaze.getData(currentModalElement[0]);

    //get instance and close
    return this._getInstanceById(modalData._id);
  }
}

ModalManager = new _ModalManager();

ModalManager.registerPlugin('bootstrap', BootstrapModalPlugin);


Template.ModalManager.onCreated(function() {
  return ModalManager._setTemplateInstance(this);
});


Template.ModalManager.helpers({
  templates() { return ModalManager._modalTemplates.find({}); }});
