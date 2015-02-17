# DeRouting
-----------

## SETUP DEV ENVIRONMENT FOR DE-ROUTING APP
follow this guide: http://cordova.apache.org/docs/en/3.5.0/guide_platforms_android_index.md.html

### install homebrew
ruby -e "$(curl -fsSL https://raw.github.com/mxcl/homebrew/go/install)"
brew update

### install ant
brew install ant

### download and install node.js
http://nodejs.org/

### install cordova
sudo npm install -g cordova

### download and install android sdk
1. from http://developer.android.com/sdk/installing/index.html?pkg=adt
2. start eclipse -> SDK Manager install packages: android 2.3 (api 10)
3. import project from existing Code, choose code/app/de-routing/platform/android


## BUILD COMMANDS

1. cordova build android
2. cordova run android (to run it on the android phone)


## MISC CHANGES

file transder plugin:
----------------------
this code stops the tansfer from failing:
options.chunkedMode = true;
options.headers = {Connection: "close"};

media capture plugin:
---------------------
change function:

    private String getTempDirectoryPath() {
    File cache = null;

    // Use internal storage
    //cache = cordova.getActivity().getCacheDir();
    cache = cordova.getActivity().getExternalCacheDir();
    

    // Create the cache directory if it doesn't exist
    cache.mkdirs();
    return cache.getAbsolutePath();
}

soundrecord plugin:
-------------------

1. right now you need to copy the files in the "res" folder manually to the android repository
2. add to androidmanifest.xml:
	
	\<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
	\<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
	\<uses-permission android:name="android.permission.RECORD_AUDIO" />
    
3. add activity to androidManifest.xml:

	\<activity android:screenOrientation="portrait" android:label="Sound Recorder" android:name="org.apache.cordova.soundrecorder.SoundRecorderActivity" android:theme="@android:style/Theme.Black.NoTitleBar">
	\</activity>
