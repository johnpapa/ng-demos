# Deployment  
# ----------  
  
echo Handling node.js deployment.  
  
# 1. Select node version  
selectNodeVersion  
  
# 2. Install npm packages  
if [ -e "$DEPLOYMENT_SOURCE/package.json" ]; then  
  eval $NPM_CMD install  
  exitWithMessageOnError "npm failed"  
fi  

# 3. KuduSync to Target  
"$KUDU_SYNC_CMD" -v 500 -f "$DEPLOYMENT_SOURCE/dist" -t "$DEPLOYMENT_TARGET" -n "$NEXT_MANIFEST_PATH" -p "$PREVIOUS_MANIFEST_PATH" -i ".git;.hg;.deployment;deploy.sh"  
exitWithMessageOnError "Kudu Sync to Target failed" 