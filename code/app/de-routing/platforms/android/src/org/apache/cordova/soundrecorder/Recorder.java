package org.apache.cordova.soundrecorder;

import java.io.File;
import java.io.IOException;

import android.app.Activity;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Toast;

public class Recorder {
	
	private MediaRecorder mRecorder;
	private MediaPlayer mPlayer;
	private File audioFile = null;
	
	private int duration;
	private Activity activity;
	
	public Recorder(int duration, Activity activity) {
		this.duration = duration;
		this.activity = activity;
	}
	
	public void startRecording() throws Exception {
		
		File sampleDir = activity.getExternalFilesDir(Environment.DIRECTORY_MUSIC);
	    audioFile = File.createTempFile("sound", ".3gp", sampleDir);
	    
	    mRecorder = new MediaRecorder();
	    mRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
	    mRecorder.setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP);
	    mRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB);
	    mRecorder.setAudioEncodingBitRate(16);
	    mRecorder.setAudioSamplingRate(44100);
	    mRecorder.setOutputFile(audioFile.getAbsolutePath());
	    mRecorder.prepare();
	    mRecorder.start();
	}
	
	public void stopRecording() {
		if (mRecorder == null)
			return;
		
		mRecorder.stop();
		mRecorder.release();
		mPlayer = null;
	}
	
	//returns length of playback
	public int startPlayback(OnCompletionListener listener) throws IllegalArgumentException, SecurityException, IllegalStateException, IOException {
		mPlayer = new MediaPlayer();
		mPlayer.setOnCompletionListener(listener);
        mPlayer.setDataSource(audioFile.getAbsolutePath());
        mPlayer.prepare();
        mPlayer.start();
        
        return mPlayer.getDuration(); 
	}
	
	public void stopPlayback() {
		if (mPlayer == null)
			return;
		
		mPlayer.release();
        mPlayer = null;
	}
	
	public void resetRecording() {
		audioFile = null;
		
		stopRecording();
		stopPlayback();
	}
	
	public int getCurrentPosition() {
		if (mPlayer != null)
			return mPlayer.getCurrentPosition();
		else
			return 0;
	}
	
	public boolean isPlaying() {
		if (mPlayer != null)
			return mPlayer.isPlaying();
		else
			return false;
	}
	
	public int getMaxDuration() {
		return this.duration;
	}
	
	public Uri save() {
		
		if (audioFile == null)
			return null;
		
	    ContentValues values = new ContentValues(4);
	    long current = System.currentTimeMillis();
	    values.put(MediaStore.Audio.Media.TITLE, "audio" + audioFile.getName());
	    values.put(MediaStore.Audio.Media.DATE_ADDED, (int) (current / 1000));
	    values.put(MediaStore.Audio.Media.MIME_TYPE, "audio/3gpp");
	    values.put(MediaStore.Audio.Media.DATA, audioFile.getAbsolutePath());
	    ContentResolver contentResolver = activity.getContentResolver();

	    Uri base = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
	    Uri newUri = contentResolver.insert(base, values);

	    //activity.sendBroadcast(new Intent(Intent.ACTION_MEDIA_SCANNER_SCAN_FILE, newUri));
	    return newUri;
	}

}
