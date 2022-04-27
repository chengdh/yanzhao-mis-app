/**
 * 部门选择控件
 */

// configure the class for runtime loading
if (!window.fbControls) window.fbControls = []
var options = null
function getDepartments() {
  const getDepartmentDataUrl = '/api/v1/dataset/search_read'
  return jQuery
    .post(getDepartmentDataUrl, {
      'input[arg]': {
        model: 'Department',
        fields: ['id', 'name'],
        domain: {
          is_active_eq: true
        },
        sort: 'order_by ASC'
      }
    })
    .then(function (data) {
      var orgs = JSON.parse(data.result)
      options = orgs.map(function (o) {
        return { label: o.name, value: o.id }
      })
    })
}
window.fbControls.push(function (controlClass, allControlClasses) {
  const controlSelect = allControlClasses.select

  /**
   * Star select class
   */
  class ControlDepartment extends controlSelect {
    /**
     * Class configuration - return the icons & label related to this control
     * @returndefinition object
     */
    static get definition() {
      return {
        i18n: {
          default: '部门选择'
        }
      }
    }
    constructor() {
      super()
      console.log('constructor department')
    }
    getDepartments() {
      var deps = jQuery('#form_builder,#form_render').data('departments')
      return deps.map(function (d) {
        return { label: d.text, value: d.id }
      })
    }

    /**
     * build a text DOM element, supporting other jquery text form-control's
     * @return {Object} DOM Element to be injected into the form.
     */
    build() {
      console.log('build department')
      this.config.type = 'select'
      this.config.className = 'form-control'
      this.config.values = this.getDepartments()
      var el = super.build()
      return el
    }

    /**
     * onRender callback
     */
    onRender() {
      console.log('onRender department')
      super.onRender()
    }
  }

  // register this control for the following types & text subtypes
  controlClass.register('department', ControlDepartment)
})
