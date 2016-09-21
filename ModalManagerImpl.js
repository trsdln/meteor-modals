import { Mongo } from 'meteor/mongo';
import { $ } from 'meteor/jquery';

import { Modal } from './Modal';


export class ModalManagerImpl {
  constructor() {
    this._modalTemplates = new Mongo.Collection(null);
    this._plugins = {};
    this._modalRoots = {};
  }

  _setTemplateInstance(tmpl) {
    this._templateInstace = tmpl;
  }

  _getInstanceById(id) {
    const doc = this._modalTemplates.findOne({ _id: id });
    const plugin = this._plugins[doc.plugin];
    if (!plugin) {
      throw new Error(`Plugin ${doc.plugin} doesn't exist`);
    }
    return new Modal(doc, this, plugin);
  }

  _updateModal(updatedModal) {
    const updateQuery = Object.assign({}, updatedModal);
    delete updateQuery._id;
    return this._modalTemplates.update({ _id: updatedModal._id }, { $set: updateQuery });
  }

  _removeModal(modalToRemove) {
    delete this._modalRoots[modalToRemove._id];
    return this._modalTemplates.remove({ _id: modalToRemove._id });
  }

  registerPlugin(pluginName, pluginConstructor) {
    this._plugins[pluginName] = pluginConstructor;
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
      data,
    };

    const modalId = this._modalTemplates.insert(modalDoc);
    return this._getInstanceById(modalId);
  }

  getInstanceByElement(domElement) {
    // find out modal id we are in
    const currentModalElement = $(domElement).closest('.__modal-wrapper');
    const modalData = Blaze.getData(currentModalElement[0]);

    // get instance and close
    return this._getInstanceById(modalData._id);
  }
}
