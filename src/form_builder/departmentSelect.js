/**
 * 部门选择控件
 */

// configure the class for runtime loading
if (!window.fbControls) window.fbControls = [];
window.fbControls.push(function (controlClass) {
  /**
   * Star rating class
   */
  class controlDepartmentSelect extends controlClass {
    /**
     * Class configuration - return the icons & label related to this control
     * @returndefinition object
     */
    static get definition() {
      return {
        icon: "🌟",
        i18n: {
          default: "部门选择",
        },
      };
    }

    /**
     * javascript & css to load
     */
    configure() {
        //依赖于selectpicker
      //   this.js = '//cdnjs.cloudflare.com/ajax/libs/rateYo/2.2.0/jquery.rateyo.min.js'
      //   this.css = '//cdnjs.cloudflare.com/ajax/libs/rateYo/2.2.0/jquery.rateyo.min.css'
    }

    /**
     * build a text DOM element, supporting other jquery text form-control's
     * @return {Object} DOM Element to be injected into the form.
     */
    build() {
      return this.markup("select", null, {
        id: this.config.name,
        class: "select_picker form-control input-sm",
        "data-actions-box": true,
        "data-deselect-all-text": "不选",
        "data-select-all-text": "全选",
        "data-live-search": "true",
        "data-none-selected-text": "选择部门",
      });
    }

    /**
     * onRender callback
     */
    onRender() {
    //   jQuery("#" + this.config.name).selectpicker();
    }
  }

  // register this control for the following types & text subtypes
  controlClass.register("controlDepartmentSelect", controlDepartmentSelect);
  return controlDepartmentSelect;
});
