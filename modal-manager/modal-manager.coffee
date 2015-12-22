class Modal
  constructor: (@_modalDoc, @_manager) ->

  _notifyAboutModalChange: -> @_manager._updateModal @_modalDoc

  close: () ->
#trigger hide animation first
    @_modalDoc.visible = false
    @_notifyAboutModalChange()

    #then remove template from dom
    removeTemplateCb = => @_manager._removeModal @_modalDoc

    #todo: make this delay configurable (in case of custom animation)
    Meteor.setTimeout removeTemplateCb, 1000

  updateData: (newDataContext) ->
    @_modalDoc.data = newDataContext
    @_notifyAboutModalChange()


class _ModalManager
  constructor: () ->
    @_modalTemplates = new Mongo.Collection(null)

  _getInstanceById: (id) ->
    doc = @_modalTemplates.findOne({_id: id})
    return new Modal(doc, @)

  _updateModal: (updatedModal) ->
    updateQuery = _.clone updatedModal
    delete updateQuery._id
    @_modalTemplates.update {_id: updatedModal._id}, {$set: updateQuery}

  _removeModal: (modalToRemove) ->
    @_modalTemplates.remove {_id: modalToRemove._id}

  open: (templateName, data) ->
    modalDoc =
      name: templateName
      data: data

    modalDoc._id = @_modalTemplates.insert modalDoc

    return new Modal(modalDoc, @)

  getInstanceByElement: (domElement) ->
    #find out modal id we are in
    currentModalElement = $(domElement).closest('.modal')
    modalData = Blaze.getData(currentModalElement[0])

    #get instance and close
    @_getInstanceById modalData._id


@ModalManager = new _ModalManager()


Template.ModalManager.helpers
  templates: -> ModalManager._modalTemplates.find({})