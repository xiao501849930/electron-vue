<template>
  <div >
    <img  src=""  id="img">
  </div>
</template>

<script>
  const electron = require('electron')
  const desktopCapturer = electron.desktopCapturer
  const electronScreen = electron.screen
  const shell = electron.shell

  const fs = require('fs')
  const os = require('os')
  const path = require('path')

  const screenshot = document.getElementById('screen-shot')

  const thumbSize = determineScreenShotSize()
  let options = { types: ['screen'], thumbnailSize: thumbSize }


  desktopCapturer.getSources(options, function (error, sources) {
    if (error) return console.log(error)

    sources.forEach(function (source) {
      if (source.name === 'Entire screen' || source.name === 'Screen 1') {
        // document.querySelector('img').src = source.thumbnail.toDataURL();
  }
  })
  })

  setTimeout(function () {
    $("#body").mousemove(function (e) {
      // $("#kk").offset({top:e.pageY,left:e.pageX})
    });
  },1000)


  setTimeout(function () {
    desktopCapturer.getSources(options, function (error, sources) {
      if (error) return console.log(error)

      sources.forEach(function (source) {
        if (source.name === 'Entire screen' || source.name === 'Screen 1') {
          // $("#img").css("background-image","url("+source.thumbnail.toDataURL()+")")
          $("#img").attr("src",source.thumbnail.toDataURL());
          // document.querySelector('img').src = source.thumbnail.toDataURL();
          $("#img").imageLens({ lensSize: 300 });
          /*fs.writeFile(screenshotPath, source.thumbnail.toPNG(), function (error) {
            if (error) return console.log(error)
            shell.openExternal('file://' + screenshotPath)
            const message = `截图保存到: ${screenshotPath}`
            screenshotMsg.textContent = message
          })*/
        }
      })
    })

  },5000)



  function determineScreenShotSize () {
    const screenSize = electronScreen.getPrimaryDisplay().workAreaSize
    const maxDimension = Math.max(screenSize.width, screenSize.height)
    return {
      width: maxDimension * window.devicePixelRatio,
      height: maxDimension * window.devicePixelRatio
    }
  }




</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  -webkit-scrollbar {
    display: none;
  }
  body { margin: 0px; font-family: "Trebuchet MS", Arial, Sans-Serif; font-size: 14px;overflow-x: hidden;
    overflow-y: hidden; }
  a { color: #0066CC; text-decoration: none; }
  a:hover { color: #CC0000; text-decoration: underline; }

</style>
