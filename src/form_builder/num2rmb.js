/**
 * 人民币大写控件
 */

// configure the class for runtime loading
if (!window.fbControls) window.fbControls = []
window.fbControls.push(function (controlClass) {
  /**
   * Star rating class
   */
  class ControlNum2RMB extends controlClass {
    /**
     * Class configuration - return the icons & label related to this control
     * @return definition object
     */
    static get definition() {
      return {
        i18n: {
          default: '金额'
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
      var content = `
        <input type="number" name="${this.config.name}" id="${this.config.name}" class="input-rmb form-control input-sm" />
        <span class="help-block">大写:<span class="rmb-dx"></span></span>
        `
      this.dom = this.markup('div', content, {
        id: this.config.id + '_wrapper',
        name: this.config.name + '_wrapper'
      })
      return this.dom
    }

    /**
     * onRender callback
     */
    onRender() {
      /**小写转大写**/
      function rmb(n) {
        if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return '数据非法'
        var unit = '千百拾亿千百拾万千百拾元角分',
          str = ''
        n += '00'
        var p = n.indexOf('.')
        if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2)
        unit = unit.substr(unit.length - n.length)
        for (var i = 0; i < n.length; i++) str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i)
        return str
          .replace(/零(千|百|拾|角)/g, '零')
          .replace(/(零)+/g, '零')
          .replace(/零(万|亿|元)/g, '$1')
          .replace(/(亿)万|壹(拾)/g, '$1$2')
          .replace(/^元零?|零分/g, '')
          .replace(/元$/g, '元整')
      }
      if (this.config.userData) {
        var num_rmb = this.config.userData[0]
        var rmb_dx = rmb(num_rmb)
        var _this = this
        jQuery(this.dom).find('.input-rmb').val(num_rmb)
        jQuery(this.dom).find('.rmb-dx').html(rmb_dx)
        jQuery(this.dom)
          .find('.input-rmb')
          .on('change', function () {
            var num_rmb = jQuery(_this.dom).find('.input-rmb').val()
            var rmb_dx = rmb(num_rmb)
            jQuery(_this.dom).find('.rmb-dx').html(rmb_dx)
          })
      }
      var _this = this
      jQuery(_this.dom)
        .find('.input-rmb')
        .on('change', function () {
          var num_rmb = jQuery(_this.dom).find('.input-rmb').val()
          var rmb_dx = rmb(num_rmb)
          jQuery(_this.dom).find('.rmb-dx').html(rmb_dx)
        })
    }
  }

  // register this control for the following types & text subtypes
  controlClass.register('ControlNum2RMB', ControlNum2RMB)
  return ControlNum2RMB
})
