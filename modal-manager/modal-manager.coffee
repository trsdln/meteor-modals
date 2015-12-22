class BootstrapModalPlugin
  constructor: (@_modal) ->

#prepare rendered modal for show
  afterShow: (rootElement) ->
    @_modalElement = rootElement.find('.modal')
    @_modalElement.modal('show')

# hide modal (e.g. trigger hide animation etc.)
  beforeHide: (onHideFinished) ->
    @_modalElement.modal('hide')
    setTimeout onHideFinished, 200


class Modal
  constructor: (@_modalDoc, @_manager, @_pluginConstructor) ->
    @_modalPlugin = new @_pluginConstructor(this)

  _notifyAboutModalChange: -> @_manager._updateModal @_modalDoc

  _onModalRendered: (rootElement) -> @_modalPlugin.afterShow(rootElement)

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
    @_plugins = {}

  _setTemplateInstance: (tmpl) -> @_templateInstace = tmpl

  _getInstanceById: (id) ->
    doc = @_modalTemplates.findOne({_id: id})
    plugin = @_plugins[doc.plugin]
    unless plugin then throw new Error("Plugin #{doc.plugin} doesn't exist")
    return new Modal(doc, @, plugin)

  _updateModal: (updatedModal) ->
    updateQuery = _.clone updatedModal
    delete updateQuery._id
    @_modalTemplates.update {_id: updatedModal._id}, {$set: updateQuery}

  _removeModal: (modalToRemove) ->
    @_modalTemplates.remove {_id: modalToRemove._id}

  registerPlugin: (pluginName, pluginConstructor) -> @_plugins[pluginName] = pluginConstructor

  open: (templateName, data, pluginName='bootstrap') ->
    unless @_templateInstace then throw new Error('ModalManager don\'t exist. Please put {{> ModalManager}} into body or layout template')

    modalDoc =
      name: templateName
      plugin: pluginName
      data: data

    modalId = @_modalTemplates.insert modalDoc
    return @_getInstanceById(modalId)

  getInstanceByElement: (domElement) ->
#find out modal id we are in
    currentModalElement = $(domElement).closest('.__modal-wrapper')
    modalData = Blaze.getData(currentModalElement[0])

    #get instance and close
    @_getInstanceById modalData._id


@ModalManager = new _ModalManager()

#register default plugin
ModalManager.registerPlugin('bootstrap', BootstrapModalPlugin)


Template.ModalManager.onCreated ->
  ModalManager._setTemplateInstance(@)


Template.ModalManager.helpers
  templates: -> ModalManager._modalTemplates.find({})