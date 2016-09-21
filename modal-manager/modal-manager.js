import { Template } from 'meteor/templating';
import { ModalManager } from './ModalManager';

import './modal/modal';
import './modal-manager.html';


Template.ModalManager.onCreated(function onCreated() {
  return ModalManager._setTemplateInstance(this);
});


Template.ModalManager.helpers({
  templates() {
    return ModalManager._modalTemplates.find({});
  },
});
