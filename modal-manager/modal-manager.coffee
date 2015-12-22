class BootstrapModalPlugin
  constructor: (@_$rootElement, @_modal, @_manager) ->

  _getModalElement: () -> @_$rootElement.find('.modal')

#prepeare rendered modal for show
  afterShow: () ->
    @_getModalElement().modal('show')

# hide modal (e.g. trigger hide animation etc.)
  beforeHide: (onHideFinished) ->
    @_getModalElement().modal('hide')
    setTimeout onHideFinished, 200


class Modal
  constructor: (@_modalDoc, @_manager, @_pluginConstructor) ->
    rootElement = @_manager._templateInstace.$('__modal-manager-wrapper').find("[data-modalId=#{@_modalDoc._id}]")
    @_modalPlugin = new @_pluginConstructor(rootElement, this)
    @_modalPlugin.afterShow()

  _notifyAboutModalChange: -> @_manager._updateModal @_modalDoc

  close: () ->
#trigger hide animation first
    @_modalDoc.visible = false
    @_notifyAboutModalChange()

    #then remove template from dom
    removeTemplateCb = => @_manager._removeModal @_modalDoc
    @_modalPlugin.beforeHide(removeTemplateCb)

  updateData: (newDataContext) ->
    @_modalDoc.data = newDataContext
    @_notifyAboutModalChange()


class _ModalManager
  constructor: () ->
    @_modalTemplates = new Mongo.Collection(null)

  _setTemplateInstance: (tmpl) -> @_templateInstace = tmpl

  _getInstanceById: (id) ->
    doc = @_modalTemplates.findOne({_id: id})
    return new Modal(doc, @)

  _updateModal: (updatedModal) ->
    updateQuery = _.clone updatedModal
    delete updateQuery._id
    @_modalTemplates.update {_id: updatedModal._id}, {$set: updateQuery}

  _removeModal: (modalToRemove) ->
    @_modalTemplates.remove {_id: modalToRemove._id}

  open: (templateName, data, pluginConstructor=BootstrapModalPlugin) ->
    modalDoc =
      name: templateName
      data: data

    modalDoc._id = @_modalTemplates.insert modalDoc

    return new Modal(modalDoc, @, pluginConstructor)

  getInstanceByElement: (domElement) ->
#find out modal id we are in
    currentModalElement = $(domElement).closest('.__modal-wrapper')
    modalData = Blaze.getData(currentModalElement[0])

    #get instance and close
    @_getInstanceById modalData._id


@ModalManager = new _ModalManager()


Template.ModalManager.onCreated ->
  ModalManager._setTemplateInstance(@)


Template.ModalManager.helpers
  templates: -> ModalManager._modalTemplates.find({})