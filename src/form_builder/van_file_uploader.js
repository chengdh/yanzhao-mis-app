/**
 * 文件上传
 */

// configure the class for runtime loading
if (!window.fbControls) window.fbControls = []
window.fbControls.push(function (controlClass) {
  /**
   * Star rating class
   */
  class VanFileUploader extends controlClass {
    /**
     * Class configuration - return the icons & label related to this control
     * @return definition object
     */
    static get definition() {
      return {
        i18n: {
          default: '文件上传'
        }
      }
    }

    /**
     * javascript & css to load
     */
    configure() {
      //   this.js = '//cdnjs.cloudflare.com/ajax/libs/rateYo/2.2.0/jquery.rateyo.min.js'
      //   this.css = '//cdnjs.cloudflare.com/ajax/libs/rateYo/2.2.0/jquery.rateyo.min.css'
    }

    /**
     * build a text DOM element, supporting other jquery text form-control's
     * @return {Object} DOM Element to be injected into the form.
     */
    build() {
      this.dom = this.markup('van-uploader', null, {
        id: this.config.id + '_wrapper',
        name: this.config.name + '_wrapper'
      })
      return this.dom
    }

    /**
     * onRender callback
     */
    onRender() {
      if (this.config.userData) {
      }
    }
  }

  // register this control for the following types & text subtypes
  controlClass.register('VanFileUploader', VanFileUploader)
  return VanFileUploader
})
