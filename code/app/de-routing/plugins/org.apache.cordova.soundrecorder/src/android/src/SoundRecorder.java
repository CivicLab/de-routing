/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/
package de.drl.probetool.soundrecorder;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.Toast;

/**
 * This class provides access to notifications on the device.
 */
public class SoundRecorder extends CordovaPlugin {
	
	CallbackContext callback = null;

    /**
     * Constructor.
     */
    public SoundRecorder() {
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArray of arguments for the plugin.
     * @param callbackContext   The callback context used when calling back into JavaScript.
     * @return                  True when the action was valid, false otherwise.
     */
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        
    	JSONObject arg_object = args.getJSONObject(0);
    	
    	if (action.equals("open")) {
            this.startRecordActivity(arg_object.getInt("duration"));
            callback = callbackContext;
            return true;
        } 
        
        callbackContext.error("Invalid action");
        return false;
    }

    private void startRecordActivity(int record_duration) {
    		
    	Intent intent = new Intent(this.cordova.getActivity(),SoundRecorderActivity.class);
    	intent.putExtra("duration", record_duration);
        this.cordova.startActivityForResult((CordovaPlugin) this, intent, 1);
	}
    
    @Override
    public void onActivityResult(int requestCode, int resultCode, final Intent intent) {

    	if (requestCode == 1) {
    		if(resultCode == Activity.RESULT_OK){
    			callback.success(intent.getStringExtra("path"));
    		} else if (resultCode == Activity.RESULT_CANCELED) {
    			callback.error("error");
    		}
    	}

    }
}
