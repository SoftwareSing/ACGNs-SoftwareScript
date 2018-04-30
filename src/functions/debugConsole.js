/*************************************/
/**************DebugMode**************/

const debugMode = false;
//debugMode == true 的時候，會console更多資訊供debug

export function debugConsole(msg) {
  if (debugMode) {
    console.log(msg);
  }
}


/**************DebugMode**************/
/*************************************/
