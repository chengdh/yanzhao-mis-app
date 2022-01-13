/**
 * 文件上传控件
 */
var filer_default_opts = {
  changeInput2:
    '<div class="jFiler-input-dragDrop"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div></div><a class="jFiler-input-choose-btn btn-custom blue-light">选择文件</a></div></div>',
  templates: {
    box: '<ul class="jFiler-items-list jFiler-items-grid" style="display: flex;flex-wrap: wrap;"></ul>',
    item: '<li class="jFiler-item">\
                              <div class="jFiler-item-container">\
                                  <div class="jFiler-item-inner">\
                                      <div class="jFiler-item-thumb">\
                                          <div class="jFiler-item-status"></div>\
                                          <div class="jFiler-item-thumb-overlay">\
                                              <div class="jFiler-item-info">\
                                                  <div style="display:table-cell;vertical-align: middle;">\
                                                      <span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
                                                      <span class="jFiler-item-others">{{fi-size2}}</span>\
                                                  </div>\
                                              </div>\
                                          </div>\
                                          {{fi-image}}\
                                      </div>\
                                      <div class="jFiler-item-assets jFiler-row">\
                                          <ul class="list-inline pull-left">\
                                              <li>{{fi-progressBar}}</li>\
                                          </ul>\
                                          <ul class="list-inline pull-right">\
                                              <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
                                          </ul>\
                                      </div>\
                                  </div>\
                              </div>\
                          </li>',
    itemAppend:
      '<li class="jFiler-item" >\
                                  <div class="jFiler-item-container">\
                                      <div class="jFiler-item-inner">\
                                          <div class="jFiler-item-thumb">\
                                              <div class="jFiler-item-status"></div>\
                                              <div class="jFiler-item-thumb-overlay">\
                                                  <div class="jFiler-item-info">\
                                                      <div style="display:table-cell;vertical-align: middle;">\
                                                          <span class="jFiler-item-title"><b title="{{fi-name}}">{{fi-name}}</b></span>\
                                                          <span class="jFiler-item-others">{{fi-size2}}</span>\
                                                      </div>\
                                                  </div>\
                                              </div>\
                                              {{fi-image}}\
                                          </div>\
                                          <div class="jFiler-item-assets jFiler-row">\
                                              <ul class="list-inline pull-left">\
                                                  <li><span class="jFiler-item-others">{{fi-icon}}</span></li>\
                                              </ul>\
                                              <ul class="list-inline pull-right">\
                                                  <li><a class="icon-jfi-trash jFiler-item-trash-action"></a></li>\
                                              </ul>\
                                          </div>\
                                      </div>\
                                  </div>\
                              </li>',

    progressBar: '<div class="bar"></div>',
    itemAppendToEnd: false,
    removeConfirmation: true,
    _selectors: {
      list: ".jFiler-items-list",
      item: ".jFiler-item",
      progressBar: ".bar",
      remove: ".jFiler-item-trash-action",
    },
  },

  dragDrop: {},

  captions: {
    button: "选择文件",
    feedback: "选择要上传的文件",
    feedback2: "文件已选择",
    drop: "拖放文件上传",
    removeConfirmation: "确定删除该文件?",
    errors: {
      filesLimit: "可上传{{fi-limit}}个文件.",
      filesType: "只能上传图片文件.",
      filesSize: "{{fi-name}}太大!上传文件不大于 {{fi-fileMaxSize}} MB.",
      filesSizeAll: "文件太大! 上传文件不大于{{fi-maxSize}} MB.",
      folderUpload: "无法上传文件夹.",
    },
  },
  dialogs: {
    alert: function (text) {
      return alert(text);
    },
    confirm: function (text, callback) {
      bootbox.confirm({
        size: "small",
        message: "Are you sure?",
        callback: function (result) {
          /* result is a boolean; true = OK, false = Cancel*/
        },
      });
    },
  },
};

// configure the class for runtime loading
if (!window.fbControls) window.fbControls = [];
window.fbControls.push(function (controlClass) {
  /**
   * Star rating class
   */
  class FileUploader extends controlClass {
    /**
     * Class configuration - return the icons & label related to this control
     * @return definition object
     */
    static get definition() {
      return {
        i18n: {
          default: "图片上传",
        },
      };
    }

    /**
     * javascript & css to load
     */
    configure() {
      // this.js = "/javascripts/jquery.filer-1.3.0/js/jquery.filer.min.js";
      // this.css = [
      //   "/javascripts/jquery.filer-1.3.0/css/jquery.filer.css",
      //   "/javascripts/jquery.filer-1.3.0/css/themes/jquery.filer-dragdropbox-theme.css",
      // ];
    }

    /**
     * build a text DOM element, supporting other jquery text form-control's
     * @return {Object} DOM Element to be injected into the form.
     */
    build() {
      var content = `
        <input type="file" name="file_upload[photo]" id="filer_input" multiple="multiple">
        <input type="hidden" name="${this.config.name}" id="${this.config.name}" >
        <div style="display: flex;flex-wrap: wrap;" class="file_list"></div>
        `;
      //将已上传的文件信息储存在Input的value中,便于后续显示
      this.dom = this.markup("div", null, {
        id: this.config.id + "_wrapper",
        name: this.config.name + "_wrapper",
      });
      return this.dom;
    }
    setUserData(userData) {
      // jQuery(this.dom).find("input[type=hidden]").val(JSON.stringify(userData));
    }

    /**
     * onRender callback
     */
    onRender() {
    }
  }

  // register this control for the following types & text subtypes
  controlClass.register("FileUploader", FileUploader);
  return FileUploader;
});