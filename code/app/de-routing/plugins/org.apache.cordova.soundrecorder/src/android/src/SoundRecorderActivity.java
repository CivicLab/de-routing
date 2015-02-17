package de.drl.probetool.soundrecorder;

import de.drl.probetool.R;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.net.Uri;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.provider.MediaStore;
import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.view.Menu;
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;

public class SoundRecorderActivity extends Activity {
	
	Recorder recorder = null;
	CountDownTimer timer = null;
	State state = State.INIT;
	
	int recordDuration = 10000;
	
	Button recordButton;
	Button playButton;
	Button button1;
	Button button2;
	Button restartButton;
	Button acceptButton;
	
	public enum State {
		   INIT, RECORDING, PLAYBACK, STOPPED
	}
	
	String TEXT_PLAYBACK = "Tap to stop playback.";
	String TEXT_RECORDING = "Recording... Tap again to stop.";
	String TEXT_INIT = "Tap to start recording.";
	String TEXT_STOPPED = "Tap to start playback.";
	
	private OnClickListener recordButtonListener = new OnClickListener() {

		@Override
		public void onClick(View arg0) {
			if (state == State.INIT)
				startRecording();
			else if (state == State.RECORDING)
				stopRecording();
			else if (state == State.STOPPED)
				startPlayback();
			else if (state == State.PLAYBACK)
				stopPlayback();
			
		}
	};

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_sound_recorder);
		
		recordButton = (Button)findViewById(R.id.recordButton);
		playButton = (Button)findViewById(R.id.playButton);
		button1 = (Button)findViewById(R.id.button1);
		button2 = (Button)findViewById(R.id.button2);
		restartButton = (Button)findViewById(R.id.restartButton);
		acceptButton = (Button)findViewById(R.id.acceptButton);
		
		button1.setOnClickListener(this.recordButtonListener);
		button2.setOnClickListener(this.recordButtonListener);
		recordButton.setOnClickListener(this.recordButtonListener);
		playButton.setOnClickListener(this.recordButtonListener);
		
		restartButton.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				resetRecording();
			}
		});
		
		acceptButton.setOnClickListener(new OnClickListener() {
			
			@Override
			public void onClick(View v) {
				saveRecording();
			}

		});
		
		Bundle extras = getIntent().getExtras();

        if ( extras != null )
        {
        	recordDuration = extras.getInt("duration");
        }
        
        recordDuration = Math.min(Math.max(1000,recordDuration),99000); //between 1 and 99 seconds
	
		recorder = new Recorder(recordDuration,this);
		resetRecording();
	}
	
	@Override
	public boolean onTouchEvent(MotionEvent event) {
		return false;
	}
	
	public void startRecording() {
		
		state = State.RECORDING;
		button2.setText(TEXT_RECORDING);
			
		//startTimer
		timer = new CountDownTimer(recorder.getMaxDuration(), 10) {

		     public void onTick(long millisUntilFinished) { 
		    	button1.setText(convertTimeString(millisUntilFinished));
		     }

		     public void onFinish() {
		    	 stopRecording();
		     }
		  }.start();
		 

		  try {
			  recorder.startRecording();
		  } catch (Exception e) {
			  sendError(e.getMessage());
		  }
			 
		
	}
	
	public void stopRecording() {

		//stop timer
		if (timer != null)
			timer.cancel();
		
		recorder.stopRecording();
		
		state = State.STOPPED;
		button2.setText(TEXT_STOPPED);
		restartButton.setVisibility(View.VISIBLE);
		acceptButton.setVisibility(View.VISIBLE);
		recordButton.setVisibility(View.GONE);
		playButton.setVisibility(View.VISIBLE);
		
	
	}
	
	public void startPlayback() {
		
		state = State.PLAYBACK;
		button2.setText(TEXT_PLAYBACK);
		
		try {
			
			recorder.startPlayback(new OnCompletionListener() {
				@Override
				public void onCompletion(MediaPlayer mp) {
					stopPlayback();
				}
			});
			
			//startTimer
			timer = new CountDownTimer(recorder.getMaxDuration(), 10) {

				public void onTick(long millisUntilFinished) { 
					button1.setText(convertTimeString(recorder.getCurrentPosition()));
				}

				public void onFinish() {
					//nothing
				}
			}.start();
			
		} catch (Exception e) {
			sendError(e.getMessage());
		}
		

		
	}
	
	public void stopPlayback() {
		if (timer != null)
			timer.cancel();
		
		recorder.stopPlayback();
		
		state = State.STOPPED;
		button2.setText(TEXT_STOPPED);
		button1.setText(convertTimeString(0));
		
		
	}
	
	public void resetRecording() {
		
		if (timer != null) {
			stopPlayback();
		}
		
		state = State.INIT;
		button2.setText(TEXT_INIT);
		restartButton.setVisibility(View.INVISIBLE);
		acceptButton.setVisibility(View.INVISIBLE);
		recordButton.setVisibility(View.VISIBLE);
		playButton.setVisibility(View.GONE);
		button1.setText(convertTimeString(recorder.getMaxDuration()));
		
		
	}
	
	public void saveRecording() {
		Uri uri = recorder.save();
		
		//get full path from uri
		String path = getRealPathFromURI(uri);
		
		//send back the data
		Intent returnIntent = new Intent();
		returnIntent.putExtra("path",path);
		setResult(RESULT_OK,returnIntent);     
		finish();
	}
	
	public void sendError(String error) {
		//send back the data
		Intent returnIntent = new Intent();
		returnIntent.putExtra("error",error);
		setResult(RESULT_CANCELED,returnIntent);     
		finish();
	}
	
	/*
	 *    HELPER FUNCTIONS
	 */
	
	private String convertTimeString(long milliseconds) {
		
		long hsecs= (milliseconds % 1000) / 10;
    	long secs = milliseconds / 1000;
    	
    	String secString = Long.toString(secs);
    	if (secs < 10)
    		secString = "0"+secString;
    	
    	String hsecString = Long.toString(hsecs);
    	if (hsecs < 10)
    		hsecString = "0"+hsecString;
    	
    	return(secString+":"+hsecString);
	}
	
	private String getRealPathFromURI(Uri contentUri) 
	{
	     String[] proj = { MediaStore.Audio.Media.DATA };
	     Cursor cursor = this.getContentResolver().query(contentUri, proj, null, null, null);
	     int column_index = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DATA);
	     cursor.moveToFirst();
	     return cursor.getString(column_index);
	}
	

}
