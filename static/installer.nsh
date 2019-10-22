！macro customHeader
   ！system  “echo''> $ {BUILD_RESOURCES_DIR} / customHeader ” 
！macroend

！macro preInit
   ; 这个宏插在NSIS的开头.OnInit回调
  ！系统 “echo''> $ {BUILD_RESOURCES_DIR} / preInit ” 
！macroend

！macro customInit
   ！system  “echo''> $ {BUILD_RESOURCES_DIR} / customInit ” 
！macroend

！macro customInstall
   ！system  “echo''> $ {BUILD_RESOURCES_DIR} / customInstall ” 
！macroend

！macro customInstallMode #set
   $ isForceMachineInstall或$ isForceCurrentInstall 
  ＃强制执行一种或其他模式。
！macroend