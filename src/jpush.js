const onDeviceReady = function () {
  document.addEventListener(
    'jpush.receiveRegistrationId',
    function (event) {
      console.log('receiveRegistrationId' + JSON.stringify(event))
    },
    false
  )
  initiateUI()
}

const getRegistrationID = function () {
  window.JPush.getRegistrationID(onGetRegistrationID)
}

const onGetRegistrationID = function (data) {
  try {
    console.log('JPushPlugin:registrationID is ' + data)
  } catch (exception) {
    console.log(exception)
  }
}

const onTagsWithAlias = function (event) {
  try {
    console.log('onTagsWithAlias')
    let result = 'result code:' + event.resultCode + ' '
    result += 'tags:' + event.tags + ' '
    result += 'alias:' + event.alias + ' '
    console.log(result)
  } catch (exception) {
    console.log(exception)
  }
}

var badgeNumb = 0
const onOpenNotification = function (event) {
  try {
    var alertContent
    if (device.platform === 'Android') {
      alertContent = event.alert
    } else {
      alertContent = event.aps.alert
    }

    badgeNumb = badgeNumb - 1
    badgeNumb = badgeNumb <= 0 ? 0 : badgeNumb
    window.JPush.setBadgeNumber(badgeNumb)

    console.log('open Notification:' + alertContent)
  } catch (exception) {
    console.log('JPushPlugin:onOpenNotification' + exception)
  }
}

const onReceiveNotification = function (event) {
  try {
    var alertContent
    if (device.platform === 'Android') {
      alertContent = event.alert
    } else {
      alertContent = event.aps.alert
    }
    console.log(alertContent)

    badgeNumb = badgeNumb + 1
    window.JPush.setBadgeNumber(badgeNumb)
  } catch (exception) {
    console.log(exception)
  }
}

const onReceiveMessage = function (event) {
  try {
    var message
    if (device.platform === 'Android') {
      message = event.message
    } else {
      message = event.content
    }
    console.log(message)

    badgeNumb = badgeNumb + 1
    window.JPush.setBadgeNumber(badgeNumb)
  } catch (exception) {
    console.log('JPushPlugin:onReceiveMessage-->' + exception)
  }
}

const onResume = function (event) {
  try {
    badgeNumb = 0
    window.JPush.setBadgeNumber(0)
  } catch (exception) {
    console.log('onResume-->' + exception)
  }
}

const initiateUI = function () {
  try {
    window.JPush.init()
    window.JPush.setDebugMode(true)
    window.setTimeout(getRegistrationID, 1000)

    if (device.platform !== 'Android') {
      window.JPush.setApplicationIconBadgeNumber(0)
    }
  } catch (exception) {
    console.log(exception)
  }
}
document.addEventListener('deviceready', onDeviceReady, false)
document.addEventListener('jpush.openNotification', onOpenNotification, false)
document.addEventListener('jpush.receiveNotification', onReceiveNotification, false)
document.addEventListener('jpush.receiveMessage', onReceiveMessage, false)
document.addEventListener('resume', onResume, false)